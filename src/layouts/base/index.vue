<template>
  <component :is="layout[appStroe.layoutMode]" />
</template>

<script setup lang="ts">
import { layout } from '../strategies'
import { useAppStore } from '@/stores'

const appStroe = useAppStore()
</script>

<style scoped></style>
