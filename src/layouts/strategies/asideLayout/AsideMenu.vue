<template>
  <NLayout position="absolute">
    <NLayoutHeader
      :style="{
        height: numberToPx(config.headerHeight),
      }"
    >
      <SysLogo :show-title="!config.asideCollapse" />
    </NLayoutHeader>
    <NLayoutContent
      :native-scrollbar="false"
      position="absolute"
      :style="{
        top: numberToPx(config.headerHeight),
        bottom: 0,
      }"
    >
      <SysMenu v-model:active="menuStore.activeMenu" :data="menuStore.menuRoutes" :collapsed="config.asideCollapse" />
    </NLayoutContent>
  </NLayout>
</template>

<script setup lang="ts">
import { useAppStore, useMenuStore } from '@/stores'
import { numberToPx } from '@/utils/tools'
import SysLogo from '@/layouts/components/common/SysLogo.vue'
import SysMenu from '@/layouts/components/common/SysMenu.vue'
const appStore = useAppStore()
const { config } = storeToRefs(appStore)

const menuStore = useMenuStore()
</script>

<style scoped></style>
