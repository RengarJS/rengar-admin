<template>
  <NEl :is="component" class="theme">
    <slot></slot>
  </NEl>
</template>

<script setup lang="ts">
const { component = 'div' } = defineProps<{
  component?: string
}>()
</script>

<style scoped>
.theme {
  color: var(--text-color-base);
  background-color: var(--body-color);
  transition:
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
