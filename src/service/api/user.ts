import type { PageResultUserSelfView, UserSaveDto, UserSelfView, UserSpec } from '#/openapi-types.ts'
import service from '@/service/request'

const userApi = {
  /**
   * 获取系统用户列表
   */
  getSysUserPageList: (params: PageParams<UserSpec>, sorts: string) =>
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
    service.get<UserSelfView>(`/system/user/${id}`),

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
   * 删除系统用户
   */
  deleteSysUser: (id: number) =>
    service.delete(`/system/user/${id}`),

}

export default userApi
