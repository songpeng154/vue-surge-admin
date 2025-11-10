import type { ResponseContent } from 'norm-axios'
import { NormAxios } from 'norm-axios'
import MessageConstant from '@/constant/message.ts'
import ServiceConstant from '@/constant/service.ts'
import { showMessage } from '@/service/request/utils'
import useAuthStore from '@/store/modules/auth'
import { getServicePrefixOrUrl } from '@/utils/env'

const service = new NormAxios<Result>({
  baseURL: getServicePrefixOrUrl('BASE'),
  timeout: ServiceConstant.REQUEST_TIMEOUT,
  interceptor: {
    onBeforeRequest(config) {
      if (config.headers)
        config.headers.token = 1
    },
    async onResponse(response) {
      const { code, msg, result } = response.data
      // 响应内容
      const responseContent: ResponseContent<Result, typeof result> = [result, undefined, response]
      // 是否取消消息提示
      const isCancelMessagePrompt = response.config.isCancelMessagePrompt
      // 处理响应错误
      if (ServiceConstant.SUCCESS_CODE !== code) {
        // 错误的响应内容
        responseContent[1] = { code, msg }

        // 是否退出登录
        const isLogOut = Object.keys(ServiceConstant.SIGN_OUT_CODE).some(key => Number(key) === code)
        if (isLogOut) {
          const authStore = useAuthStore()
          // 退出登录
          await authStore.signOut()
          !isCancelMessagePrompt && showMessage(ServiceConstant.SIGN_OUT_CODE[code], 'warning')
        }
        else
          !isCancelMessagePrompt && showMessage(ServiceConstant.STATUS_ERROR[code] || msg || MessageConstant.SERVER_ERROR)
      }
      return responseContent
    },
    onResponseError(err) {
      let errorMsg: string = MessageConstant.SERVER_ERROR
      const responseContent: ResponseContent = [undefined, undefined, err.response]
      // 处理响应后的错误
      if (err.response) {
        // 请求已发出，但服务器响应的状态码错误
        const msg = ServiceConstant.STATUS_ERROR[err.response.status]
        if (msg) errorMsg = msg
        responseContent[1] = { code: err.response.status, msg: errorMsg }
      }
      else {
        // 处理请求时的错误
        const msg = ServiceConstant.AXIOS_REQUEST_ERROR[err.code as string]
        if (msg) errorMsg = msg
        responseContent[1] = { code: err.code as string, msg: errorMsg, axiosError: err }
      }
      showMessage(errorMsg)

      return responseContent
    },
  },
})

export default service
