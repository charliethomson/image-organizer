import { invoke } from '@tauri-apps/api/tauri'
import { readDir, FileEntry, readBinaryFile } from "@tauri-apps/api/fs";
import { extname } from "@tauri-apps/api/path";

const isImage = (path: string): Promise<boolean> =>
  extname(path)
    .then((ext) =>
      [
        "jpg",
        "png",
        "gif",
        "webp",
        "tiff",
        "psd",
        "raw",
        "bmp",
        "heif",
        "indd",
        "svg",
        "ai",
        "eps",
        "pdf",
      ].includes(ext)
    )
    .catch((_) => false);
const isVideo = (path: string): Promise<boolean> =>
  extname(path)
    .then((ext) =>
      [
        "webm",
        "mkv",
        "flv",
        "flv",
        "vob",
        "ogv",
        "ogg",
        "drc",
        "gif",
        "gifv",
        "avi",
        "mts",
        "m2ts",
        "ts",
        "mov",
        "qt",
        "wmv",
        "yuv",
        "rm",
        "rmvb",
        "viv",
        "asf",
        "amv",
        "mp4",
        "m4p",
        "m4v",
        "mpg",
        "mp2",
        "mpeg",
        "mpe",
        "mpv",
        "mpg",
        "mpeg",
        "m2v",
        "m4v",
        "svi",
        "3gp",
        "3g2",
        "mxf",
        "roq",
        "nsv",
        "flv",
        "f4v",
        "f4p",
        "f4a",
        "f4b",
      ].includes(ext)
    )
    .catch((_) => false);

const getFiles = async (
  fileEntries: FileEntry[],
  fileClassifier: (path: string) => Promise<boolean>
): Promise<FileEntry[]> => {
  let files = [];

  for (const entry of fileEntries) {
    if (entry.children !== undefined)
      files = [...files, ...(await getFiles(entry.children, fileClassifier))];
    else if (await fileClassifier(entry.path)) files.push(entry);
  }

  return files;
};

const getImages = async (fileEntries: FileEntry[]): Promise<FileEntry[]> =>
  getFiles(fileEntries, isImage);
const getVideos = async (fileEntries: FileEntry[]): Promise<FileEntry[]> =>
  getFiles(fileEntries, isVideo);

export const readSubdirs = async (basePath: string): Promise<FileEntry[]> => {
  const directoryContents = await readDir(basePath, { recursive: true });

  return [
    ...(await getImages(directoryContents)),
    ...(await getVideos(directoryContents)),
  ];
};

export const getImageFromPath = async (path: string): Promise<string> => {
  const base64 = await invoke('get_image_base64', { imagePath: path })
  return `data:image/png;base64, ${base64}`
};
