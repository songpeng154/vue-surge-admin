import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import { rSuccess } from './utils'

export default defineFakeRoute([
  {
    url: '/passwordLogin',
    method: 'post',
    timeout: 1000,
    statusCode: 200,
    response: () => {
      return rSuccess({
        token: 'xx',
      })
    },
  },
  {
    url: '/getUserinfo',
    method: 'get',
    // statusCode: 500,
    response: () => {
      return rSuccess({
        // 权限
        permissions: [],
        // 角色
        roles: ['Super'],
        // 用户信息
        userinfo: {
          userId: 1,
          // 用户名
          username: 'admin',
          // 头像
          avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkfVMhgRPHf9mSpyfVGvJTX2-UP9B-5xFsyg&usqp=CAU',
        },
      })
    },
  },
  {
    url: '/signOut',
    method: 'get',
    response: () => {
      return rSuccess(null)
    },
  },
  {
    url: '/getRoutes',
    method: 'get',
    response: () => {
      return rSuccess([
        {
          path: '/home',
          component: 'basic-view',
          meta: {
            title: '首页',
            icon: 'ant-design:area-chart-outlined',
            affixTab: true,
            order: 1,
          },
        },
      ])
    },
  },
])
