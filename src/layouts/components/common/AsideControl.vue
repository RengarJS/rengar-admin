<template>
  <NTooltip placement="bottom">
    <template #trigger>
      <div class="flex-center p-1 hover:bg-primary-100">
        <SvgIcon
          v-if="!appStore.systemConfig.asideCollapse"
          icon="i-line-md:menu-unfold-left"
          class="cursor-pointer text-xl text-primary"
          @click="appStore.toggleAsideCollapse"
        ></SvgIcon>
        <SvgIcon
          v-else
          icon="i-line-md:menu-unfold-right"
          class="cursor-pointer text-2xl text-primary"
          @click="appStore.toggleAsideCollapse"
        ></SvgIcon>
      </div>
    </template>
    <span>{{ appStore.systemConfig.asideCollapse ? '展开菜单' : '收起菜单' }}</span>
  </NTooltip>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
const appStore = useAppStore()
</script>

<style scoped></style>
