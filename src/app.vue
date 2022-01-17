<script setup>
import Loading from "./components/atoms/loading.vue";
import Errors from "./components/atoms/errors.vue";
</script>

<template>
  <div class="app">
    <Errors />
    <div class="main">
      <router-view />
    </div>
  </div>
</template>
