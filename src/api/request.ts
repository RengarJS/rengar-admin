import BaseHttpClient from '@rengar-admin/axios'
import type { AxiosRequestConfig } from 'axios'
import { useRouterHook } from '@/hooks/router'
import { useAuthStore } from '@/stores'
import router from '@/router'

const APIFOX_TOKEN = import.meta.env.VITE_APIFOX_TOKEN
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

        config.headers.apifoxToken = APIFOX_TOKEN

        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
  }

  private handleUnauthorized(message: string = '未授权，请重新登录') {
    const { routerReplaceToLogin } = useRouterHook(false)
    this.cancel()
    showErrorMessage(message)
    const authStore = useAuthStore()
    authStore.reset()
    routerReplaceToLogin(router.currentRoute.value.fullPath)
    return Promise.reject(new Error(message))
  }

  protected initializeResponseInterceptor(): number {
    return this.instance.interceptors.response.use(
      (response) => {
        if (response.status === 200 && response.data.code === '000000') {
          return response.data.data
        } else if (response.data.code === '401') {
          return this.handleUnauthorized()
        } else {
          showErrorMessage(response.data.message || '请求失败')
          return Promise.reject(new Error(response.data.message || '请求失败'))
        }
      },
      (error) => {
        if (error.response?.status === 401) {
          return this.handleUnauthorized()
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
