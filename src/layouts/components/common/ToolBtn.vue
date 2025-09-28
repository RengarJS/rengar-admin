<template>
  <div class="flex items-center gap-3 text-xl">
    <NTooltip placement="bottom">
      <template #trigger>
        <div class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="appStore.toggleTheme">
          <SvgIcon v-if="appStore.themoMode === 'light'" icon="line-md:sunny"></SvgIcon>
          <SvgIcon v-else-if="appStore.themoMode === 'dark'" icon="line-md:moon-filled"></SvgIcon>
          <SvgIcon v-else icon="material-symbols:hdr-auto"></SvgIcon>
        </div>
      </template>
      <span>主题</span>
    </NTooltip>

    <NTooltip placement="bottom">
      <template #trigger>
        <div class="cursor-pointe flex-center rounded-sm p-1 hover:text-primary" @click="appStore.toggleConfigDrawer">
          <SvgIcon icon="clarity:settings-line"></SvgIcon>
        </div>
      </template>
      <span>系统配置</span>
    </NTooltip>

    <NTooltip placement="bottom">
      <template #trigger>
        <div class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="toggle">
          <SvgIcon :icon="isFullscreen ? 'ooui:exit-fullscreen' : 'ooui:full-screen'"></SvgIcon>
        </div>
      </template>
      <span>{{ isFullscreen ? '退出全屏' : '全屏' }}</span>
    </NTooltip>
  </div>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import { useAppStore } from '@/stores'
const { isFullscreen, toggle } = useFullscreen()

const appStore = useAppStore()
</script>

<style scoped></style>
