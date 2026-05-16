import type { UserProfileView } from '#/openapi-types.ts'

export interface AuthStore {
  token: Nullable<string>

  // 角色
  roles: UserProfileView['roles']

  // 细粒度权限
  permissions: string[]

  // 用户信息
  userinfo: Nullable<UserProfileView['user']>

  // 是否已生成路由
  isGeneratedRoutes: boolean

  // 用户的路由
  routes: AppRouteRecordRaw[]

  // 首页路径
  homePath: string
}
