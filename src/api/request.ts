import BaseHttpClient from '@rengar-admin/axios'
import type { AxiosRequestConfig } from 'axios'
import { useRouterHook } from '@/hooks/router'
import { useAuthStore } from '@/stores'
import router from '@/router'

declare module 'axios' {
  interface AxiosRequestConfig {
    meta?: {
      routerFullPath?: string
    }
  }
}

function showErrorMessage(message: string) {
  window.$message.error(message)
}

class HttpClient extends BaseHttpClient {
  constructor(config: AxiosRequestConfig) {
    super(config)
  }

  protected initializeRequestInterceptor(): number {
    return this.instance.interceptors.request.use(
      (config) => {
        const authStore = useAuthStore()
        if (authStore.user.token) {
          config.headers.Authorization = `Bearer ${authStore.user.token}`
        }
        config.meta = config.meta || {}
        config.meta.routerFullPath = router.currentRoute.value.fullPath
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
  }

  private handleUnauthorized(message: string = '未授权，请重新登录', path?: string) {
    const { routerReplaceToLogin } = useRouterHook(false)
    this.cancel()
    showErrorMessage(message)
    const authStore = useAuthStore()
    authStore.reset()
    routerReplaceToLogin(path)
    return Promise.reject(new Error(message))
  }

  protected initializeResponseInterceptor(): number {
    return this.instance.interceptors.response.use(
      (response) => {
        if (response.status === 200 && response.data.code === '000000') {
          return response.data.data
        } else if (response.data.code === '401') {
          return this.handleUnauthorized(undefined, response.config.meta?.routerFullPath)
        } else {
          showErrorMessage(response.data.message || '请求失败')
          return Promise.reject(new Error(response.data.message || '请求失败'))
        }
      },
      (error) => {
        if (error.response?.status === 401) {
          return this.handleUnauthorized(undefined, error.config.meta?.routerFullPath)
        }
        showErrorMessage(error?.response?.data?.message || '请求失败')
        return Promise.reject(error)
      },
    )
  }
}

const baseHttp = new HttpClient({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 1000 * 10,
})

export { baseHttp }
