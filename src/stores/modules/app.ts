import { useMediaQuery } from '@vueuse/core'
import { useOsTheme } from 'naive-ui'
import { userConfig as customConfig, bgColor } from '@/config/app'
import { themeColor } from '@rengar-admin/color'
import { injectTailwindCssVarToGlobal } from '@/utils/theme'

import type { GlobalThemeOverrides } from 'naive-ui'

export const useAppStore = defineStore(
  'app',
  () => {
    const isPc = useMediaQuery('(min-width: 1025px)')
    const isPad = useMediaQuery('(min-width: 768px) and (max-width: 1024px)')
    const isMobile = useMediaQuery('(max-width: 767px)')

    const userConfig = reactive<App.UserConfig>({
      ...customConfig,
    })

    const systemConfig = reactive<App.Config>({
      asideCollapse: isPad.value,
      asideCollapseWidth: 64,
    })

    function layoutModeChangeAction(mode: App.LayoutMode) {
      userConfig.layoutMode = mode
    }

    function compareLayoutConfig() {
      if (userConfig.version === customConfig.version) return
      for (const key in customConfig) {
        if ((userConfig as Recordable)[key] !== (customConfig as Recordable)[key]) {
          ;(userConfig as Recordable)[key] = (customConfig as Recordable)[key]
        }
      }
    }

    function resetUserConfig() {
      for (const key in customConfig) {
        ;(userConfig as Recordable)[key] = (customConfig as Recordable)[key]
      }
    }

    function toggleAsideCollapse() {
      systemConfig.asideCollapse = !systemConfig.asideCollapse
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

    // 切换主题按钮的模式
    const themeMode = ref<App.Theme>('auto')

    // 应用当前主题
    const theme = computed(() => {
      if (themeMode.value === 'light') return 'light'
      if (themeMode.value === 'dark') return 'dark'
      return osTheme.value || 'light'
    })

    // naive-ui主题颜色覆盖
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

    onMounted(() => setDetaultTheme())

    // 监听系统主题变化，当处于auto模式时触发过渡动画
    watch(osTheme, () => {
      if (themeMode.value === 'auto') {
        triggerThemeTransition()
      }
    })

    // 设置默认主题，根据当前主题切换类名和颜色
    function setDetaultTheme() {
      if (theme.value === 'dark') {
        document.documentElement.classList.add('dark')
        themeOverrides.Layout!.colorEmbedded = 'transparent'
        themeOverrides.Layout!.footerColor = 'transparent'
      } else {
        document.documentElement.classList.remove('dark')
        themeOverrides.Layout!.colorEmbedded = bgColor
        themeOverrides.Layout!.footerColor = bgColor
      }
    }

    // 切换主题时触发过渡动画
    function triggerThemeTransition(event?: MouseEvent) {
      if (!document.startViewTransition) {
        setDetaultTheme()
        return
      }
      const transition = document.startViewTransition(() => {
        setDetaultTheme()
      })

      transition.ready.then(() => {
        const { clientX, clientY } = event || { clientX: innerWidth / 2, clientY: innerHeight / 2 }

        const radius = Math.hypot(Math.max(clientX, innerWidth - clientX), Math.max(clientY, innerHeight - clientY))

        const clipPath = [
          `circle(0px at ${clientX}px ${clientY}px)`,
          `circle(${radius}px at ${clientX}px ${clientY}px)`,
        ]

        const isDark = document.documentElement.classList.contains('dark')

        document.documentElement.animate(
          {
            clipPath: isDark ? clipPath.reverse() : clipPath,
          },
          {
            duration: 450,
            easing: 'ease-in',
            pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
          },
        )
      })
    }

    function toggleTheme(event: MouseEvent) {
      if (themeMode.value === 'auto') {
        themeMode.value = 'light'
      } else if (themeMode.value === 'light') {
        themeMode.value = 'dark'
      } else {
        themeMode.value = 'auto'
      }

      triggerThemeTransition(event)
    }

    function resetLayoutAndTheme() {
      resetUserConfig()
      injectTailwindCssVarToGlobal(userConfig.primaryColor, 'primary')
    }

    return {
      userConfig,
      systemConfig,
      showConfigDrawer,
      showMenuDrawer,
      isPc,
      isMobile,
      isPad,
      layoutContentRef,
      showRouterView,
      toggleAsideCollapse,
      toggleConfigDrawer,
      layoutModeChangeAction,
      toggleMenuDrawer,
      setLayoutContentRef,
      refreshRouterView,
      themeOverrides,
      themeMode,
      theme,
      toggleTheme,
      resetLayoutAndTheme,
      compareLayoutConfig,
    }
  },

  {
    persist: {
      storage: localStorage,
      pick: ['userConfig', 'themeOverrides'],
      afterHydrate(ctx) {
        injectTailwindCssVarToGlobal(ctx.store.themeOverrides.common.primaryColor, 'primary')
      },
    },
  },
)
