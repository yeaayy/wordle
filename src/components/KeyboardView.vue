<script setup lang="ts">
import type { ValidationResult } from '@/wordle';
import { reactive } from 'vue';

const emit = defineEmits<{
  keyUp: [key: string],
}>();

const layout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['del', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'],
];

const validation: {
  [key: string]: ValidationResult | undefined;
} = reactive({});

for (const row of layout) {
  for (const col of row) {
    validation[col] = undefined;
  }
}

function setState(key: string, state: ValidationResult) {
  validation[key] = state;
}

function hasKey(key: string) {
  return key in validation;
}

function reset() {
  for (const key in validation) {
    validation[key] = undefined;
  }
}

defineExpose({
  hasKey,
  setState,
  reset,
})
</script>

<template>
  <div>
    <div class="row" v-for="row of layout">
      <div :class="['col', validation[col]]" v-for="col of row" @click="emit('keyUp', col.toLowerCase())">
        {{ col.toUpperCase() }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  justify-content: stretch;
  width: 100%;
}

.col {
  padding: 0.5rem 0.25rem;
  margin: 0.125rem;
  background-color: #696971;
  font-size: 1rem;
  flex-grow: 1;
  text-align: center;
  font-weight: bold;
  border-radius: 0.25rem;

}

[class=col]:hover {
  background-color: #8c8c99;
}

.col.contain {
  background-color: #e8e427;
}

.col.correct {
  background-color: #20b336;
}

.col.false {
  color: #888;
  background-color: #2e2e44;
}

@media screen and (min-width: 480px) {
  .row {
    width: 80vw;
  }

  .col {
    font-size: 1.5rem;
  }
}

@media screen and (min-width: 768px) {
  .row {
    width: 60vw;
  }

  .col {
    font-size: 1.75rem;
  }
}
</style>
@/wordle/WordleEngine
