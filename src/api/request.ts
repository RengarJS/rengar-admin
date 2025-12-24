// @/services/HttpClient.ts 或你的路径
import BaseHttpClient from '@rengar-admin/axios' // 👈 注意路径按你项目调整
import type { AxiosRequestConfig } from 'axios'
import { useRouterHook } from '@/hooks/router'
import { useAuthStore } from '@/stores'
import router from '@/router'

function showErrorMessage(message: string) {
  window.$message?.error?.(message) // 加可选链更安全
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
        // ✅ 记录发起请求时的路由路径
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
    // ✅ 关键：取消所有请求，避免后续 401 弹窗或跳转
    this.cancelAll()
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
          return this.handleUnauthorized(undefined, error.config?.meta?.routerFullPath)
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
