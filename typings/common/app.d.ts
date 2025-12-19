export {}

declare global {
  namespace App {
    type Theme = 'light' | 'dark' | 'auto'
    type LayoutMode = 'aside' | 'top' | 'top-aside'
    type TransitionName = 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'scale' | 'none'

    interface UserConfig {
      version: number
      asideWidth: number
      headerHeight: number
      footerHeight: number
      tabHeight: number
      gap: number
      showTabs: boolean
      showBreadcrumb: boolean
      showFooter: boolean
      invertedHeader: boolean
      invertedAside: boolean
      layoutMode: LayoutMode
      primaryColor: string
      transitionName: TransitionName
    }

    interface Config {
      asideCollapse: boolean
      asideCollapseWidth: number
    }

    interface BaseLayoutConfig extends Omit<LayoutConfig, 'asideCollapse' | 'asideCollapseWidth'> {
      layoutMode: LayoutMode
    }

    interface Tab {
      title: string
      name: string
      fullPath: string
      icon?: string
      localIcon?: string
      fixedInTab?: boolean
    }

    namespace Auth {
      interface User {
        username?: string
        id?: number
        token?: string
      }
    }
  }
}
