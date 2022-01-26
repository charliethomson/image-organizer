<script lang="ts">
import { defineComponent, onMounted } from "vue";
export default defineComponent({ name: "directory-view" });
</script>

<script setup lang='ts'>
import { PathNode } from "../../util/files";
const { directory } = defineProps<{ directory: PathNode }>();

let files = ref([]);

onMounted(() => {
  files.value = directory?.children;
  console.log(directory);
});

watch(files, console.log);
</script>


<template>
  <div class="directory-view" v-if="directory">
    <h2>{{ directory.path }}</h2>
    <div class="item-container" v-for="file in files" :key="file.id">
      <div class="image-preview" v-if="file.type === 'image'">
        <img :src="file.uri" />
      </div>
      <div class="video-preview" v-else-if="file.type === 'video'">
        {{ file.uri }}
      </div>
      <directory-view v-else-if="file.type === 'dir'" :directory="file" />
    </div>
  </div>
</template>
