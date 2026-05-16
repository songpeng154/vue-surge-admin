// 需要权限的路由模块列表
import type { RouteRecordRaw } from 'vue-router'
import type { PermissionSelfView } from '#/openapi-types.ts'
import { PermissionType } from '#/openapi-types.ts'
import RouterConstant from '@/constant/router.ts'
import { Sort } from '@/enums/common.ts'
import { pathToPascalCase } from '@/utils'
import RegUtils from '@/utils/reg.ts'

// 路由工具
export class RouterUtils {
  // 静态路由模块
  static STATIC_ROUTES = import.meta.glob('./routes/**.ts', { eager: true })

  // 页面组件
  static readonly VIEW_COMPONENTS = import.meta.glob('@/views/**/**.vue')

  // 默认内嵌页面
  static readonly DEFAULT_FRAME = () => import('@/layout/components/default-iframe.vue')

  // 404组件
  static readonly NOT_FOUND = () => import('@/views/404/index.vue')

  // 占位组件
  static readonly PLACEHOLDER = () => import('@/views/common/placeholder.vue')

  // 组件工厂函数
  private static readonly COMPONENT_FACTORIES: Record<
    RouteComponentType,
    (route: AppRouteRecordRaw) => (() => Promise<any>)
  > = {
    // 布局组件（目录）
    'basic': () => () => import('@/layout/index.vue'),

    // 页面组件（菜单）
    'view': (route) => {
      // 内嵌链接
      if (route.meta?.iframeSrc && !route.meta?.isCustomizeIframeComponent) {
        return this.DEFAULT_FRAME
      }

      // 原始路径，不包含路径参数
      const recordPath = RegUtils.removePathParams(route.path)
      const componentPath = `/src/views${recordPath}/index.vue`
      const viewComponent = Object.keys(this.VIEW_COMPONENTS).find(path => path === componentPath)

      if (!viewComponent) {
        console.warn(`[Router] 组件不存在: ${componentPath}，使用占位页面`)
        return this.PLACEHOLDER
      }

      const component = this.VIEW_COMPONENTS[viewComponent]
      return () => component().then((res: any) => ({
        ...res.default,
        name: route.name,
      })).catch((error) => {
        console.error(`[Router] 组件加载失败: ${componentPath}`, error)
        return this.PLACEHOLDER().then(res => res.default)
      })
    },

    // 布局 + 页面组件（带布局的菜单）
    'basic-view': (route) => {
      // 复用 view 的逻辑
      return this.COMPONENT_FACTORIES.view(route)
    },
  }

  // 静态路由列表
  static getStaticRoutes() {
    return Object.keys(this.STATIC_ROUTES).reduce<AppRouteRecordRaw[]>((routerModules, routerKey) => {
      const router = (this.STATIC_ROUTES[routerKey] as any).default
      if (!(router instanceof Object))
        return routerModules
      routerModules.push(...router)
      return routerModules
    }, [])
  }

