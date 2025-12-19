<template>
  <NTooltip placement="bottom">
    <template #trigger>
      <div class="cursor-pointe flex-center rounded-sm p-1 hover:text-primary" @click="appStore.toggleConfigDrawer">
        <SvgIcon icon="clarity:settings-line"></SvgIcon>
      </div>
    </template>
    <span>系统配置</span>
  </NTooltip>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
const appStore = useAppStore()
</script>

<style scoped></style>
