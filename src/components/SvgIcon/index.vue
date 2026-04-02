<template>
  <template v-if="icon">
    <Icon v-if="typeof icon === 'string'" :icon="formatIcon(icon)" :="$attrs"></Icon>
    <component v-else :is="icon" :="$attrs"></component>
  </template>
  <div v-if="localIcon" :class="formatLocalIcon" :="$attrs"></div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
const { icon, localIcon } = defineProps<{
  icon?: string | Component
  localIcon?: string
}>()

const formatIcon = (iconString: string) => {
  if (!iconString) return ''
  if (iconString.startsWith('i-')) {
    return iconString.slice(2)
  }
  return iconString
}

const formatLocalIcon = computed(() => {
  if (!localIcon) return ''
  if (!localIcon.startsWith('i-')) {
    return `i-${localIcon}`
  }
  return localIcon
})
</script>

<style scoped></style>
