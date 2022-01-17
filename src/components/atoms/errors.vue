<script setup lang="ts">
import { useStore } from "../../store";

const store = useStore();
const errors = computed(() => store.state.errors);
const removeError = (id: string) => store.commit("removeError", id);
</script>

<template>
  <div class="errors">
    <div
      class="error"
      v-for="{ error, path, id } in errors"
      :key="id"
      title="Clear"
      @click="removeError(id)"
    >
      {{ error }} : {{ path }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.errors {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  display: flex;
  flex-direction: column-reverse;
  .error {
    text-align: right;
    padding: 1rem 0.5rem;
    margin: 0.25rem;
    margin-left: auto;
    background: rgb(250, 64, 64);
    width: fit-content;
    cursor: pointer;
    border-radius: 0.25rem;

    &:hover {
      background: lighten(rgb(250, 64, 64), 5%);
    }
  }
}
</style>