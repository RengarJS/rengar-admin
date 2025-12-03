import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    layout?: Layout
    roles?: string | string[]
    icon?: string
    localIcon?: string
    keepAlive?: boolean
    hideInMenu?: boolean
    hideInTab?: boolean
    activeMenu?: RouterName
    constant?: boolean
    order?: number
    href?: string
    fixedInTab?: boolean
    showBack?: boolean
  }
}
