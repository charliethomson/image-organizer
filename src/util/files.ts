import { invoke, path } from "@tauri-apps/api";
import { readDir, FileEntry, readBinaryFile } from "@tauri-apps/api/fs";
import { extname } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { Uuid, uuidv4 } from "../store/types";

const isImageExt = (ext: string): boolean =>
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

const isVideoExt = (ext: string): boolean =>
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
const isImage = (path: string): Promise<boolean> =>
  extname(path)
    .then(isImageExt)
    .catch((_) => false);
const isVideo = (path: string): Promise<boolean> =>
  extname(path)
    .then(isVideoExt)
    .catch((_) => false);

const getFiles = async (
  fileEntries: FileEntry[],
  fileClassifier: (path: string) => Promise<boolean>
): Promise<FileEntry[]> => {
  let files: FileEntry[] = [];

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

export const readSubdirs = async (basePath: string): Promise<PathInformation[]> => {
  const directoryContents = await readDir(basePath, { recursive: true });

  const paths = [
    ...(await getImages(directoryContents)),
    ...(await getVideos(directoryContents)),
  ];

  const files = [];
  for (let path of paths)
    files.push(await invoke('get_path_info', { path: path.path }))
  return files
};
export interface PathInformation {
  exists: boolean,
  is_directory: boolean,
  extension?: string,
  file_name?: string,
  path: string,
  ancestors: string[],
  children: PathInformation[],
}

export type PathNodeType = "image" | "video" | "dir";

export interface PathNode {
  parent?: string;
  children: PathNode[];
  type: PathNodeType;
  path: string;
  uri?: string;
  id: Uuid
}

const toPathNode = (info: PathInformation, parent: string | undefined = undefined): PathNode => {
  let type: PathNodeType;

  if (info.is_directory) type = "dir"
  else if (info.extension && isImageExt(info.extension)) type = 'image'
  else if (info.extension && isVideoExt(info.extension)) type = 'video'
  else return;

  let uri: string | undefined;
  if (type !== "dir") uri = convertFileSrc(info.path);

  let uuid = uuidv4();

  return {
    parent,
    type,
    path: info.path,
    uri,
    children: info.children.map(child => toPathNode(child, info.path)).filter(child => child !== undefined),
    id: uuid
  };
}

export const getPathTree = async (rootPath: string): Promise<PathNode> => {
  const path_information: PathInformation = await invoke('get_path_info', { path: rootPath });

  return toPathNode(path_information, undefined);
}

