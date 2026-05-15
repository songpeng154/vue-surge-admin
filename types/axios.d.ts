import type { ApiPath } from './openapi-types'
import 'axios'

// type Path = ApiPath | string
type Path = ApiPath | (string & {})

declare module 'axios' {
  // 自定义请求配置
  interface InternalAxiosRequestConfig {
    // 是否取消消息提示
    isCancelMessagePrompt?: boolean
  }

  interface AxiosRequestConfig {
    url: Path
  }

  // 重写 axios 实例的返回类型，响应拦截器返回的是业务数据，而不是 AxiosResponse
  export interface AxiosInstance {
    <T = any>(config: AxiosRequestConfig): Promise<T>
    <T = any>(url: string, config?: AxiosRequestConfig): Promise<T>

    request: <T = any>(config: AxiosRequestConfig) => Promise<T>
    get: <T = any>(url: Path, config?: AxiosRequestConfig) => Promise<T>
    delete: <T = any>(url: Path, config?: AxiosRequestConfig) => Promise<T>
    head: <T = any>(url: Path, config?: AxiosRequestConfig) => Promise<T>
    options: <T = any>(url: Path, config?: AxiosRequestConfig) => Promise<T>
    post: <T = any>(url: Path, data?: any, config?: AxiosRequestConfig) => Promise<T>
    put: <T = any>(url: Path, data?: any, config?: AxiosRequestConfig) => Promise<T>
    patch: <T = any>(url: Path, data?: any, config?: AxiosRequestConfig) => Promise<T>
  }
}
