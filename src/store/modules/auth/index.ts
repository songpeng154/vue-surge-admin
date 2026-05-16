import type { AccountLoginDto, PermissionSelfView } from '#/openapi-types.ts'
import type { AuthStore } from '@/store/modules/auth/type'
import { cloneDeep } from 'es-toolkit'
import { defineStore } from 'pinia'
import RouterConstant from '@/constant/router'
import ServiceConstant from '@/constant/service'
import router from '@/router'
import { RouterUtils } from '@/router/utils.ts'
import authApi from '@/service/api/auth.ts'
import profileApi from '@/service/api/profile.ts'
import { tokenCache } from '@/store/caches'

const initAuth: AuthStore = {
  token: tokenCache.get(),
  roles: [],
  permissions: [],
  userinfo: null,
  isGeneratedRoutes: false,
  routes: [],
  homePath: '/',
}

const useAuthStore = defineStore('Auth', () => {
  const auth = reactive<AuthStore>(cloneDeep(initAuth))
  let rawMenus: PermissionSelfView[] = []

  const authRefs = toRefs(auth)

  // 是否登录
  const isLogin = computed(() => Boolean(auth.token))
  // 是否有鉴权
  const isAuth = computed(() => Boolean(auth.roles.length) && Boolean(auth.userinfo))

  // 设置 Token
  const setToken = (token: string) => {
    auth.token = token
    tokenCache.set(token, ServiceConstant.TOKEN_EXPIRATION_TIME)
  }

  // 删除 Token
  const removeToken = () => {
    auth.token = null
    tokenCache.remove()
  }

  // 初始化
  const initAuthStore = () => {
    Object.assign(auth, cloneDeep(initAuth))
    removeToken()
  }

  // 获取用户信息
  const getProfileMe = async () => {
    const result = await profileApi.getProfileMe().catch(() => {
      initAuthStore()
      throw new Error('用户信息获取失败')
    })

    auth.roles = result.roles
    auth.permissions = result.permissions
    rawMenus = result.menus
    auth.userinfo = result.user
  }

  // 处理登录后
  const handleLoginAfter = async () => {
    // 获取用户信息
    await getProfileMe()
    const path = router.currentRoute.value.query.redirect as string || '/'
    // 重定向路径
    await router.replace(path)
    window.$notification.info({
      title: '登录成功',
      content: `欢迎回来，${auth.userinfo?.nickname}！`,
    })
  }

  // 账号密码登录
  const loginByAccount = async (form: AccountLoginDto) => {
    const token = await authApi.loginByAccount(form)
    setToken(token)
    await handleLoginAfter()
  }

  // 退出登录
  const signOut = async () => {
    await authApi.signOut()
    removeToken()
    await router.push(RouterConstant.LOGIN_PATH)
    initAuthStore()
  }

  // 初始化路由权限
  const initRouteAuth = () => {
    auth.routes = RouterUtils.permissionsToRoutes(rawMenus)
    const vueRoutes = RouterUtils.transformCustomRoutesToVueRoutes(auth.routes)
    vueRoutes.forEach(route => router.addRoute(route))
    // 计算首页路径
    const allRoutes = auth.routes.flatMap(r => [r, ...(r.children ?? [])])
    const rootPages = allRoutes.filter(r => r.meta?.rootPage)
    if (rootPages.length > 1)
      console.warn(`[Router] 存在多个 rootPage 标记的路由: ${rootPages.map(r => r.path).join(', ')}，将使用: ${rootPages[0].path}`)
    const rootRoute = rootPages[0] ?? auth.routes[0]
    auth.homePath = rootRoute?.path || '/'
    auth.isGeneratedRoutes = true
  }

  return {
    ...authRefs,
    isLogin,
    isAuth,
    initAuthStore,
    getProfileMe,
    loginByAccount,
    signOut,
    handleLoginAfter,
    initRouteAuth,
  }
})
export default useAuthStore
