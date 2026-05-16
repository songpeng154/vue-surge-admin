import type { UserProfileView } from '#/openapi-types.ts'
import service from '@/service/request'

const profileApi = {
  // getUs
  getProfileMe: () =>
    service.get<UserProfileView>('/profile/me'),
}

export default profileApi
