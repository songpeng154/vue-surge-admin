import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import RouterConstant from '@/constant/router'
import router from '@/router'
import { tokenCache } from '@/store/caches'
import useAuthStore from '@/store/modules/auth'
import useTabBarStore from '@/store/modules/tab-bar'
import RegUtils from '@/utils/reg'

export default async function createAuthGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
): Promise<boolean | RouteLocationRaw> {
  const authStore = useAuthStore()
  const tabBarStore = useTabBarStore()

  // 忽略鉴权直接放行
  if (to.meta?.ignoreAuth)
    return true

  // 初始化路由
  const initRoutes = () => {
    authStore.initRouteAuth()
    tabBarStore.initializeTabBar(authStore.$state.routes)
  }

  // 未登录
  if (!authStore.isLogin) {
    console.info('---未登录，强制跳转到登录页---')
    return to.path.startsWith(RouterConstant.AUTH_ROUTE) ? true : { path: RouterConstant.LOGIN_PATH, query: { redirect: to.fullPath } }
  }

  // 令牌失效 (登录状态下获取不到 token)
  if (!tokenCache.get()) {
    window.$message?.warning('令牌已失效，请重新登录！')
    authStore.initAuthStore()
    return { path: RouterConstant.LOGIN_PATH, query: { redirect: to.fullPath } }
  }

  // 没有鉴权（没有用户信息和角色）
  if (!authStore.isAuth) {
    await authStore.getProfileMe().catch(() => false)
    if (!authStore.isAuth)
      return { path: RouterConstant.LOGIN_PATH }
    initRoutes()
    return { ...to, replace: true }
  }

  // 没有生成路由
  if (!authStore.isGeneratedRoutes) {
    initRoutes()
    return { ...to, replace: true }
  }

  // 登录情况下不能到登录页面
  if (to.path.startsWith(RouterConstant.AUTH_ROUTE))
    return from.path === to.path ? { path: authStore.homePath } : { path: from.fullPath }

  // 打开外链
  if (RegUtils.MATCH_URL.test(to.path)) {
    window.open(RegUtils.extractUrl(to.path), '_blank')
    return false // [优化]: 在 Vue Router 中返回 false 代表直接取消本次导航，无需额外跳转
  }

  // 禁用菜单
  if (to.meta?.disabledMenu) {
    window.$message?.warning('该菜单已被禁用访问！请联系管理员！')
    return false // 取消本次导航
  }

  // 从登录页跳转到其他页面时，如果目标页面不存在，则跳转到首页
  if (from.path.startsWith(RouterConstant.AUTH_ROUTE) && from.query.redirect) {
    return router.hasRoute(to.name as string)
      ? true
      : { path: authStore.homePath, replace: true }
  }

  // 根路由重定向到首页
  if (to.path === '/')
    return { path: authStore.homePath, replace: true }

  // 全部校验通过，正常放行
  return true
}
