<script setup lang="ts">
import { useStore } from "../../store";
import { getImageFromPath } from "../../util/files";
import Loading from "./loading.vue";

const { path } = defineProps<{ path: string }>();

const store = useStore();

store.dispatch("addImage", path);

const imageData = computed(() => store.getters.getImage(path));
</script>

<template>
  <div>
    <loading loadingKey="image" />
    <img :src="imageData" alt="image failed to load" />
  </div>
</template>