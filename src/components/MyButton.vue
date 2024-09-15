
<template>
  <div class="button">
    <slot></slot>
  </div>
</template>

<style scoped>
.button {
  display: inline-block;
  padding: 0.5rem;
  width: fit-content;
  border: 1px solid white;
  border-radius: 0.5rem;
}

.button:hover {
  background-color: #ffffff66;
}
</style>
