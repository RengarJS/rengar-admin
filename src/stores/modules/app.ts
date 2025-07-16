import { useMediaQuery } from '@vueuse/core'
import { useMenuStore } from './menu'
import { useOsTheme } from 'naive-ui'
import { appConfig, bgColor } from '@/config/app'
import { themeColor } from '@rengar-admin/color'
import { injectTailwindCssVarToGlobal } from '@/utils/theme'

import type { GlobalThemeOverrides } from 'naive-ui'
import { omit } from 'es-toolkit'

export const useAppStore = defineStore(
  'app',
  () => {
    const menuStore = useMenuStore()
    const layoutMode = ref<App.LayoutMode>('aside')
    const showAsideMode = computed(() => layoutMode.value === 'aside')
    const showTopMode = computed(() => layoutMode.value === 'top')
    const showTopAsideMode = computed(() => layoutMode.value === 'top-aside')
    function layoutModeChangeAction(mode: App.LayoutMode) {
      layoutMode.value = mode
    }

    const isPc = useMediaQuery('(min-width: 1025px)')
    const isPad = useMediaQuery('(min-width: 768px) and (max-width: 1024px)')
    const isMobile = useMediaQuery('(max-width: 767px)')

    const config = reactive<App.LayoutConfig>({
      ...omit(appConfig.layout, ['layoutMode']),
      asideCollapse: isPad.value,
      asideCollapseWidth: 64,
    })

    const showAppAside = computed(() => {
      if (isMobile.value) return false
      if (showAsideMode.value) return true
      if (showTopAsideMode.value && menuStore.subMenuRoutes.length > 0) return true
      return false
    })

    const showAppBreadcrumb = computed(() => {
      if (!config.showBreadcrumb) return false
      if (isMobile.value) return false
      if (showAsideMode.value) return true
      return false
    })

    const showHeaderLogo = computed(() => {
      if (showAsideMode.value && !isMobile.value) return false
      if (!isMobile.value && showTopAsideMode.value && menuStore.subMenuRoutes.length > 0) return false
      return true
    })

    const showAsideControl = computed(() => {
      if (!isPc.value) return false
      if (showAsideMode.value) return true
      if (showTopAsideMode.value && menuStore.subMenuRoutes.length > 0) return true
      return false
    })

    const showHeaderMenu = computed(() => {
      if (isMobile.value) return false
      if (!showTopMode.value) return false
      return true
    })

    const showHeaderTopMenu = computed(() => {
      if (isMobile.value) return false
      if (!showTopAsideMode.value) return false
      return true
    })

    watch([isPad, isPc], ([padVal, pcVal]) => {
      if (padVal && showAppAside.value) {
        config.asideCollapse = true
      }

      if (pcVal) {
        config.asideCollapse = false
      }
    })

    function toggleAsideCollapse() {
      config.asideCollapse = !config.asideCollapse
    }

    const showConfigDrawer = ref(false)
    function toggleConfigDrawer() {
      showConfigDrawer.value = !showConfigDrawer.value
    }

    const showMenuDrawer = ref(false)
    function toggleMenuDrawer(val: boolean) {
      showMenuDrawer.value = val
    }

    const layoutContentRef = ref<HTMLElement>()

    function setLayoutContentRef(el: HTMLElement) {
      layoutContentRef.value = el
    }

    const showRouterView = ref(true)

    function refreshRouterView() {
      showRouterView.value = false
      nextTick(() => {
        showRouterView.value = true
      })
    }

    const osTheme = useOsTheme()
    const themoMode = ref<App.ThemeMode>('light')
    const theme = computed(() => {
      if (themoMode.value === 'light') return 'light'
      if (themoMode.value === 'dark') return 'dark'
      return osTheme.value || 'light'
    })

    const themeOverrides = reactive<GlobalThemeOverrides>({
      Layout: {
        colorEmbedded: theme.value === 'light' ? bgColor : 'transparent',
        footerColor: theme.value === 'light' ? bgColor : 'transparent',
      },
      common: {
        primaryColor: themeColor.primary.DEFAULT,
        primaryColorHover: themeColor.primary['400'],
        primaryColorPressed: themeColor.primary['700'],
        primaryColorSuppl: themeColor.primary['400'],
      },
    })

    watch(
      theme,
      (val) => {
        if (val === 'dark') {
          document.documentElement.classList.add('dark')
          themeOverrides.Layout!.colorEmbedded = 'transparent'
          themeOverrides.Layout!.footerColor = 'transparent'
        } else {
          document.documentElement.classList.remove('dark')
          themeOverrides.Layout!.colorEmbedded = bgColor
          themeOverrides.Layout!.footerColor = bgColor
        }
      },
      {
        immediate: true,
      },
    )

    function toggleTheme() {
      if (themoMode.value === 'auto') {
        themoMode.value = 'light'
      } else if (themoMode.value === 'light') {
        themoMode.value = 'dark'
      } else {
        themoMode.value = 'auto'
      }
    }

    function resetLayoutAndTheme() {
      layoutMode.value = appConfig.layout.layoutMode
      Object.assign(config, omit(appConfig.layout, ['layoutMode']))
      injectTailwindCssVarToGlobal(appConfig.theme.primaryColor, 'primary')
    }

    return {
      config,
      showConfigDrawer,
      showMenuDrawer,
      layoutMode,
      showAsideMode,
      showTopMode,
      showTopAsideMode,
      isPc,
      isMobile,
      isPad,

      showAppAside,
      showAppBreadcrumb,
      showHeaderLogo,
      showAsideControl,
      showHeaderMenu,
      showHeaderTopMenu,
      layoutContentRef,
      showRouterView,
      toggleAsideCollapse,
      toggleConfigDrawer,
      layoutModeChangeAction,
      toggleMenuDrawer,
      setLayoutContentRef,
      refreshRouterView,

      themeOverrides,
      themoMode,
      theme,
      toggleTheme,
      resetLayoutAndTheme,
    }
  },

  {
    persist: {
      storage: localStorage,
      pick: ['layoutMode', 'themoMode', 'themeOverrides', 'config'],
      afterHydrate(ctx) {
        injectTailwindCssVarToGlobal(ctx.store.themeOverrides.common.primaryColor, 'primary')
      },
    },
  },
)
