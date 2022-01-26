#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use error::ImageOrganizerResult;
use path::PathInformation;

mod error;
mod path;

#[tauri::command]
fn get_path_info(path: String) -> ImageOrganizerResult<PathInformation> {
  PathInformation::new(path)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_path_info])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
