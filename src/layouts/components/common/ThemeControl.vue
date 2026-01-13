<template>
  <NTooltip v-if="appStore.isPc" placement="bottom">
    <template #trigger>
      <div class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="appStore.toggleTheme">
        <i v-if="appStore.themeMode === 'light'" class="i-material-symbols:light-mode-outline"></i>
        <i v-else-if="appStore.themeMode === 'dark'" class="i-material-symbols:dark-mode-outline"></i>
        <i v-else class="i-material-symbols:hdr-auto-outline"></i>
      </div>
    </template>
    <span v-if="appStore.themeMode === 'light'">浅色</span>
    <span v-else-if="appStore.themeMode === 'dark'">深色</span>
    <span v-else>跟随系统</span>
  </NTooltip>

  <div v-else class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="appStore.toggleTheme">
    <i v-if="appStore.themeMode === 'light'" class="i-material-symbols:light-mode-outline"></i>
    <i v-else-if="appStore.themeMode === 'dark'" class="i-material-symbols:dark-mode-outline"></i>
    <i v-else class="i-material-symbols:hdr-auto-outline"></i>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
const appStore = useAppStore()
</script>

<style scoped></style>
