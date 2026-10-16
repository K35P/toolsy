mod commands;
mod settings;

use settings::SettingsStore;
use std::sync::Mutex;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .manage(Mutex::new(SettingsStore::default()))
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                #[cfg(target_os = "macos")]
                if window.label() == "main" {
                    api.prevent_close();
                    let _ = window.hide();
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_platform,
            commands::ensure_conversions_dir,
            commands::list_converted_files,
            commands::delete_converted_file,
            commands::open_path,
            commands::open_converted_file,
            commands::open_conversions_folder,
            commands::convert_image,
            commands::get_settings,
            commands::update_settings,
            commands::get_custom_output_path,
            commands::set_custom_output_path,
            commands::get_side_panel_state,
            commands::set_side_panel_state,
        ])
        .build(tauri::generate_context!())
        .expect("impossibile inizializzare Toolsy")
        .run(|app, event| {
            #[cfg(target_os = "macos")]
            if let tauri::RunEvent::Reopen { .. } = event {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            #[cfg(not(target_os = "macos"))]
            let _ = (app, event);
        })
}
