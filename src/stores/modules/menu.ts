import { routes } from '@/router/routes'
import { useAuthStore } from './auth'
import { filterRoutes } from '@/router/utils'
import type { RouteRecordRaw } from 'vue-router'

export const useMenuStore = defineStore('menu', () => {
  const authStore = useAuthStore()
  const menuRoutes = ref<RouteRecordRaw[]>([])
  const activeMenu = ref<RouteRecordName>()
  function sortMenus(menus: RouteRecordRaw[]): RouteRecordRaw[] {
    // 对当前层级的菜单进行排序
    const sortedMenus = menus.sort((a, b) => {
      const sortA = a.meta?.order || 0
      const sortB = b.meta?.order || 0
      return sortA - sortB
    })

    // 递归处理子菜单
    sortedMenus.forEach((menu) => {
      if (menu.children) {
        menu.children = sortMenus(menu.children)
      }
    })

    return sortedMenus
  }

  function generateMenus() {
    const roleMap = authStore.roleMap
    const filterMenus = filterRoutes(routes, (route) => {
      if (route.meta?.hideInMenu) return false
      const roles = route.meta?.roles
      if (Array.isArray(roles) && roles.length > 0) {
        return roles.some((role) => roleMap.has(role))
      }
      if (typeof roles === 'string') {
        return roleMap.has(roles)
      }
      return true
    })
    const menus = sortMenus(filterMenus)
    menuRoutes.value = menus
  }

  const topActiveName = ref<RouteRecordName>()
  const subMenuRoutes = computed(() => {
    if (!topActiveName.value) return []
    const menu = menuRoutes.value.find((menu) => menu.name === topActiveName.value)
    if (!menu) return []
    return menu.children || []
  })

  const router = useRouter()

  watch(
    () => router.currentRoute.value,
    (val) => {
      activeMenu.value = val.meta.activeMenu ?? val.name
      topActiveName.value = val.matched[0]?.name as RouteRecordName
    },
  )

  return {
    menuRoutes,
    topActiveName,
    subMenuRoutes,
    activeMenu,
    generateMenus,
  }
})
