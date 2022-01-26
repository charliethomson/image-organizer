use std::path::Path;

use serde::{Deserialize, Serialize};

use crate::error::ImageOrganizerResult;

fn osstr_to_string(osstr: &std::ffi::OsStr) -> String {
  osstr.to_string_lossy().into_owned()
}

#[derive(Serialize, Deserialize, Default)]
pub struct PathInformation {
  exists: bool,
  is_directory: bool,
  extension: Option<String>,
  file_name: Option<String>,
  path: String,
  ancestors: Vec<String>,
  children: Vec<Box<PathInformation>>,
}
impl PathInformation {
  pub fn new<P: AsRef<Path>>(path: P) -> ImageOrganizerResult<Self> {
    let path = path.as_ref();

    let is_directory = path.is_dir();

    let mut children = vec![];
    if is_directory {
      for entry in path.read_dir()? {
        let entry = entry?;
        let path = entry.path();
        children.push(Box::new(PathInformation::new(path)?));
      }
    }

    Ok(PathInformation {
      exists: path.exists(),
      is_directory,
      extension: path.extension().map(osstr_to_string),
      file_name: path.file_name().map(osstr_to_string),
      path: path.canonicalize()?.into_os_string().into_string().unwrap(),
      ancestors: path
        .ancestors()
        .flat_map(|path| path.file_name().map(osstr_to_string))
        .collect::<Vec<String>>(),
      children,
    })
  }
}
