<template>
  <SvgIcon v-if="meta?.icon" :icon="meta.icon" :="$attrs" />
  <SvgIcon v-else-if="meta?.localIcon" :local-icon="meta?.localIcon" :="$attrs" />
  <div v-else class="i-ic:baseline-menu" :="$attrs"></div>
</template>

<script setup lang="ts">
import type { RouteMeta } from 'vue-router'
defineProps<{
  meta?: RouteMeta
}>()
</script>

<style scoped></style>
