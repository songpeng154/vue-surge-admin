import type { AccountLoginDto } from '#/openapi-types.ts'
import service from '@/service/request'

/**
 * 账号登录
 */
export function loginByAccount(data: AccountLoginDto) {
  return service.post<string>('/auth/login/account', data)
}
