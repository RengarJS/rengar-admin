<template>
  <div
    class="relative relative size-screen"
    :style="{
      color: primaryColor,
    }"
  >
    <div class="absolute-center">
      <SvgIcon local-icon="i-local-loading" class="text-[60px]"></SvgIcon>
    </div>

    <div class="absolute-center h-10 w-10">
      <SvgIcon local-icon="i-local-logo" class="text-[40px]"></SvgIcon>
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
