export default {
  path: '/function',
  component: 'basic',
  meta: {
    title: '功能',
    icon: 'ant-design:database-outlined',
    order: 3,
  },
  children: [
    {
      path: '/function/menu',
      meta: {
        title: '多级菜单',
      },
      children: [
        {
          path: '/function/menu/menu-1',
          meta: { title: '菜单-1' },
          children: [
            {
              path: '/function/menu/menu-1/menu-1-1',
              component: 'view',
              meta: { title: '菜单-1-1' },
            },
            {
              path: '/function/menu/menu-1/menu-1-2',
              meta: { title: '菜单-1-2' },
              children: [
                {
                  path: '/function/menu/menu-1/menu-1-2/menu-1-2-1',
                  component: 'view',
                  meta: { title: '菜单-1-2-1' },
                },
              ],
            },
          ],
        },
        {
          path: '/function/menu/menu-2',
          meta: { title: '菜单-2' },
          children: [
            {
              path: '/function/menu/menu-2/menu-2-1',
              component: 'view',
              meta: { title: '菜单-2-1' },
            },
          ],
        },
      ],
    },
    {
      path: 'https://songpeng154.github.io/vue-rex/',
      meta: {
        title: 'Vue Rex让请求更简单',
      },
    },
  ],
} satisfies AppRouteRecordRaw
