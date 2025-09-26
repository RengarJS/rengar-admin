<template>
  <header class="h-full flex items-center gap-4 px-4">
    <SysLogo v-if="showLogo" :show-title="!isMobile" />
    <MobieMenuControl v-if="!isPc" />
    <AsideControl v-if="showAsideControl" />
    <div class="min-w-0 flex-1">
      <slot></slot>
    </div>
    <ToolBtn />
    <UserCard />
  </header>
</template>

<script setup lang="ts">
import AsideControl from './common/AsideControl.vue'
import ToolBtn from './common/ToolBtn.vue'
import UserCard from './common/UserCard.vue'

import { useAppStore } from '@/stores'
import SysLogo from './common/SysLogo.vue'
import MobieMenuControl from './common/MobieMenuControl.vue'
const appStore = useAppStore()
const { isPc, isMobile } = storeToRefs(appStore)

defineProps<{
  showLogo: boolean
  showAsideControl: boolean
}>()
</script>

<style scoped></style>
