import { traverseRoutes } from '@/router/utils'
import { routes } from '@/router/routes'
import { useAuthStore } from './auth'
import { cloneDeep } from 'es-toolkit'
import { useRouterHook } from '@/hooks/router'

export const useTabStore = defineStore(
  'tab',
  () => {
    const authStore = useAuthStore()
    const tabsList = ref<App.Tab[]>([])
    let fixedTabList: App.Tab[] = []
    const router = useRouter()
    const { routerReplaceToHome } = useRouterHook()
    watch(
      () => router.currentRoute.value,
      (val) => {
        const meta = val.matched.find((item) => item.name === val.name)?.meta
        if (!meta) return
        if (meta.layout && meta.layout !== 'base') return
        if (meta.hideInTab) return

        const tab: App.Tab = {
          title: meta.title,
          name: val.name as string,
          fullPath: val.fullPath,
          icon: meta.icon,
          localIcon: meta.localIcon,
        }

        if (!meta.multipleTab) {
          const index = tabsList.value.findIndex((item) => item.name === tab.name)
          if (index !== -1) {
            tabsList.value[index]!.fullPath = tab.fullPath
            return
          }
          tabsList.value.push(tab)
        } else {
          const index = tabsList.value.findIndex((item) => item.fullPath === tab.fullPath)
          if (index === -1) {
            tabsList.value.push(tab)
          }
        }
      },
      {
        immediate: true,
      },
    )

    function removeTabsAction(tab: App.Tab) {
      // 统一使用fullPath进行匹配
      const index = tabsList.value.findIndex((item) => item.fullPath === tab.fullPath)
      const isLast = tabsList.value.length === index + 1
      if (index === -1) return
      tabsList.value.splice(index, 1)

      if (router.currentRoute.value.fullPath === tab.fullPath) {
        if (isLast) {
          router.push(tabsList.value[index - 1]!.fullPath)
        } else {
          router.push(tabsList.value[index - 1]!.fullPath)
        }
      }
    }

    function closeOtherTabsAction(tab: App.Tab) {
      // 统一使用fullPath进行匹配
      tabsList.value = tabsList.value.filter((item) => item.fixedInTab || item.fullPath === tab.fullPath)
      router.replace(tab.fullPath)
    }

    function closeLeftTabsAction(tab: App.Tab) {
      // 统一使用fullPath进行匹配
      const index = tabsList.value.findIndex((item) => item.fullPath === tab.fullPath)
      const activeIndex = tabsList.value.findIndex((item) => item.fullPath === router.currentRoute.value.fullPath)
      if (index === -1) return
      tabsList.value = tabsList.value.filter((item, i) => item.fixedInTab || i >= index)
      if (index > activeIndex) {
        router.replace(tab.fullPath)
      }
    }

    function closeRightTabsAction(tab: App.Tab) {
      // 统一使用fullPath进行匹配
      const index = tabsList.value.findIndex((item) => item.fullPath === tab.fullPath)
      const activeIndex = tabsList.value.findIndex((item) => item.fullPath === router.currentRoute.value.fullPath)
      if (index === -1) return
      tabsList.value = tabsList.value.filter((item, i) => item.fixedInTab || i <= index)
      if (index < activeIndex) {
        router.replace(tab.fullPath)
      }
    }

    function closeAllTabsAction() {
      tabsList.value = fixedTabList
      routerReplaceToHome()
    }

    function initTabs() {
      const roleMap = authStore.roleMap
      const list: App.Tab[] = []
      traverseRoutes(routes, (route) => {
        const roles = route.meta?.role
        if (Array.isArray(roles) && roles.length > 0 && !roles.some((role) => roleMap.has(role))) {
          return
        }
        if (!route.meta?.fixedInTab) return
        if (route.meta.layout && route.meta.layout !== 'base') return
        list.push({
          title: route.meta.title,
          name: route.name as string,
          fullPath: route.path,
          icon: route.meta.icon,
          localIcon: route.meta.localIcon,
          fixedInTab: true,
        })
      })
      fixedTabList = cloneDeep(list)
      if (tabsList.value.length) return
      tabsList.value = cloneDeep(list)
    }

    return {
      tabsList,
      removeTabsAction,
      initTabs,
      closeOtherTabsAction,
      closeLeftTabsAction,
      closeRightTabsAction,
      closeAllTabsAction,
    }
  },
  {
    persist: {
      storage: sessionStorage,
      pick: ['tabsList'],
    },
  },
)
