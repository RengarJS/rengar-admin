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
    const activeRouteName = ref('')
    const router = useRouter()
    const { routerReplaceToHome } = useRouterHook()

    watch(
      () => router.currentRoute.value,
      (val) => {
        const meta = val.matched.find((item) => item.name === val.name)?.meta
        if (!meta) return
        if (meta.layout && meta.layout !== 'base') return
        if (meta.hideInTab) {
          activeRouteName.value = ''
          return
        }
        addTabsAction({
          title: meta.title,
          name: val.name as string,
          path: val.path,
          icon: meta.icon,
          localIcon: meta.localIcon,
        })
        activeRouteName.value = val.name as string
      },
      {
        immediate: true,
      },
    )

    function addTabsAction(tab: App.Tab) {
      const index = tabsList.value.findIndex((item) => item.name === tab.name)
      if (index !== -1) {
        return
      }
      tabsList.value.push(tab)
    }

    function removeTabsAction(tab: App.Tab) {
      const index = tabsList.value.findIndex((item) => item.name === tab.name)
      const isLast = tabsList.value.length === index + 1
      if (index === -1) return
      tabsList.value.splice(index, 1)

      if (activeRouteName.value === tab.name) {
        if (isLast) {
          router.push(tabsList.value[index - 1]!.path)
        } else {
          router.push(tabsList.value[index - 1]!.path)
        }
      }
    }

    function closeOtherTabsAction(tab: App.Tab) {
      tabsList.value = tabsList.value.filter((item) => item.fixedInTab || item.name === tab.name)
      router.replace({ name: tab.name })
    }
    function closeLeftTabsAction(tab: App.Tab) {
      const index = tabsList.value.findIndex((item) => item.name === tab.name)
      const activeIndex = tabsList.value.findIndex((item) => item.name === activeRouteName.value)
      if (index === -1) return
      tabsList.value = tabsList.value.filter((item, i) => item.fixedInTab || i >= index)
      if (index > activeIndex) {
        router.replace({ name: tab.name })
      }
    }
    function closeRightTabsAction(tab: App.Tab) {
      const index = tabsList.value.findIndex((item) => item.name === tab.name)
      const activeIndex = tabsList.value.findIndex((item) => item.name === activeRouteName.value)
      if (index === -1) return
      tabsList.value = tabsList.value.filter((item, i) => item.fixedInTab || i <= index)
      if (index < activeIndex) {
        router.replace({ name: tab.name })
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
          path: route.path,
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
      activeRouteName,
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
