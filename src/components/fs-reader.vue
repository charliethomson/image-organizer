<script setup lang="ts">
import JSONView from "./JSONView.vue";
import LocalImg from "./atoms/local-img.vue";
import Loading from "./atoms/loading.vue";
import { useStore } from "../store";
import { getImageFromPath } from "../util/files";

const TYPING_WAIT = 300;

const store = useStore();

const getFiles = store.getters.getFiles;
store.dispatch("addPath", "/Users/c/Downloads");
const files = computed(() => getFiles(path.value));

const addPath = () => store.dispatch("addPath", path.value);

let interval;

const path = ref("/home/c/Downloads/carbon(2).png");
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
    <div class="child-images">
      <div class="image-container" v-for="{ path, id } in files" :key="id">
        <p>{{ path }}</p>
        <local-img :path="path" />
      </div>
    </div>
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