import { FileEntry } from "@tauri-apps/api/fs";
import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import { getImageFromPath, readSubdirs } from "../util/files";
import { v4 as uuidv4 } from "uuid";

export interface LoadingState {
  files: boolean;
  image: boolean;
}

export interface IError {
  error: string;
  id: string;
  path: string;
}

export interface State {
  loading: LoadingState;
  files: Record<string, FileEntry[]>;
  errors: IError[];
  images: Record<string, string>;
}

const ERROR_TIMEOUT = 5000;

export const store = createStore<State>({
  state: {
    loading: { files: false, image: false },
    files: {},
    errors: [],
    images: {}
  },
  getters: {
    getFiles: (state: State) => (path: string): FileEntry[] | undefined => state.files[path],
    hasFiles: (state: State) => (path: string): boolean => state.files[path] !== undefined,
    getImage: (state: State) => (path: string): string | undefined => state.images[path],
    hasImage: (state: State) => (path: string): boolean => state.images[path] !== undefined,
  },
  mutations: {
    addPath(state, { path, files }: { path: string, files: FileEntry[] }) {
      state.files[path] = files;
    },
    addImage(state, { path, imageString }: { path: string, imageString: string }) {
      state.images[path] = imageString
    },
    setLoading(
      state,
      { key, value }: { key: keyof LoadingState; value: boolean }
    ) {
      state.loading[key] = value;
    },
    addError(state, error: IError) {
      state.errors = [...state.errors, error];
      setTimeout(
        () =>
          (state.errors = state.errors.filter((err) => err.id !== error.id)),
        ERROR_TIMEOUT
      );
    },
    removeError(state, id: string) {
      state.errors = state.errors.filter((err) => err.id !== id);
    },
  },
  actions: {
    addPath({ commit, getters }, path: string) {
      if (getters.hasFiles(path)) return;

      commit("setLoading", { key: "files", value: true });
      readSubdirs(path)
        .then((entries) => {
          commit("addPath", { path, files: entries });
          commit("setLoading", { key: "files", value: false });
        })
        .catch((e) => {
          commit("setLoading", { key: "files", value: false });
          const id = uuidv4();
          const error = { error: e, path, id };
          commit("addError", error);
        });
    },
    addImage({ commit, getters }, path: string) {
      if (getters.hasImage(path)) return;

      commit('setLoading', { key: 'image', value: true });
      getImageFromPath(path).then(imageString => {
        commit('addImage', { path, imageString });
        commit('setLoading', { key: 'image', value: false });
      }).catch(e => {
        commit('setLoading', { key: 'image', value: false });
        const id = uuidv4();
        const error = { error: e, path, id };
        commit("addError", error);
      });
    }
  },
});

export const key: InjectionKey<Store<State>> = Symbol();
export const useStore = () => baseUseStore(key);
