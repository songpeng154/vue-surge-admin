import RouterConstant from '@/constant/router'

// Layout 根路由
export const ROUTE_ROOT: AppRouteRecordRaw = {
  path: '/',
  name: 'root',
  component: 'basic',
}

// 鉴权
export const ROUTE_AUTH: AppRouteRecordRaw = {
  path: RouterConstant.AUTH_ROUTE,
  component: 'view',
  redirect: RouterConstant.LOGIN_PATH,
  children: [
    {
      path: RouterConstant.LOGIN_PATH,
      component: 'view',
      meta: {
        title: '登录',
      },
    },
    {
      path: `${RouterConstant.AUTH_ROUTE}/phoneLogin`,
      component: 'view',
      meta: {
        title: '手机号登录',
      },
    },
    {
      path: `${RouterConstant.AUTH_ROUTE}/qrCodeLogin`,
      component: 'view',
      meta: {
        title: '二维码登录',
      },
    },
    {
      path: `${RouterConstant.AUTH_ROUTE}/register`,
      component: 'view',
      meta: {
        title: '注册',
      },
    },
  ],
}

export const ROUTE_SCHEMA_FORM_BUG_REPRO: AppRouteRecordRaw = {
  path: '/schema-form-bug-repro',
  component: 'basic-view',
  meta: {
    title: 'Schema Form Bug Repro',
    ignoreAuth: true,
    hideMenu: true,
  },
}

// 未匹配到页面
export const ROUTE_NOT_FOUND: AppRouteRecordRaw = {
  path: '/:NotFound(.*)*',
  component: () => import('@/views/404/index.vue'),
  meta: { title: RouterConstant.NOT_FOUND_TITLE },
}

export default [ROUTE_ROOT, ROUTE_AUTH, ROUTE_SCHEMA_FORM_BUG_REPRO, ROUTE_NOT_FOUND]
