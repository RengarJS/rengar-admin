<template>
  <RouterView v-slot="{ Component }">
    <Transition :name="appStore.userConfig.transitionName" mode="out-in" appear>
      <KeepAlive :include="keepAliveStore.keepAliveList">
        <component :is="Component" />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<script setup lang="ts">
import { useKeepAliveStore, useAppStore } from '@/stores'

const keepAliveStore = useKeepAliveStore()

const appStore = useAppStore()
</script>

<style scoped>
/* ======================
 * 淡入淡出（仅 opacity）
 * ====================== */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ======================
 * 滑动 + 淡入（transform + opacity）
 * ====================== */

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 缩放 + 淡入 */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.scale-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>
