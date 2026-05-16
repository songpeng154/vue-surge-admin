import type { RoleEnum } from '@/enums/auth'
import 'vue-router'

declare module 'vue-router' {
  // 路由元数据
  interface RouteMeta {
    // 名称
    title?: string

    // 细粒度权限
    permissions?: string[]

    // 角色
    roles?: RoleEnum[]

    // 忽略鉴权，用户可以直接访问
    ignoreAuth?: boolean

    // 是否缓存 (对iframeSrc无效、菜单以外的路由无效，比如：登录、注册路由)
    keepAlive?: boolean

    // 是否固定在tab上
    affixTab?: boolean

    // 图标,使用方式: icon: 'ant-design:copyright-circle-filled'
    icon?: string

    // 内部嵌套地址
    iframeSrc?: string

    // 是否自定义内嵌组件
    isCustomizeIframeComponent?: boolean

    // 菜单排序
    order?: number

    // 隐藏菜单 (可以通过路由访问)
    hideMenu?: boolean

    // 禁用菜单 (不能通过路由访问)
    disabledMenu?: boolean

    // 是否为根页面（首页入口）
    rootPage?: boolean
  }
}
