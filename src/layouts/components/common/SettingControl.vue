<template>
  <NTooltip v-if="appStore.isPc" placement="bottom">
    <template #trigger>
      <div class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="appStore.toggleConfigDrawer">
        <SvgIcon icon="clarity:settings-line"></SvgIcon>
      </div>
    </template>
    <span>系统配置</span>
  </NTooltip>

  <div v-else class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="appStore.toggleConfigDrawer">
    <SvgIcon icon="clarity:settings-line"></SvgIcon>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
const appStore = useAppStore()
</script>

<style scoped></style>
