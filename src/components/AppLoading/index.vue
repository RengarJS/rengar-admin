<template>
  <div
    class="relative relative size-screen"
    :style="{
      color: primaryColor,
    }"
  >
    <div class="absolute-center">
      <div class="i-local-loading text-[60px]"></div>
    </div>

    <div class="absolute-center h-10 w-10">
      <div class="i-local-logo text-[40px]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userConfig } from '@/config/app'
let primaryColor = ''
const appStr = localStorage.getItem('app')
if (appStr) {
  const app = JSON.parse(appStr)
  primaryColor = app.themeOverrides.common.primaryColor
} else {
  primaryColor = userConfig.primaryColor
}
</script>

<style scoped></style>
