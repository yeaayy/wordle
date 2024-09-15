<script setup lang="ts">
import { type Settings } from '@/Settings';
import { WordleHard, WordleMedium, WordleSimple, type UseI18n, type ValidationResult, type WordleEngine } from '@/wordle';
import { inject, onBeforeUnmount, onMounted, ref, type ComponentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import KeyboardView from './components/KeyboardView.vue';
import NavBar from './components/NavBar.vue';
import Toast from './components/Toast.vue';
import WordleView from './components/WordleView.vue';

type WordlistData = {
  id: string;
  allWords: string[];
  subsetWords: string[];
}

const wordleView = ref(null! as ComponentInstance<typeof WordleView>);
const keyboardView = ref(null! as ComponentInstance<typeof KeyboardView>);
const toast = ref(null! as ComponentInstance<typeof Toast>);
const settings = inject<Settings>('settings')!;
const lang = useI18n();
let worldlist: WordlistData

function onKeyUp(e: KeyboardEvent) {
  e.preventDefault();
  let key = e.key.toLowerCase();
  if (key === 'delete') key = 'del';
  if (key === 'backspace') key = 'del';
  if (!keyboardView.value.hasKey(key)) return;
  wordleView.value.input(key);
}

function onValidationResult(key: string, result: ValidationResult) {
  keyboardView.value.setState(key, result);
}

function onToast(messsage: string) {
  toast.value.show(messsage);
}

function onFinish(correct: boolean) {
  wordleView.value.setResult(correct ? 1 : -1);
}

function onNewGame(difficulty: string) {
  let engine: WordleEngine;
  switch (difficulty) {
    case 'easy':
      engine = new WordleSimple(5, lang as UseI18n, worldlist);
      break;

    case 'medium':
      engine = new WordleMedium(5, lang as UseI18n, worldlist);
      break;

    case 'hard':
      engine = new WordleHard(5, lang as UseI18n, worldlist);
      break;

    default:
      console.error('invalid difficulty', difficulty);
      return;
  }
  settings.difficulty = difficulty;
  keyboardView.value.reset();
  wordleView.value.reset(engine);
}

onMounted(async () => {
  window.addEventListener('keyup', onKeyUp);
  const response = await fetch(`id.wordlist.json`);
  worldlist = (await response.json()) as WordlistData;
  onNewGame(settings?.difficulty);
});

onBeforeUnmount(() => {
  window.removeEventListener('keyup', onKeyUp);
})
</script>

<template>
  <header>
    <NavBar @new-game="onNewGame" />
  </header>

  <main>
    <WordleView
      ref="wordleView"
      :max-retries="6"
      :letter-size="5"
      class="wordle"
      @validation-result="onValidationResult"
      @toast="onToast"
      @finish="onFinish"/>

    <KeyboardView
      ref="keyboardView"
      class="keyboard"
      @key-up="wordleView.input($event)" />
  </main>

  <Toast ref="toast" />
</template>

<style scoped>
main {
  padding: 8px;
  height: 100%;
}

.wordle,
header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.keyboard {
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;
  left: 0.5rem;
  right: 0.5rem;
  bottom: 1rem;
}
</style>
./wordle/WordleEngine./wordle/WordleHard./wordle/WordleMedium./wordle/WordleSimple
