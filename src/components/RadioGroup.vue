<script setup lang="ts">
import { watch } from 'vue';
import { provide, ref } from 'vue';

const prop = withDefaults(defineProps<{
  modelValue?: string;
}>(), {
  modelValue: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string],
}>()

const selected = ref(prop.modelValue);
watch(selected, value => emit('update:modelValue', value));

provide('selected-option', selected);
</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>
