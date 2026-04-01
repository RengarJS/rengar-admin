<template>
  <div
    class="flex-center cursor-pointer p-1 hover:bg-primary-100 dark:hover:bg-primary-900"
    @click="appStore.toggleMenuDrawer(true)"
  >
    <ILineMdCloseToMenuAltTransition class="text-xl text-primary"></ILineMdCloseToMenuAltTransition>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
const appStore = useAppStore()
</script>

<style scoped></style>
