/**
 * 业务错误类
 * 用于包装 HTTP 响应中的业务错误，保留错误堆栈追踪
 */
export class BusinessError extends Error {
  code: number
  msg: string

  constructor(code: number, msg: string) {
    super(msg)
    this.code = code
    this.msg = msg
    this.name = 'BusinessError'

    // 保持正确的原型链（兼容 TypeScript 编译到 ES5）
    Object.setPrototypeOf(this, BusinessError.prototype)
  }
}
