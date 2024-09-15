<script setup lang="ts">
import { ValidationResult, WordleEngine } from '@/wordle';
import { inject, reactive, type Reactive, type Ref } from 'vue';

const prop = defineProps<{
  maxRetries: number;
  letterSize: number;
}>();

const emit = defineEmits<{
  finish: [correct: boolean],
  toast: [meggase: string],
  validationResult: [key: string, result: ValidationResult],
}>();

interface Data {
  value: string;
  result?: 'correct' | 'false' | 'contain';
}

const overlay = inject<Ref<boolean>>('overlay')!;
const result = reactive({ correct: 0, answer: '' });
const data: Reactive<Data[][]> = reactive([]);
let attempt = 0;
let currentLetterIndex = 0;
let wordleEngine: WordleEngine | undefined;
let currentWord: string[] = [];

for (let i = 0; i < prop.maxRetries; i++) {
  const row: Data[] = [];
  data.push(row);
  for (let j = 0; j < prop.letterSize; j++) {
    row.push({
      value: '',
    })
  }
}

function input(key: string) {
  if (overlay.value || result.correct !== 0) return;
  if (!wordleEngine) return;
  if (key === 'enter') {
    const word = currentWord.join('');
    const precheckResult = wordleEngine.precheck(word);
    if (precheckResult) {
      emit('toast', precheckResult);
      return;
    }

    const result = wordleEngine.validate(word);
    let matchCount = 0;
    for (let i = 0; i < prop.letterSize; i++) {
      switch (result[i]) {
        case ValidationResult.CORRECT:
          matchCount++;
        // no break
        case ValidationResult.CONTAIN:
        case ValidationResult.FALSE:
          break
        default: continue;
      }
      emit('validationResult', word[i], result[i]);
      data[attempt][i].result = result[i];
    }
    if (matchCount === prop.letterSize) {
      emit('finish', true);
      return;
    }
    attempt++;
    currentLetterIndex = 0;
    currentWord.splice(0, prop.letterSize);
    if (attempt >= prop.maxRetries) {
      emit('finish', false);
    }
    return;
  }
  if (key === 'del') {
    if (currentLetterIndex <= 0) return;
    data[attempt][--currentLetterIndex].value = "";
    currentWord.pop();
    return;
  }
  if (currentLetterIndex >= prop.letterSize) return;
  data[attempt][currentLetterIndex++].value = key.toUpperCase();
  currentWord.push(key.toLowerCase());
}

function reset(engine: WordleEngine) {
  wordleEngine = engine;
  result.correct = 0;
  attempt = 0;
  currentLetterIndex = 0;
  currentWord = [];
  for (const row of data) {
    for (const col of row) {
      col.value = '';
      delete col.result;
    }
  }
}

function setResult(v: -1 | 1) {
  result.correct = v;
  result.answer = wordleEngine!.getAnswer();
}

defineExpose({
  reset,
  input,
  setResult,
});
</script>

<template>
  <div class="container">
    <div v-for="row in data" class="row">
      <div v-for="col in row" :class="['col', col.result]">
        <div>{{ col.value }}</div>
      </div>
    </div>
    <!-- <Transition name="result">
      <div v-if="result.correct !== 0" :class="['result', result.correct == 1 ? 'correct' : 'fail']">
        {{ (result.correct === 1 ? $t('success') : $t('fail')).toUpperCase() }}
      </div>
    </Transition> -->
    <div class="answer" v-if="result.correct === -1">
      {{ $t('answer_is') }} {{ result.answer }}
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
}

.result {
  position: absolute;
  --transform: translate(-50%, -50%) rotate(-30deg);
  transform: var(--transform);
  left: 50%;
  top: 50%;
  font-size: 15vmin;
  border-radius: 1rem;
  padding: 0.4rem 1rem;
  opacity: 0.2;
  border: 4px solid;
}

.answer {
  font-size: 0.5rem;
}

.result.correct {
  border-color: #63c973;
  background-color: #166823;
}

.result.fail {
  border-color: #c97363;
  background-color: #682316;
}

.row {
  display: flex;
}

.col {
  width: 3.25rem;
  height: 3.25rem;
  text-align: center;
  border: 2px solid #3d3d57;
  background-color: #17172d;
  margin: 0.125rem;
  border-radius: 0.25rem;
  display: flex;
}

.col>* {
  margin: auto;
  font-size: 2rem;
  font-weight: bold;
}

.col.correct {
  background-color: #20b336;
  border-color: #5ae770;
}

.col.contain {
  background-color: #e8e427;
  border-color: #f0ee71;
}

.col.false {
  background-color: #696971;
  border-color: #9c9ca5;
}

.result-enter-active {
  transition: all 500ms;
}

.result-enter-from {
  opacity: 1;
  transform: var(--transform) rotate(180deg) scale(3);
}
</style>
@/wordle/WordleEngine
