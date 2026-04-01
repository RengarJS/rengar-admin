<template>
  <NTooltip v-if="appStore.isPc" placement="bottom">
    <template #trigger>
      <div class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="jumpToGithub">
        <IMdiGithub></IMdiGithub>
      </div>
    </template>
    <span>github</span>
  </NTooltip>
  <div v-else class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="jumpToGithub">
    <IMdiGithub></IMdiGithub>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
const appStore = useAppStore()

function jumpToGithub() {
  window.open('https://github.com/RengarJS/rengar-admin')
}
</script>

<style scoped></style>
