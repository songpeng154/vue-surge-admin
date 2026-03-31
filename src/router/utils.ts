// 需要权限的路由模块列表
import type { RouteRecordRaw } from 'vue-router'
import type { RoleEnum } from '@/enums/auth.ts'
import RouterConstant from '@/constant/router.ts'
import { Sort } from '@/enums/common.ts'
import { pathToPascalCase } from '@/utils'
import RegUtils from '@/utils/reg.ts'

// 路由工具
export class RouterUtils {
  // 前端路由模块列表
  static readonly ROUTER_MODULES_LIST = import.meta.glob('./modules/**.ts', { eager: true })

  // 静态路由模块
  static STATIC_ROUTES = import.meta.glob('./routes/**.ts', { eager: true })

  // 页面组件
  static readonly VIEW_COMPONENTS = import.meta.glob('@/views/**/**.vue')

  // 默认内嵌页面
  static readonly DEFAULT_FRAME = () => import('@/layout/components/default-iframe.vue')

  // 404组件
  static readonly NOT_FOUND = () => import('@/views/404/index.vue')

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

  // 前端路由列表
  static getRouteList() {
    return Object.keys(this.ROUTER_MODULES_LIST).reduce<AppRouteRecordRaw[]>((routerModules, routerKey) => {
      const router = (this.ROUTER_MODULES_LIST[routerKey] as any).default
      if (!(router instanceof Object))
        return routerModules
      routerModules.push(router)
      return routerModules
    }, [])
  }

  // 获取用户路由
  static getUserRouteList(roles: RoleEnum[]) {
    // 不需要授权
    const noNeedAuth = (route: AppRouteRecordRaw) => !route.meta?.roles?.length

    // 已授权
    const hasAuth = (route: AppRouteRecordRaw) => route.meta?.roles?.some(role => roles.includes(role))

    const getFrontRoute = (routeList: AppRouteRecordRaw[]) => routeList.reduce<AppRouteRecordRaw[]>((userRoute, route) => {
      // PUSH 权限路由
      const pushAuthRoute = () => {
        const cRoute = { ...route }
        userRoute.push(cRoute)

        if (cRoute.children?.length) {
          cRoute.children = getFrontRoute(cRoute.children)
          // 排序 升序
          this.sortRoutes(cRoute.children, Sort.Ascending)
        }

        return userRoute
      }
      if (noNeedAuth(route) || hasAuth(route))
        return pushAuthRoute()
      return userRoute
    }, [])
    const userRoutes = getFrontRoute(this.getRouteList())
    // 排序 升序
    this.sortRoutes(userRoutes, Sort.Ascending)
    return userRoutes
  }

  // 获取页面组件
  static getViewComponent(route: AppRouteRecordRaw) {
    // 内嵌链接存在&不自定义内嵌iframe组件
    if (route.meta?.iframeSrc && !route.meta?.isCustomizeIframeComponent)
      return this.DEFAULT_FRAME
    // 原始路径，不包含路径参数
    const recordPath = RegUtils.removePathParams(route.path)
    // 组件路径
    const componentPath = `/src/views${recordPath}/index.vue`
    const viewComponent = Object.keys(this.VIEW_COMPONENTS).find(path => path === componentPath)
    if (!viewComponent) {
      console.error('未找到与路由对应的页面组件：', componentPath)
      return this.NOT_FOUND
    }

    const component = this.VIEW_COMPONENTS[viewComponent]

    return () => component().then((res: any) => {
      return ({
        ...res.default,
        // 动态设置组件name，于路由name对应上,用于菜单缓存
        name: pathToPascalCase(recordPath),
      })
    })
  }

  // 自定义路由转 vue 路由
  static transformCustomRouteToVueRoute(route: AppRouteRecordRaw) {
    // 如果是外链就不转vue路由
    if (RegUtils.MATCH_URL.test(route.path))
      return undefined
    let vueRoute = { ...route } as RouteRecordRaw
    // 原始路径，不包含路径参数
    const recordPath = RegUtils.removePathParams(route.path)
    // 用于菜单缓存
    vueRoute.name = pathToPascalCase(recordPath)
    route.name = pathToPascalCase(recordPath)
    switch (route.component) {
      case 'view':
        vueRoute.component = this.getViewComponent(route)
        break
      case 'basic-view':
        // 一级路由转二级路由
        vueRoute = {
          path: recordPath + RouterConstant.CONTAINER_SUFFIX,
          name: recordPath + RouterConstant.CONTAINER_SUFFIX,
          redirect: route.path,
          component: () => import('@/layout/index.vue'),
          children: [
            {
              ...route,
              component: this.getViewComponent(route),
            } as RouteRecordRaw,
          ],
        }
        break
      case 'basic':
        // 访问目录路由 自动重定向到目录下的第一个子菜单
        if (!vueRoute.redirect && vueRoute.children?.length)
          vueRoute.redirect = vueRoute.children[0].path

        vueRoute.component = () => import('@/layout/index.vue')
        break
    }
    return vueRoute
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
}
