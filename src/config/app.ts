import type {} from '../../typings/app/app'

const appConfig: App.BaseConfig = {
  layout: {
    layoutMode: 'top-aside',
    asideWidth: 220,
    headerHeight: 56,
    footerHeight: 46,
    tabHeight: 44,
    gap: 12,
    showTabs: true,
    showBreadcrumb: true,
    showFooter: true,
    invertedHeader: false,
    invertedAside: false,
  },
  theme: {
    primaryColor: '#8B5CF6',
  },
}

export const bgColor = '#f8fafc'

export { appConfig }
