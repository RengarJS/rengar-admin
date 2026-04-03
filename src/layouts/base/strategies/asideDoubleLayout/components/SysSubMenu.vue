<template>
  <NMenu
    v-model:value="value"
    :options="menus"
    :inverted="appStore.userConfig.invertedAside"
    :indent="20"
    responsive
    :collapsed
    :collapsed-width="appStore.systemConfig.asideCollapseWidth"
    @update:value="handleValueChange"
  ></NMenu>
</template>

<script setup lang="tsx">
import { type MenuOption } from 'naive-ui'
import { RouterLink, type RouteLocationRaw, type RouteRecordRaw } from 'vue-router'
import { useAppStore } from '@/stores'
const appStore = useAppStore()

const emit = defineEmits<{
  change: [val: RouteRecordName]
}>()

const { data } = defineProps<{
  data: RouteRecordRaw[]
  collapsed?: boolean
}>()

const value = defineModel<RouteRecordName>('active')

const menus = computed(() => {
  return generateMenus(data)
})

function renderLabel(route: RouteRecordRaw) {
  if (route.meta?.href) {
    return (
      <a href={route.meta.href} target="_blank">
        {route.meta?.title}
      </a>
    )
  }

  return !route.children ? (
    <RouterLink to={{ name: route.name } as RouteLocationRaw}>{route.meta?.title}</RouterLink>
  ) : (
    <span>{route.meta?.title}</span>
  )
}

function generateMenus(routes: RouteRecordRaw[]): MenuOption[] {
  return routes.map((route) => {
    const menuOption: MenuOption = {
      label: () => renderLabel(route),
      key: route.meta?.activeMenu || route.name,
      icon: () => {
        return <MenuIcon options={route.meta} class="text-2xl"></MenuIcon>
      },
      meta: route.meta,
    }

    if (route.children && route.children.length > 0) {
      menuOption.children = generateMenus(route.children)
    }

    return menuOption
  })
}

function handleValueChange(val: RouteRecordName) {
  emit('change', val)
}
</script>

<style scoped></style>
