<template>
  <NTooltip placement="bottom">
    <template #trigger>
      <div class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="appStore.toggleTheme">
        <SvgIcon v-if="appStore.themeMode === 'light'" icon="line-md:sunny"></SvgIcon>
        <SvgIcon v-else-if="appStore.themeMode === 'dark'" icon="line-md:moon-filled"></SvgIcon>
        <SvgIcon v-else icon="material-symbols:hdr-auto"></SvgIcon>
      </div>
    </template>
    <span v-if="appStore.themeMode === 'light'">浅色</span>
    <span v-else-if="appStore.themeMode === 'dark'">深色</span>
    <span v-else>跟随系统</span>
  </NTooltip>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
const appStore = useAppStore()
</script>

<style scoped></style>
