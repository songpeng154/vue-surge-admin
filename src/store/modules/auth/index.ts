import type { AuthStore } from '@/store/modules/auth/type'
import { cloneDeep } from 'es-toolkit'
import { defineStore } from 'pinia'
import RouterConstant from '@/constant/router'
import ServiceConstant from '@/constant/service'
import router from '@/router'
import { RouterUtils } from '@/router/utils.ts'
import UserApi from '@/service/api/user'
import { tokenCache } from '@/store/caches'

const initAuth: AuthStore = {
  token: tokenCache.get(),
  // 角色
  roles: [],
  // 细粒度权限
  permissions: [],
  // 用户信息
  userinfo: null,
  // 路由鉴权模式
  routeAuthMode: 'web',
  // 是否已生成路由
  isGeneratedRoutes: false,
  // 用户的路由
  routes: [],
}

const useAuthStore = defineStore('Auth', () => {
  const auth = reactive<AuthStore>(cloneDeep(initAuth))

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
  const getUserinfo = async () => {
    const [result, error] = await UserApi.getUserinfo()
    if (error) {
      initAuthStore()
      return Promise.reject(new Error('用户信息获取失败'))
    }
    auth.roles = result.roles
    auth.permissions = result.permissions
    auth.userinfo = result.userinfo
  }

  // 处理登录后
  const handleLoginAfter = async () => {
    // 获取用户信息
    await getUserinfo()
    // 重定向路径
    await router.replace(RouterConstant.HOME_PATH)
    window.$notification.info({
      title: '登录成功',
      content: `欢迎回来，${auth.userinfo?.username}！`,
    })
  }

  // 密码登录
  const passwordLogin = async (form: UserModel.PasswordLoginParams) => {
    const [result, error] = await UserApi.passwordLogin(form)
    if (error)
      return
    setToken(result.token)
    await handleLoginAfter()
  }

  // 获取用户路由
  const getUserRoutes = async () => {
    const [result, error] = await UserApi.getRoutes()
    if (error) {
      initAuthStore()
      return Promise.reject(new Error('用户路由获取失败'))
    }
    auth.routes = result
  }

  // 退出登录
  const signOut = async () => {
    const data = await UserApi.signOut()
    removeToken()
    await router.push(RouterConstant.LOGIN_PATH)
    initAuthStore()
    return data
  }

  // 初始化前端路由权限
  const initFrontRouteAuth = () => {
    // 获取用户路由
    auth.routes = RouterUtils.getUserRouteList(auth.roles)
    // 自定义路由转Vue路由
    const vueRoutes = RouterUtils.transformCustomRoutesToVueRoutes(auth.routes)
    // 添加路由
    vueRoutes.forEach(route => router.addRoute(route))
    auth.isGeneratedRoutes = true
  }

  // 初始化服务端路由权限
  const initServerRouteAuth = async () => {
    await getUserRoutes()
    // 自定义路由转Vue路由
    const vueRoutes = RouterUtils.transformCustomRoutesToVueRoutes(auth.routes)
    // 添加路由
    vueRoutes.forEach(route => router.addRoute(route))
    auth.isGeneratedRoutes = true
  }

  return {
    ...authRefs,
    isLogin,
    isAuth,
    initAuthStore,
    passwordLogin,
    getUserinfo,
    getUserRoutes,
    signOut,
    handleLoginAfter,
    initFrontRouteAuth,
    initServerRouteAuth,
  }
})
export default useAuthStore
