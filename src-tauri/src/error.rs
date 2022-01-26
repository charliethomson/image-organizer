use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
#[serde(untagged)]
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

pub type ImageOrganizerResult<T> = Result<T, ImageOrganizerError>;
