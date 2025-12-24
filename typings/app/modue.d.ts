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
