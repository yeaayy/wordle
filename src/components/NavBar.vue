<script setup lang="ts">
import type { ComponentInstance } from 'vue';
import NewGameDialog from './NewGameDialog.vue';
import { ref } from 'vue';

const emit = defineEmits<{
  newGame: [difficulty: string],
}>();

const newGameDialog = ref(null! as ComponentInstance<typeof NewGameDialog>);

function onNewGame(difficulty: string) {
  emit('newGame', difficulty);
}
</script>

<template>
  <div class="navbar">
    <img class="restart" @click="newGameDialog.show()" src="../assets/icon/rotate-left.svg" height="24" alt="restart">
  </div>

  <NewGameDialog ref="newGameDialog" @new-game="onNewGame"></NewGameDialog>
</template>

<style scoped>
.navbar {
  width: calc(100% - 0.5rem);
  display: flex;
  flex-direction: column;
  margin: 0.25rem;
}

.restart {
  filter: invert(1);
  padding: 0.5rem;
  border: 1px solid black;
  border-radius: 0.5rem;
  margin-left: auto;
}

.restart:hover {
  background-color: #00000088;
}


@media screen and (min-width: 480px) {
  .navbar {
    width: 80vw;
  }
}

@media screen and (min-width: 768px) {
  .navbar {
    width: 60vw;
  }
}
</style>
