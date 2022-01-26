
import { v4 as _uuidv4 } from "uuid";
import { ActionContext, CommitOptions, DispatchOptions } from "vuex";
import { PathNode } from "../util/files";
import { Store as VuexStore } from "vuex"


export interface LoadingState {
    files: boolean;
    image: boolean;
}

export interface SetLoadingState {
    key: keyof LoadingState;
    value: boolean;
}

export interface IError {
    error: string;
    id: string;
    path: string;
}

export type Uuid = string;
export const uuidv4 = (): Uuid => _uuidv4()

export interface State {
    loading: LoadingState;
    // uuid => node
    files: Record<Uuid, PathNode>;
    // path => uuid
    paths: Record<Uuid, Uuid>;
    // uuid.old => uuid.new
    mapping: Record<Uuid, Uuid>;
    errors: IError[];
}

export type Getters = {
    // uuid => node
    getNodeByUuid: (state: State) => (uuid: string) => PathNode,
    // path => uuid
    getUuidByPath: (state: State) => (path: string) => string | undefined,
    // path => node
    getNodeByPath: (state: State) => (path: string) => PathNode | undefined,
}

export enum MutationTypes {
    addNode = "addNode",
    setLoading = "setLoading",
    addError = "addError",
    removeError = "removeError",
}

export type Mutations<S = State> = {
    [MutationTypes.addNode](state: S, node: PathNode): void;
    [MutationTypes.setLoading](state: S, { key, value }: SetLoadingState): void;
    [MutationTypes.addError](state: S, error: IError): void;
    [MutationTypes.removeError](state: S, id: string): void;
}

export enum ActionTypes {
    addPath = 'addPath'
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, State>, 'commit'>

export interface Actions {
    [ActionTypes.addPath](
        { commit }: AugmentedActionContext,
        payload: { path: string },
    ): void
}

export type Store<S = State> = Omit<
    VuexStore<S>,
    'commit' | 'getters' | 'dispatch'
> & {
    commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
        key: K,
        payload: P,
        options?: CommitOptions,
    ): ReturnType<Mutations[K]>
} & {
    getters: {
        [K in keyof Getters]: ReturnType<Getters[K]>
    }
} & {
    dispatch<K extends keyof Actions>(
        key: K,
        payload: Parameters<Actions[K]>[1],
        options?: DispatchOptions,
    ): ReturnType<Actions[K]>
}