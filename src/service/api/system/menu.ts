import type { PermissionTreeView, PermissionView, UserSaveDto, UserView } from '#/openapi-types.ts'
import service from '@/service/request'

/**
 * 系统菜单相关 Api
 */
const sysMenuApi = {
  /**
   * 获取系统全部菜单树
   */
  getTree: () =>
    service.get<PermissionTreeView[]>('/system/permission/tree'),
  /**
   * 获取系统全部菜单树
   */
  getList: () =>
    service.get<PermissionView[]>('/system/permission'),

  /**
   * 获取系统菜单详情
   */
  getDetail: (id: number) =>
    service.get<UserView>(`/system/permission/${id}`),

  /**
   * 创建系统菜单
   */
  create: (data: UserSaveDto) =>
    service.post('/system/permission', data),

  /**
   * 更新系统菜单
   */
  update: (id: number, data: UserSaveDto) =>
    service.put(`/system/permission/${id}`, data),

  /**
   * 删除系统菜单
   */
  delete: (id: number) =>
    service.delete(`/system/permission/${id}`),
}

export default sysMenuApi
