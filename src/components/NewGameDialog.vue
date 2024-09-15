<script setup lang="ts">
import { ref } from 'vue';
import MyButton from './MyButton.vue';
import { inject } from 'vue';
import type { Ref } from 'vue';
import RadioGroup from './RadioGroup.vue';
import OptionButton from './OptionButton.vue';
import type { Settings } from '@/Settings';

const emit = defineEmits<{
  newGame: [difficulty: string],
}>();

const visible = ref(false);
const settings = inject<Settings>('settings')!;
const difficulty = ref(settings.difficulty);
const overlay = inject<Ref<boolean>>('overlay')!;

function show() {
  visible.value = overlay.value = true;
}

function hide() {
  visible.value = overlay.value = false;
}

function start() {
  hide();
  emit('newGame', difficulty.value);
}

defineExpose({
  show,
  hide,
})
</script>

<template>
  <Teleport to="body">
    <div class="new" v-if="visible" @click.self="hide">
      <div class="dialog">
        <div class="title">{{ $t('new_game').toUpperCase() }}</div>
        <div class="content">
          {{ $t('difficulty').toUpperCase() }}:
          <RadioGroup id="difficulty" v-model="difficulty">
            <OptionButton name="easy">{{ $t('easy').toUpperCase() }}</OptionButton>
            <OptionButton name="medium">{{ $t('medium').toUpperCase() }}</OptionButton>
            <OptionButton name="hard">{{ $t('hard').toUpperCase() }}</OptionButton>
          </RadioGroup>
          <div id="difficulty-desc">{{ 
            difficulty === 'easy'
              ? $t('easy_desc')
              : difficulty === 'medium'
              ? $t('medium_desc')
              : $t('hard_desc')
          }}</div>

        </div>
        <div class="footer">
          <MyButton id="start" @click="start">{{ $t('start').toUpperCase() }}</MyButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.new {
  position: absolute;
  background-color: #00000088;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  --border-color: #292946;
}

.dialog {
  width: 40%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 4rem;
  background-color: var(--bg-color);
  height: min-content;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
}


@media screen and (max-width: 768px) {
  .dialog {
    width: 75%;
  }
}

@media screen and (max-width: 480px) {
  .dialog {
    width: 90%;
  }
}

.dialog > *{
  padding: 0.5rem;
}

.title {
  font-weight: bold;
  font-size: 1.75rem;
  border-bottom: 1px solid var(--border-color);
}

.footer {
  display: flex;
  margin-top: 1rem;
  border-top: 1px solid var(--border-color);
}

#difficulty {
  margin-top: 1rem;
}

#difficulty-desc {
  font-size: 0.65rem;
  margin-top: 0.25rem;
}

#start {
  margin-left: auto;
}

</style>
