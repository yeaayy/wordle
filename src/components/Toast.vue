<script setup lang="ts">
import { inject, ref, type Ref } from 'vue';

const messsage: Ref<string | undefined> = ref();
const overlay = inject<Ref<boolean>>('overlay')!;

function show(msg: string, duration: number = 1000) {
  messsage.value = msg;
  overlay.value = true;
  setTimeout(function () {
      messsage.value = undefined
      overlay.value = false;
  }, duration);
}

defineExpose({
  show,
});
</script>

<template>
  <Teleport to="body">
    <div class="toast" v-if="messsage">
      <div class="message">
        {{ (messsage ?? '').toUpperCase() }}
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.toast {
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.5);
}

.toast .message {
    margin: auto;
    font-size: 1.75rem;
    font-weight: bold;
    background-color: #696971;
    padding: 1rem;
    border-radius: 0.5rem;
}

</style>
