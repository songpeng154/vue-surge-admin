// 服务常量
export default class ServiceConstant {
  // token 过期时间 （4小时后过期）
  static TOKEN_EXPIRATION_TIME = new Date(Date.now() + 1000 * 60 * 1000)

  // 接口请求超时时间 （一分钟）
  static REQUEST_TIMEOUT = 60 * 1000

  // 状态错误
  static STATUS_ERROR = {
    400: '400: 请求出现语法错误 ~',
    403: '403: 服务器拒绝访问 ~',
    404: '404: 请求的资源不存在 ~',
    405: '405: 请求方法未允许 ~',
    408: '408: 网络请求超时 ~',
    500: '500: 服务器内部错误 ~',
    501: '501: 服务器未实现请求功能 ~',
    502: '502: 错误网关 ~',
    503: '503: 服务不可用 ~',
    504: '504: 网关超时 ~',
    505: '505: http版本不支持该请求 ~',
  }

  // 成功Code
  static SUCCESS_CODE = 200

  // 需要退出登录的Code
  static SIGN_OUT_CODE = {
    401: '401: 用户未授权 ~',
  }

  // axios请求错误
  static AXIOS_REQUEST_ERROR = {
    ECONNABORTED: '网络请求超时 ~',
    ETIMEDOUT: '网络请求超时 ~',
    ERR_INVALID_URL: '错误的请求地址，请检查URL ~',
    ERR_NOT_SUPPORT: '不支持该操作 ~',
    ERR_BAD_REQUEST: '请求错误 ~',
    ERR_BAD_RESPONSE: '响应错误 ~',
    ERR_DEPRECATED: '已弃用的配置，请检查Axios配置 ~',
    ERR_NETWORK: '网络错误，请检查网络 ~',
    ERR_BAD_OPTION: '错误的选项，请检查Axios配置 ~',
    ERR_BAD_OPTION_VALUE: '错误的选项值，请检查Axios配置 ~',
    ERR_FR_TOO_MANY_REDIRECTS: '重定向过多 ~',
  }

  // 是否关闭重复的错误消息
  static CLOSE_REPEAT_ERROR_MESSAGE = true
}
