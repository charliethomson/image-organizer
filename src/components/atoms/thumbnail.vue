<script setup lang='ts'>
const { uri } = defineProps<{ uri: string }>();
</script>

<template>
  <img
    class="thumb"
    :src="uri"
    width="200"
    height="200"
    alt="Preview"
    style="object-fit: cover"
  />
</template>