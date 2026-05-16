import type { AccountLoginDto } from '#/openapi-types.ts'
import service from '@/service/request'

const authApi = {
  /**
   * 账号登录
   * @return {string} token
   */
  loginByAccount: (data: AccountLoginDto) =>
    service.post<string>('/auth/login/account', data),

  /**
   * 退出登录
   */
  signOut: () => service.post('/auth/logout'),
}

export default authApi
