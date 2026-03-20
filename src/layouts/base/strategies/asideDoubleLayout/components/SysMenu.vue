<template>
  <div>
    <div class="flex flex-col gap-2 p-2">
      <template v-if="!appStore.systemConfig.asideCollapse">
        <div
          v-for="item in data"
          :key="item.name"
          class="aspect-ratio-square flex flex-col cursor-pointer items-center justify-center gap-2 rounded"
          :class="getClass(item)"
          @click="handleClick(item)"
        >
          <SvgIcon v-if="item.meta?.icon" :icon="item.meta?.icon" class="text-2xl"></SvgIcon>
          <SvgIcon v-else-if="item.meta?.localIcon" :icon="item.meta?.localIcon" class="text-2xl"></SvgIcon>
          <SvgIcon v-else icon="ic:baseline-menu" class="text-2xl" />

          <div class="truncate">{{ item.meta?.title }}</div>
        </div>
      </template>

      <template v-else>
        <NTooltip v-for="item in data" :key="item.name" placement="right">
          <template #trigger>
            <div
              class="aspect-ratio-square flex flex-col cursor-pointer items-center justify-center gap-2 rounded"
              :class="[item.name === menuStore.topActiveName ? 'text-primary bg-primary-100' : 'hover:bg-zinc-100']"
              @click="handleClick(item)"
            >
              <SvgIcon v-if="item.meta?.icon" :icon="item.meta?.icon" class="text-2xl"></SvgIcon>
              <SvgIcon v-else-if="item.meta?.localIcon" :icon="item.meta?.localIcon" class="text-2xl"></SvgIcon>
              <SvgIcon v-else icon="ic:baseline-menu" class="text-2xl" />
            </div>
          </template>
          {{ item.meta?.title }}
        </NTooltip>
      </template>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { useMenuStore, useAppStore } from '@/stores'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { type RouteRecordRaw } from 'vue-router'
const menuStore = useMenuStore()
const value = defineModel<RouteRecordName>('active')

const appStore = useAppStore()

const { data } = defineProps<{
  data: RouteRecordRaw[]
}>()

const emit = defineEmits<{
  change: [show: boolean]
}>()

const router = useRouter()

function getClass(item: RouteRecordRaw) {
  if (appStore.userConfig.invertedAside) {
    return item.name === menuStore.topActiveName ? 'text-white bg-primary' : 'hover:text-white text-zinc-300'
  } else {
    return item.name === menuStore.topActiveName
      ? 'text-primary bg-primary-100 dark:bg-primary-800'
      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
  }
}
function handleClick(item: RouteRecordRaw) {
  value.value = item.name as RouteRecordName
  if (!item.children) {
    router.push({ name: item.name as RouteRecordName })
    emit('change', false)
    return
  }
  emit('change', true)
}
</script>

<style scoped></style>
