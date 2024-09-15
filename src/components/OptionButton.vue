<script setup lang="ts">
import type { Ref } from 'vue';
import { inject } from 'vue';
import MyButton from './MyButton.vue';

const prop = defineProps<{
  name: string;
}>();

const selected = inject<Ref<string>>('selected-option');
</script>

<template>
  <MyButton class="button" @click="selected = name" :class="{
    active: name === selected,
  }">
    <slot></slot>
  </MyButton>
</template>

<style scoped>
.button {
  margin-right: 0.25rem;
}

.active {
  background-color: #ffffff33;
}
</style>
