<script setup lang="ts">
import Thumbnail from "./atoms/thumbnail.vue";
import Loading from "./atoms/loading.vue";
import DirectoryView from "./atoms/directory-view.vue";
import { useStore } from "../store";
import { PathNode } from "../util/files";
import { ComputedRef } from "vue-demi";
import { ActionTypes, MutationTypes } from "../store/types";

const TYPING_WAIT = 300;

const store = useStore();

const { getNodeByPath } = store.getters;
store.dispatch(ActionTypes.addPath, { path: "/home/c/Downloads" });
const rootNode: ComputedRef<PathNode> = computed(() =>
  getNodeByPath(path.value)
);

const addPath = () => store.dispatch(ActionTypes.addPath, { path: path.value });
let interval;

const path = ref("/home/c/Downloads");
watch(path, (_) => {
  if (interval) clearTimeout(interval);
  interval = setTimeout(addPath, TYPING_WAIT);
});
</script>

<template>
  <div>
    <Loading loadingKey="files" />
    <h1>Read all subdirs: {{ path }}</h1>
    <div class="body">
      <div class="path">
        <label for="path-input">Base directory</label>
        <input type="text" name="path-input" id="" v-model="path" />
      </div>
    </div>
    <directory-view v-if="rootNode" :directory="rootNode" />
  </div>
</template>

<style lang="scss" scoped>
div {
  h1 {
  }
  .body {
  }
}
</style>