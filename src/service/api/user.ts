import type { PageResultUserSelfView, UserSaveDto, UserSelfView, UserSpec, UserStatus, UserView } from '#/openapi-types.ts'
import service from '@/service/request'

/**
 * 系统用户相关 Api
 */
const sysUserApi = {
  /**
   * 获取系统用户列表
   */
  getSysUserPage: (params: PageParams<UserSpec>, sorts?: string) =>
    service.get<PageResultUserSelfView[]>('/system/user/page', { params: { ...params, sorts } }),

  /**
   * 获取系统全部用户
   */
  getSysUserList: (params: PageParams<UserSpec>) =>
    service.get<UserSelfView[]>('/system/user', { params }),

  /**
   * 获取系统用户详情
   */
  getSysUser: (id: number) =>
    service.get<UserView>(`/system/user/${id}`),

  /**
   * 获取用户角色code列表
   */
  getUserRoleCodes: (id: number) =>
    service.get<string[]>(`/system/user/${id}/role-codes`),

  /**
   * 创建系统用户
   */
  createSysUser: (data: UserSaveDto) =>
    service.post('/system/user', data),

  /**
   * 更新系统用户
   */
  updateSysUser: (id: number, data: UserSaveDto) =>
    service.put(`/system/user/${id}`, data),

  /**
   * 更新系统用户状态
   */
  updateSysUserStatus: (id: number, status: UserStatus) =>
    service.put(`/system/user/${id}/status`, { status }),

  /**
   * 分配角色
   */
  updateSysUserRoles: (id: number, roleIds: number[]) =>
    service.put(`/system/user/${id}/roles`, { roleIds }),

  /**
   * 删除系统用户
   */
  deleteSysUser: (id: number) =>
    service.delete(`/system/user/${id}`),

}

export default sysUserApi