  // 自定义路由转 vue 路由
  static transformCustomRouteToVueRoute(route: AppRouteRecordRaw): RouteRecordRaw | null | undefined {
    // 如果是外链就不转vue路由
    if (RegUtils.MATCH_URL.test(route.path))
      return undefined

    // 如果 component 是函数类型（如 404 路由），直接返回
    if (typeof route.component === 'function') {
      return {
        path: route.path,
        name: route.name || pathToPascalCase(RegUtils.removePathParams(route.path)),
        component: route.component,
        meta: route.meta,
      } as RouteRecordRaw
    }

    const componentType = route.component as RouteComponentType

    // 验证组件类型
    if (!this.COMPONENT_FACTORIES[componentType]) {
      console.error(`[Router] 未知组件类型: ${componentType}, 路由: ${route.path}`)
      return null
    }

    // 原始路径，不包含路径参数
    const recordPath = RegUtils.removePathParams(route.path)
    const routeName = pathToPascalCase(recordPath)

    // 更新原始路由的 name
    route.name = routeName

    // 使用工厂函数创建组件加载器
    const factory = this.COMPONENT_FACTORIES[componentType]

    // 特殊处理不同的组件类型
    switch (componentType) {
      case 'view': {
        return {
          path: route.path,
          name: routeName,
          meta: route.meta,
          component: factory(route),
        }
      }

      case 'basic-view': {
        // 一级路由转二级路由
        return {
          path: recordPath + RouterConstant.CONTAINER_SUFFIX,
          name: routeName + RouterConstant.CONTAINER_SUFFIX,
          redirect: route.path,
          component: () => import('@/layout/index.vue'),
          children: [
            {
              path: route.path,
              name: routeName,
              meta: route.meta,
              component: factory(route),
            },
          ],
        }
      }

      case 'basic': {
        const vueRoute: RouteRecordRaw = {
          path: route.path,
          name: routeName,
          meta: route.meta,
          component: factory(route),
        }
        // 访问目录路由 自动重定向到目录下的第一个子菜单
        if (!route.redirect && route.children?.length) {
          vueRoute.redirect = route.children[0].path as any
        }
        return vueRoute
      }

      default:
        return null
    }
  }

  // 批量自定义路由转 vue 路由
  static transformCustomRoutesToVueRoutes(routes: AppRouteRecordRaw[]) {
    return routes.reduce<RouteRecordRaw[]>((vueRoutes, route) => {
      const vueRoute = this.transformCustomRouteToVueRoute(route)

      if (route.children?.length && vueRoute)
        vueRoute.children = this.transformCustomRoutesToVueRoutes(route.children)

      vueRoute && vueRoutes.push(vueRoute)
      return vueRoutes
    }, [])
  }

  // 排序路由, 默认升序
  static sortRoutes(routes: AppRouteRecordRaw[], type: Sort) {
    routes.sort((a, b) => {
      if (type === Sort.Ascending)
        return Number(a.meta?.order) - Number(b.meta?.order)
      if (type === Sort.Descending)
        return Number(b.meta?.order) - Number(a.meta?.order)
      return 0
    })
  }

  // 后端权限列表转前端路由
  static permissionsToRoutes(permissions: PermissionSelfView[]): AppRouteRecordRaw[] {
    const componentMap: Record<string, RouteComponentType> = {
      [PermissionType.DIRECTORY]: 'basic',
      [PermissionType.MENU]: 'view',
    }

    const toRoute = (item: PermissionSelfView): AppRouteRecordRaw => ({
      path: item.pathParams ? `${item.path}/${item.pathParams}` : (item.path || ''),
      component: componentMap[item.type],
      meta: {
        title: item.name,
        icon: item.icon,
        order: item.sortNum,
        keepAlive: item.keepAlive,
        affixTab: item.affixTab,
        ignoreAuth: item.ignoreAuth,
        iframeSrc: item.iframeSrc,
        isCustomizeIframeComponent: item.customizeIframeComponent,
        hideMenu: item.hideMenu,
        disabledMenu: item.disabledMenu,
        rootPage: item.rootPage,
      },
    })

    const menuItems = permissions.filter(p => p.type !== PermissionType.BUTTON)
    const map = new Map<number, AppRouteRecordRaw>()
    const roots: AppRouteRecordRaw[] = []

    for (const item of menuItems) {
      map.set(item.id, toRoute(item))
    }

    for (const item of menuItems) {
      const route = map.get(item.id)!
      if (item.parentId && map.has(item.parentId)) {
        const parent = map.get(item.parentId)!
        if (!parent.children)
          parent.children = []
        parent.children.push(route)
      }
      else {
        roots.push(route)
      }
    }

    this.sortRoutes(roots, Sort.Ascending)
    for (const route of map.values()) {
      if (route.children?.length) {
        this.sortRoutes(route.children, Sort.Ascending)
      }
    }

    return roots
  }
}
