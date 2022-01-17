#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub enum ImageOrganizerError {
  Io(String),
  Decode(String),
  Image(String),
}
impl From<std::io::Error> for ImageOrganizerError {
  fn from(e: std::io::Error) -> Self {
    Self::Io(e.to_string())
  }
}
impl From<image::error::DecodingError> for ImageOrganizerError {
  fn from(e: image::error::DecodingError) -> Self {
    Self::Decode(e.to_string())
  }
}
impl From<image::error::ImageError> for ImageOrganizerError {
  fn from(e: image::error::ImageError) -> Self {
    Self::Image(e.to_string())
  }
}

// #[tauri::command]
fn get_image_base64(image_path: String) -> Result<String, ImageOrganizerError> {
  let img = image::io::Reader::open(image_path)?.decode()?;
  let mut buf = vec![];
  img.write_to(&mut buf, image::ImageOutputFormat::Png)?;
  return Ok(base64::encode(&buf));
}

// fn main() {
//   tauri::Builder::default()
//     .invoke_handler(tauri::generate_handler![get_image_base64])
//     .run(tauri::generate_context!())
//     .expect("error while running tauri application");
// }

fn main() {
  let start = std::time::Instant::now();
  for _ in 0..500 {
    assert!(get_image_base64("/home/c/Downloads/carbon(2).png".into()).is_ok());
  }

  let duration_ns = start.elapsed().as_millis();
  println!("total: {}ms", duration_ns);
  println!("avg: {}ms (50runs)", duration_ns / 500);
}
