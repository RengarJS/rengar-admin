export {}

declare global {
  namespace App {
    type ThemeMode = 'light' | 'dark' | 'auto'

    type LayoutMode = 'aside' | 'top' | 'top-aside'
    interface LayoutConfig {
      asideWidth: number
      headerHeight: number
      footerHeight: number
      tabHeight: number
      gap: number
      asideCollapse: boolean
      asideCollapseWidth: number
      showTabs: boolean
      showBreadcrumb: boolean
      showFooter: boolean
      invertedHeader: boolean
      invertedAside: boolean
    }

    interface BaseLayoutConfig extends Omit<LayoutConfig, 'asideCollapse' | 'asideCollapseWidth'> {
      layoutMode: LayoutMode
    }

    interface BaseConfig {
      layout: BaseLayoutConfig
      theme: {
        primaryColor: string
      }
    }

    interface Tab {
      title: string
      name: string
      path: string
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
