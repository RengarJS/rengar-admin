<template>
  <NMenu
    v-model:value="value"
    :mode
    :options="menus"
    :collapsed
    :collapsed-width="appStore.systemConfig.asideCollapseWidth"
    :children-field="childrenField"
    :indent="20"
    @update:value="handleValueChange"
  ></NMenu>
</template>

<script setup lang="tsx">
import { type MenuOption } from 'naive-ui'
import { RouterLink, type RouteRecordRaw } from 'vue-router'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useAppStore } from '@/stores'
const appStore = useAppStore()

const emit = defineEmits<{
  change: [val: RouteRecordName]
}>()

const {
  childrenField = 'children',
  mode = 'vertical',
  data,
  collapsed,
} = defineProps<{
  mode?: 'horizontal' | 'vertical'
  data: RouteRecordRaw[]
  isTopMenu?: boolean
  collapsed?: boolean
  childrenField?: string
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
    <RouterLink to={{ name: route.name }}>{route.meta?.title}</RouterLink>
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
        if (route.meta?.icon) {
          return <SvgIcon icon={route.meta?.icon}></SvgIcon>
        } else if (route.meta?.localIcon) {
          return <SvgIcon localIcon={route.meta?.localIcon}></SvgIcon>
        } else {
          return <SvgIcon icon="ic:baseline-menu"></SvgIcon>
        }
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
