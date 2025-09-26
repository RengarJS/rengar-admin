import { useMediaQuery } from '@vueuse/core'
import { useOsTheme } from 'naive-ui'
import { appConfig, bgColor } from '@/config/app'
import { themeColor } from '@rengar-admin/color'
import { injectTailwindCssVarToGlobal } from '@/utils/theme'

import type { GlobalThemeOverrides } from 'naive-ui'
import { omit } from 'es-toolkit'

export const useAppStore = defineStore(
  'app',
  () => {
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

    // 切换主题按钮的模式
    const themoMode = ref<App.ThemeMode>('auto')

    // 应用当前主题
    const theme = computed(() => {
      if (themoMode.value === 'light') return 'light'
      if (themoMode.value === 'dark') return 'dark'
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
      if (themoMode.value === 'auto') {
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
      if (themoMode.value === 'auto') {
        themoMode.value = 'light'
      } else if (themoMode.value === 'light') {
        themoMode.value = 'dark'
      } else {
        themoMode.value = 'auto'
      }

      triggerThemeTransition(event)
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
