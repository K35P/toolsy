use crate::settings::{AppSettings, SettingsStore};
use image::{codecs::{avif::AvifEncoder, jpeg::JpegEncoder}, DynamicImage, ImageEncoder, ImageFormat};
use serde::{Deserialize, Serialize};
use std::{fs, io::BufWriter, path::{Path, PathBuf}, sync::Mutex, time::UNIX_EPOCH};
use tauri::{AppHandle, Manager, State};

fn effective_output_dir(app: &AppHandle, settings: &Mutex<SettingsStore>) -> Result<PathBuf, String> {
    let mut store = settings.lock().map_err(|_| "Impostazioni non disponibili")?;
    store.load(app)?;
    if !store.0.output_path.trim().is_empty() {
        return Ok(PathBuf::from(store.0.output_path.trim()));
    }
    let desktop = app.path().desktop_dir().map_err(|e| e.to_string())?;
    Ok(desktop.join("Toolsy Conversions"))
}

#[tauri::command]
pub fn get_platform() -> &'static str {
    if cfg!(target_os = "windows") { "win32" } else if cfg!(target_os = "macos") { "darwin" } else { "linux" }
}

#[tauri::command]
pub fn ensure_conversions_dir(app: AppHandle, settings: State<'_, Mutex<SettingsStore>>) -> Result<String, String> {
    let path = effective_output_dir(&app, &settings)?;
    fs::create_dir_all(&path).map_err(|e| format!("Impossibile creare la cartella: {e}"))?;
    Ok(path.to_string_lossy().into_owned())
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ConvertedFile {
    name: String,
    path: String,
    size: u64,
    modified: String,
    is_directory: bool,
}

#[tauri::command]
pub fn list_converted_files(app: AppHandle, settings: State<'_, Mutex<SettingsStore>>) -> Result<Vec<ConvertedFile>, String> {
    let dir = effective_output_dir(&app, &settings)?;
    if !dir.exists() { return Ok(Vec::new()); }
    let mut items = fs::read_dir(&dir).map_err(|e| e.to_string())?
        .filter_map(Result::ok)
        .filter_map(|entry| {
            let meta = entry.metadata().ok()?;
            let modified = meta.modified().unwrap_or(UNIX_EPOCH).duration_since(UNIX_EPOCH).unwrap_or_default().as_millis();
            Some((modified, ConvertedFile {
                name: entry.file_name().to_string_lossy().into_owned(),
                path: entry.path().to_string_lossy().into_owned(),
                size: meta.len(),
                modified: modified.to_string(),
                is_directory: meta.is_dir(),
            }))
        }).collect::<Vec<_>>();
    items.sort_by(|a, b| b.0.cmp(&a.0));
    Ok(items.into_iter().map(|(_, item)| item).collect())
}

fn ensure_managed_path(app: &AppHandle, settings: &Mutex<SettingsStore>, candidate: &str) -> Result<PathBuf, String> {
    let root = effective_output_dir(app, settings)?.canonicalize().map_err(|e| e.to_string())?;
    let target = PathBuf::from(candidate).canonicalize().map_err(|e| e.to_string())?;
    if target == root || target.starts_with(&root) { Ok(target) } else { Err("Il file è fuori dalla cartella delle conversioni".into()) }
}

#[tauri::command]
pub fn open_path(app: AppHandle, settings: State<'_, Mutex<SettingsStore>>, file_path: String) -> Result<(), String> {
    let target = ensure_managed_path(&app, &settings, &file_path)?;
    let folder = target.parent().ok_or("Percorso file non valido")?;
    tauri_plugin_opener::open_path(folder, None::<&str>).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn open_converted_file(app: AppHandle, settings: State<'_, Mutex<SettingsStore>>, file_path: String) -> Result<(), String> {
    let target = ensure_managed_path(&app, &settings, &file_path)?;
    tauri_plugin_opener::open_path(target, None::<&str>).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn open_conversions_folder(app: AppHandle, settings: State<'_, Mutex<SettingsStore>>) -> Result<(), String> {
    let folder = effective_output_dir(&app, &settings)?;
    fs::create_dir_all(&folder).map_err(|e| e.to_string())?;
    tauri_plugin_opener::open_path(folder, None::<&str>).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_converted_file(app: AppHandle, settings: State<'_, Mutex<SettingsStore>>, file_path: String) -> Result<bool, String> {
    let target = match ensure_managed_path(&app, &settings, &file_path) {
        Ok(path) => path,
        Err(_) if !Path::new(&file_path).exists() => return Ok(false),
        Err(e) => return Err(e),
    };
    if target.is_dir() { return Err("Non è consentito eliminare una cartella da questa schermata".into()); }
    fs::remove_file(target).map(|_| true).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn convert_image(app: AppHandle, settings: State<'_, Mutex<SettingsStore>>, input_path: String, format: String, quality: Option<u8>) -> Result<String, String> {
    let input = PathBuf::from(&input_path);
    if !input.is_file() { return Err("File di input non trovato".into()); }
    let ext = format.to_lowercase();
    let image_format = match ext.as_str() {
        "jpg" | "jpeg" => ImageFormat::Jpeg,
        "png" => ImageFormat::Png,
        "webp" => ImageFormat::WebP,
        "avif" => ImageFormat::Avif,
        "tiff" => ImageFormat::Tiff,
        _ => return Err(format!("Formato non supportato: {ext}")),
    };
    let output_dir = effective_output_dir(&app, &settings)?;
    fs::create_dir_all(&output_dir).map_err(|e| e.to_string())?;
    tauri::async_runtime::spawn_blocking(move || {
        let stem = input.file_stem().and_then(|s| s.to_str()).ok_or("Nome file non valido")?;
        let mut output = output_dir.join(format!("{stem}.{ext}"));
        let mut suffix = 1;
        while output.exists() {
            output = output_dir.join(format!("{stem} ({suffix}).{ext}"));
            suffix += 1;
        }
        let result = (|| -> Result<(), String> {
            let decoded = image::ImageReader::open(&input).map_err(|e| format!("Impossibile aprire l'immagine: {e}"))?
                .with_guessed_format().map_err(|e| e.to_string())?.decode().map_err(|e| format!("Formato immagine non leggibile: {e}"))?;
            let q = quality.unwrap_or(if ext == "avif" { 50 } else { 80 }).clamp(1, 100);
            match ext.as_str() {
                "jpg" | "jpeg" => {
                    let rgb = decoded.to_rgb8();
                    let file = fs::File::create(&output).map_err(|e| e.to_string())?;
                    let mut writer = BufWriter::new(file);
                    JpegEncoder::new_with_quality(&mut writer, q).encode_image(&DynamicImage::ImageRgb8(rgb)).map_err(|e| e.to_string())?;
                }
                "avif" => {
                    let rgba = decoded.to_rgba8();
                    let file = fs::File::create(&output).map_err(|e| e.to_string())?;
                    let mut writer = BufWriter::new(file);
                    AvifEncoder::new_with_speed_quality(&mut writer, 6, q)
                        .write_image(rgba.as_raw(), rgba.width(), rgba.height(), image::ExtendedColorType::Rgba8)
                        .map_err(|e| e.to_string())?;
                }
                "webp" => {
                    let memory = webp::Encoder::from_image(&decoded).map_err(|e| format!("Immagine WebP non valida: {e}"))?.encode(q as f32);
                    fs::write(&output, &*memory).map_err(|e| e.to_string())?;
                }
                _ => decoded.save_with_format(&output, image_format).map_err(|e| format!("Conversione non riuscita: {e}"))?,
            }
            Ok(())
        })();
        if let Err(error) = result {
            let _ = fs::remove_file(&output);
            return Err(error);
        }
        Ok(output.to_string_lossy().into_owned())
    }).await.map_err(|e| format!("Conversione interrotta: {e}"))?
}

#[tauri::command]
pub fn get_settings(app: AppHandle, state: State<'_, Mutex<SettingsStore>>) -> Result<AppSettings, String> {
    let mut store = state.lock().map_err(|_| "Impostazioni non disponibili")?;
    store.load(&app)?;
    Ok(store.0.clone())
}

#[derive(Debug, Deserialize, Default)]
#[serde(rename_all = "camelCase", default)]
pub struct SettingsPatch {
    language: Option<String>,
    output_path: Option<String>,
    theme: Option<String>,
    side_panel_collapsed: Option<bool>,
}

#[tauri::command]
pub fn update_settings(app: AppHandle, state: State<'_, Mutex<SettingsStore>>, new_settings: SettingsPatch) -> Result<bool, String> {
    let mut store = state.lock().map_err(|_| "Impostazioni non disponibili")?;
    store.load(&app)?;
    if let Some(language) = new_settings.language { store.0.language = language; }
    if let Some(output_path) = new_settings.output_path { store.0.output_path = output_path; }
    if let Some(theme) = new_settings.theme { store.0.theme = theme; }
    if let Some(collapsed) = new_settings.side_panel_collapsed { store.0.side_panel_collapsed = collapsed; }
    store.save(&app)?;
    Ok(true)
}

#[tauri::command]
pub fn get_custom_output_path(app: AppHandle, state: State<'_, Mutex<SettingsStore>>) -> Result<String, String> {
    let mut store = state.lock().map_err(|_| "Impostazioni non disponibili")?;
    store.load(&app)?;
    Ok(store.0.output_path.clone())
}

#[tauri::command]
pub fn set_custom_output_path(app: AppHandle, state: State<'_, Mutex<SettingsStore>>, custom_path: String) -> Result<bool, String> {
    let mut store = state.lock().map_err(|_| "Impostazioni non disponibili")?;
    store.load(&app)?;
    let normalized = custom_path.trim().to_string();
    if !normalized.is_empty() { fs::create_dir_all(&normalized).map_err(|e| e.to_string())?; }
    store.0.output_path = normalized;
    store.save(&app)?;
    Ok(true)
}

#[tauri::command]
pub fn get_side_panel_state(app: AppHandle, state: State<'_, Mutex<SettingsStore>>) -> Result<bool, String> {
    let mut store = state.lock().map_err(|_| "Impostazioni non disponibili")?;
    store.load(&app)?;
    Ok(store.0.side_panel_collapsed)
}

#[tauri::command]
pub fn set_side_panel_state(app: AppHandle, state: State<'_, Mutex<SettingsStore>>, collapsed: bool) -> Result<bool, String> {
    let mut store = state.lock().map_err(|_| "Impostazioni non disponibili")?;
    store.load(&app)?;
    store.0.side_panel_collapsed = collapsed;
    store.save(&app)?;
    Ok(true)
}
