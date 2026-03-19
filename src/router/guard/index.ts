import type { Router } from 'vue-router'
import { useTitle } from '@vueuse/core'
import createAuthGuard from '@/router/guard/auth.ts'
import createBaseGuard from '@/router/guard/base.ts'
import useAppStore from '@/store/modules/app'

function createRouterGuard(router: Router) {
  router.beforeEach(createBaseGuard)
  router.beforeEach(createAuthGuard)

  // 跳转之后
  router.afterEach((to) => {
    const appStore = useAppStore()
    useTitle(to.meta.title)
    appStore.isSmallScreen && appStore.toggleMobileSidebarVisible(false)
    window.$loadingBar?.finish()
  })
}
export default createRouterGuard
