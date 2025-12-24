import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

abstract class BaseHttpClient {
  protected instance: AxiosInstance
  protected requestInterceptor!: number
  protected responseInterceptor!: number
  private abortControllers: AbortController[] = []

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create({
      ...config,
    })

    this.requestInterceptor = this.initializeRequestInterceptor()
    this.responseInterceptor = this.initializeResponseInterceptor()
  }

  /**
   * 取消所有正在进行的请求
   */
  public cancelAll() {
    this.abortControllers.forEach((ac) => {
      if (!ac.signal.aborted) {
        ac.abort()
      }
    })
    this.abortControllers = []
  }

  /**
   * 创建并记录 AbortController，返回 signal
   */
  private createAbortController() {
    const controller = new AbortController()
    this.abortControllers.push(controller)
    return controller.signal
  }

  /**
   * 请求拦截器钩子（子类可覆盖）
   */
  protected initializeRequestInterceptor(): number {
    return this.instance.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error),
    )
  }

  /**
   * 响应拦截器钩子（子类可覆盖）
   */
  protected initializeResponseInterceptor(): number {
    return this.instance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error),
    )
  }

  // --- HTTP 方法 ---
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const signal = this.createAbortController()
    return this.instance.get<T>(url, { ...config, signal }) as Promise<T>
  }

  public async post<T = any>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
    const signal = this.createAbortController()
    return this.instance.post<T>(url, data, { ...config, signal }) as Promise<T>
  }

  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const signal = this.createAbortController()
    return this.instance.request<T>({ ...config, signal }) as Promise<T>
  }

  public async upload<T = any>(
    url: string,
    file: File,
    extraData?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const signal = this.createAbortController()
    const formData = new FormData()
    formData.append('file', file)
    if (extraData) {
      Object.entries(extraData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }
    return this.instance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
      signal,
    }) as Promise<T>
  }
}

export default BaseHttpClient
