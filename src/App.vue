<template>
  <component :is="layoutComponent"></component>
</template>

<script setup lang="ts">
import BasicLayout from '@/layouts/base/index.vue'
import BlankLayout from '@/layouts/blank/index.vue'

import { useAppStore } from '@/stores'

defineOptions({
  name: 'App',
})

const appStore = useAppStore()
appStore.compareLayoutConfig()

const route = useRoute()
const layoutComponent = computed(() => {
  const layout = route.meta.layout
  if (!layout || layout === 'base') return BasicLayout
  return BlankLayout
})

// 开发环境不引入自动更新
if (!import.meta.env.DEV) {
  import('@/hooks/update').then((module) => {
    module.useUpdateChecker()
  })
}
</script>

<style scoped></style>
