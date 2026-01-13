<template>
  <NTooltip v-if="appStore.isPc" placement="bottom">
    <template #trigger>
      <div class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="toggle">
        <SvgIcon :icon="isFullscreen ? 'ooui:exit-fullscreen' : 'ooui:full-screen'"></SvgIcon>
      </div>
    </template>
    <span>{{ isFullscreen ? '退出全屏' : '全屏' }}</span>
  </NTooltip>
  <div v-else class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="toggle">
    <SvgIcon :icon="isFullscreen ? 'ooui:exit-fullscreen' : 'ooui:full-screen'"></SvgIcon>
  </div>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import { useAppStore } from '@/stores'
const appStore = useAppStore()
const { isFullscreen, toggle } = useFullscreen()
</script>

<style scoped></style>
