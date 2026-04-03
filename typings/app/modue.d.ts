export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    vRole: {
      value: string | string[]
    }
  }
}

declare module 'axios' {
  interface AxiosRequestConfig {
    meta?: {
      routerFullPath?: string
    }
  }
}

declare module 'vue-router' {
  type RouteRecordName = RouteRecordName
  interface TypesConfig {
    RouteNamedMap: RouteNamedMap
  }
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
    multipleTab?: boolean
  }
}
