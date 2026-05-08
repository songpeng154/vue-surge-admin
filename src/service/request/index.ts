import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import MessageConstant from '@/constant/message.ts'
import ServiceConstant from '@/constant/service.ts'
import { showMessage } from '@/service/request/utils'
import useAuthStore from '@/store/modules/auth'
import { getServicePrefixOrUrl } from '@/utils/env'
import { BusinessError } from './error'

const service = axios.create({
  baseURL: getServicePrefixOrUrl('BASE'),
  timeout: ServiceConstant.REQUEST_TIMEOUT,
})

// 请求拦截器
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.headers)
    config.headers.token = 1
  return config
})

// 响应拦截器
service.interceptors.response.use(
  async (response: AxiosResponse<Result>) => {
    // 文件流直接返回
    if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer')
      return response

    const { code, msg, result } = response.data
    const { isCancelMessagePrompt } = response.config

    // 成功响应直接返回结果
    if (code === ServiceConstant.SUCCESS_CODE)
      return result

    // 处理需要退出登录的错误
    if (ServiceConstant.SIGN_OUT_CODE[code]) {
      const authStore = useAuthStore()
      const errorMessage = ServiceConstant.SIGN_OUT_CODE[code]

      await authStore.signOut()
      !isCancelMessagePrompt && showMessage(errorMessage, 'warning')

      return Promise.reject(new BusinessError(code, errorMessage))
    }

    // 处理其他错误
    const errorMessage = ServiceConstant.STATUS_ERROR[code] || msg || MessageConstant.SERVER_ERROR
    !isCancelMessagePrompt && showMessage(errorMessage)

    return Promise.reject(new BusinessError(code, errorMessage))
  },
  (err) => {
    let errorMsg: string = MessageConstant.SERVER_ERROR

    // 处理响应后的错误
    if (err.response) {
      // 请求已发出，但服务器响应的状态码错误
      const msg = ServiceConstant.STATUS_ERROR[err.response.status]
      if (msg)
        errorMsg = msg
    }
    else {
      // 处理请求时的错误
      const msg = ServiceConstant.AXIOS_REQUEST_ERROR[err.code as string]
      if (msg)
        errorMsg = msg
    }
    showMessage(errorMsg)

    return Promise.reject(err)
  },
)

export default service
