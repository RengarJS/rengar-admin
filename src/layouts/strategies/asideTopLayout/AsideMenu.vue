<template>
  <NLayoutContent
    :native-scrollbar="false"
    position="absolute"
    :style="{
      top: 0,
      bottom: 0,
    }"
  >
    <SysMenu v-model:active="menuStore.activeMenu" :data="menuStore.subMenuRoutes" :collapsed="config.asideCollapse" />
  </NLayoutContent>
</template>

<script setup lang="ts">
import { useAppStore, useMenuStore } from '@/stores'
import SysMenu from '@/layouts/components/common/SysMenu.vue'
const appStore = useAppStore()
const { config } = storeToRefs(appStore)

const menuStore = useMenuStore()
</script>

<style scoped></style>
