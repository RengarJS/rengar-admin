<template>
  <div class="flex items-center gap-3 text-xl">
    <SvgIcon
      v-if="themeStore.theme === 'light'"
      icon="line-md:sunny"
      class="cursor-pointer text-amber"
      @click="themeStore.toggleTheme"
    ></SvgIcon>

    <SvgIcon v-else icon="line-md:moon-filled" class="cursor-pointer" @click="themeStore.toggleTheme"></SvgIcon>

    <SvgIcon
      :icon="isFullscreen ? 'ooui:exit-fullscreen' : 'ooui:full-screen'"
      class="cursor-pointer hover:text-primary"
      @click="toggle"
    ></SvgIcon>
  </div>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import { useThemeStore } from '@/stores'
const { isFullscreen, toggle } = useFullscreen()

const themeStore = useThemeStore()
</script>

<style scoped></style>
