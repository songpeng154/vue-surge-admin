import type { UserProfileView } from '#/openapi-types.ts'
import service from '@/service/request'
/**
 * 个人信息相关 Api
 */
const profileApi = {
  /**
   * 获取当前用户信息
   */
  getDetail: () =>
    service.get<UserProfileView>('/profile/me'),
}

export default profileApi
