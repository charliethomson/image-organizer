import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, MutationTree, GetterTree, ActionTree } from "vuex";
import { getPathTree, PathInformation, PathNode, readSubdirs } from "../util/files";
import { Actions, Getters, IError, LoadingState, Mutations, MutationTypes, State, Store, uuidv4 } from "./types";


const ERROR_TIMEOUT = 5000;

const state = {
  loading: { files: false, image: false },
  files: {},
  paths: {},
  mapping: {},
  errors: [],
}

const getters: GetterTree<State, State> & Getters = {
  getNodeByUuid: (state: State) => (uuid: string): PathNode => state.files[uuid],
  getUuidByPath: (state: State) => (path: string): string | undefined => state.paths[path],
  getNodeByPath: (state: State) => (path: string): PathNode | undefined => state.files[state.paths[path]],

}

const mutations: MutationTree<State> & Mutations = {
  addNode(state, node: PathNode) {
    // Disallow repeats, just in case :d
    while (state.files[node.id] !== undefined) node.id = uuidv4();

    state.files[node.id] = node;
    state.paths[node.path] = node.id;
  },
  setLoading(
    state,
    { key, value }: { key: keyof LoadingState; value: boolean }
  ) {
    state.loading[key] = value;
  },
  addError(state, error: IError) {
    console.error(error);
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
}

const actions: ActionTree<State, State> & Actions = {
  addPath({ commit, getters }, { path }: { path: string }) {
    if (getters.getUuidByPath(path)) return;

    commit(MutationTypes.setLoading, { key: "files", value: true });
    getPathTree(path)
      .then((node) => {
        commit(MutationTypes.addNode, node);
        commit(MutationTypes.setLoading, { key: "files", value: false });
      })
      .catch((e) => {
        commit(MutationTypes.setLoading, { key: "files", value: false });
        const id = uuidv4();
        const error = { error: e, path, id };
        commit(MutationTypes.addError, error);
      });
  },
}

export const store = createStore<State>({
  state,
  getters,
  mutations,
  actions,
});

export const key: InjectionKey<Store<State>> = Symbol();
export const useStore = (): Store<State> => baseUseStore(key) as Store<State>;
