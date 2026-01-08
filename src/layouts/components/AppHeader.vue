<template>
  <header class="h-full w-full flex items-center gap-4 px-4">
    <SysLogo v-if="showLogo" :show-title="!isMobile" />
    <MobieMenuControl v-if="!isPc" />
    <AsideControl v-if="showAsideControl" />
    <div class="min-w-0 flex-1">
      <slot></slot>
    </div>
    <div class="flex items-center gap-3 text-xl">
      <SearchControl />
      <ThemeControl />
      <SettingControl />
      <ScreenControl />
    </div>
    <UserCard />
  </header>
</template>

<script setup lang="ts">
import AsideControl from './common/AsideControl.vue'
import UserCard from './common/UserCard.vue'

import { useAppStore } from '@/stores'
import SysLogo from './common/SysLogo.vue'
import MobieMenuControl from './common/MobieMenuControl.vue'
import ThemeControl from './common/ThemeControl.vue'
import SettingControl from './common/SettingControl.vue'
import ScreenControl from './common/ScreenControl.vue'
import SearchControl from './common/SearchControl.vue'
const appStore = useAppStore()
const { isPc, isMobile } = storeToRefs(appStore)

defineProps<{
  showLogo: boolean
  showAsideControl: boolean
}>()
</script>

<style scoped></style>
