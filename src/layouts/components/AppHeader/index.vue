<template>
  <header class="h-full flex items-center gap-4 px-4">
    <AppLogo v-if="showHeaderLogo" :show-title="!isMobile" />
    <MobieMenuControl v-if="isMobile" />
    <AsideControl v-if="showAsideControl" />
    <div class="min-w-0 flex-1">
      <AppBreadcrumb v-if="showAppBreadcrumb" />
      <AppMenu
        v-if="showHeaderMenu"
        mode="horizontal"
        :data="menuStore.menuRoutes"
        v-model:active="menuStore.activeMenu"
      />
      <AppMenu
        v-if="showHeaderTopMenu"
        mode="horizontal"
        :data="menuStore.menuRoutes"
        children-field="list"
        v-model:active="menuStore.topActiveName"
      />
    </div>
    <ToolBtn />
    <UserCard />
  </header>
</template>

<script setup lang="ts">
import AsideControl from '../common/AsideControl.vue'
import ToolBtn from '../common/ToolBtn.vue'
import UserCard from '../common/UserCard.vue'
import AppBreadcrumb from '../common/AppBreadcrumb.vue'
import { useAppStore, useMenuStore } from '@/stores'
import AppMenu from '../common/AppMenu.vue'
import AppLogo from '../common/AppLogo.vue'
import MobieMenuControl from '../common/MobieMenuControl.vue'
const appStore = useAppStore()
const { showAppBreadcrumb, showHeaderLogo, showAsideControl, isMobile, showHeaderMenu, showHeaderTopMenu } =
  storeToRefs(appStore)

const menuStore = useMenuStore()
</script>

<style scoped></style>
