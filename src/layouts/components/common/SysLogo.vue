<template>
  <div class="h-full flex-center gap-4 text-xl text-primary">
    <SvgIcon local-icon="i-local-logo" class="text-4xl"></SvgIcon>
    <div v-if="showTitle" class="whitespace-nowrap text-center">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
const title = import.meta.env.VITE_APP_TITLE

const { showTitle = true } = defineProps<{
  showTitle?: boolean
}>()
</script>

<style scoped></style>
