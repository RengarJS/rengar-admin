<template>
  <NWatermark
    v-if="appStore.userConfig.showWaterMark"
    :content
    cross
    fullscreen
    :font-size="16"
    :line-height="16"
    :width="320"
    :height="200"
    :x-offset="12"
    :y-offset="60"
    :rotate="-15"
  />
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'

const content = import.meta.env.VITE_APP_TITLE

const appStore = useAppStore()
</script>
