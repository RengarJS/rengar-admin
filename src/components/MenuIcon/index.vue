<template>
  <template v-if="options.icon">
    <SvgIcon v-if="!isExtraIcon" :icon="options.icon" :="$attrs" />
    <component v-else :is="iconComponent" :="$attrs" />
  </template>
  <SvgIcon v-else-if="options.localIcon" :local-icon="options.localIcon" :="$attrs" />
  <div v-else class="i-ic:baseline-menu" :="$attrs"></div>
</template>

<script setup lang="ts">
import { isExtra, extraRoutesConfig } from '@/router/config'

interface IconInfo {
  icon?: string
  localIcon?: string
}

const { options = {} } = defineProps<{
  options?: IconInfo
}>()

const isExtraIcon = computed(() => {
  if (!options.icon || typeof options.icon !== 'string') return false
  return options.icon.startsWith(isExtra)
})

const iconComponent = computed(() => {
  if (!options.icon || typeof options.icon !== 'string' || !options.icon.startsWith(isExtra)) return null
  const routeName = options.icon!.replace(isExtra, '') as RouteRecordName
  return extraRoutesConfig[routeName]?.icon
})
</script>

<style scoped></style>
