import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

abstract class BaseHttpClient {
  protected instance: AxiosInstance
  protected requestInterceptor: number
  protected responseInterceptor: number
  protected abortController: AbortController | null = null

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create({
      ...config,
    })
    this.requestInterceptor = this.initializeRequestInterceptor()
    this.responseInterceptor = this.initializeResponseInterceptor()
  }

  public cancel() {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }

  protected abstract initializeRequestInterceptor(): number
  protected abstract initializeResponseInterceptor(): number

  private createAbortController() {
    this.abortController = new AbortController()
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    this.createAbortController()
    return this.instance.get<T>(url, {
      ...config,
      signal: this.abortController!.signal,
    }) as Promise<T>
  }

  public async post<T = any>(url: string, data?: Recordable, config?: AxiosRequestConfig): Promise<T> {
    this.createAbortController()
    return this.instance.post<T>(url, data, {
      ...config,
      signal: this.abortController!.signal,
    }) as Promise<T>
  }

  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    this.createAbortController()
    return this.instance.request<T>({
      ...config,
      signal: this.abortController!.signal,
    }) as Promise<T>
  }

  public async upload<T = any>(
    url: string,
    file: File,
    extraData?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    this.createAbortController()
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
      signal: this.abortController!.signal,
    }) as Promise<T>
  }
}

export default BaseHttpClient
