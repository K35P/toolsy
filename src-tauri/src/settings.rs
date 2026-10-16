use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf};
use tauri::{AppHandle, Manager};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct AppSettings {
    pub language: String,
    pub output_path: String,
    pub theme: String,
    pub side_panel_collapsed: bool,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            language: "it".into(),
            output_path: String::new(),
            theme: "light".into(),
            side_panel_collapsed: false,
        }
    }
}

#[derive(Default)]
pub struct SettingsStore(pub AppSettings);

impl SettingsStore {
    fn path(app: &AppHandle) -> Result<PathBuf, String> {
        app.path()
            .app_data_dir()
            .map(|p| p.join("settings.json"))
            .map_err(|e| e.to_string())
    }

    pub fn load(&mut self, app: &AppHandle) -> Result<(), String> {
        let path = Self::path(app)?;
        match fs::read_to_string(&path) {
            Ok(json) => {
                self.0 = serde_json::from_str(&json)
                    .map_err(|e| format!("Impostazioni non valide: {e}"))?
            }
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                if let Some(config_dir) = dirs::config_dir() {
                    let legacy_path = config_dir.join("Toolsy").join("settings.json");
                    if let Ok(json) = fs::read_to_string(legacy_path) {
                        self.0 = serde_json::from_str(&json)
                            .map_err(|e| format!("Impostazioni Electron non valide: {e}"))?;
                        self.save(app)?;
                    }
                }
            }
            Err(e) => return Err(format!("Impossibile leggere le impostazioni: {e}")),
        }
        Ok(())
    }

    pub fn save(&self, app: &AppHandle) -> Result<(), String> {
        let path = Self::path(app)?;
        let parent = path.parent().ok_or("Percorso impostazioni non valido")?;
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        let json = serde_json::to_vec_pretty(&self.0).map_err(|e| e.to_string())?;
        let temp = path.with_extension("json.tmp");
        fs::write(&temp, json).map_err(|e| e.to_string())?;
        if path.exists() {
            fs::remove_file(&path).map_err(|e| e.to_string())?;
        }
        fs::rename(temp, path).map_err(|e| e.to_string())
    }
}
