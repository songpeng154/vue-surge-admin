import type { RouteLocationRaw } from 'vue-router'
import useAppStore from '@/store/modules/app'

async function createBaseGuard(): Promise<boolean | RouteLocationRaw> {
  const appStore = useAppStore()
  window.$loadingBar?.start()
  // 跳转之前取消全局loading
  appStore.toggleFullScreenLoading(false)

  return true
}

export default createBaseGuard
