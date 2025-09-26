<template>
  <NDrawer
    v-model:show="show"
    :width="400"
    :native-scrollbar="true"
    :auto-focus="false"
    placement="left"
    style="width: 80%"
  >
    <NDrawerContent title="系统菜单" :native-scrollbar="false" closable>
      <SysMenu v-model:active="menuStore.activeMenu" :data="menuStore.menuRoutes" @change="handleMenuChange" />
    </NDrawerContent>
  </NDrawer>
</template>

<script setup lang="ts">
import SysMenu from './common/SysMenu.vue'
import { useMenuStore, useAppStore } from '@/stores'
const show = defineModel<boolean>('show', {
  required: true,
})

const menuStore = useMenuStore()
const appStore = useAppStore()

function handleMenuChange() {
  appStore.toggleMenuDrawer(false)
}
</script>

<style scoped></style>
