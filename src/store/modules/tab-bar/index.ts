import type { RouteRecordNameGeneric } from 'vue-router'
import type { Tab, TabBarStore } from '@/store/modules/tab-bar/type'
import { pick } from 'es-toolkit'
import { defineStore } from 'pinia'
import RouterConstant from '@/constant/router'
import router from '@/router'
import useAppStore from '@/store/modules/app'
import { asyncWait } from '@/utils'

const useTabBarStore = defineStore('TabBar', () => {
  const route = useRoute()

  const blacklist = [RouterConstant.NOT_FOUND_TITLE]

  const tabBar = reactive<TabBarStore>({
    // 标签栏
    tabs: [],
    // 刷新标志
    refreshFlag: true,
    // 刷新等待时间
    refreshWaitDuration: 400,
  })
  const tabBarRefs = toRefs(tabBar)

  // 当前激活的index
  const activeIndex = computed(() => tabBar.tabs.findIndex(item => item.path === route.path))

  // 当前激活的tab
  const activeTab = computed(() => tabBar.tabs[activeIndex.value])

  // 缓存菜单
  const cacheMenus = computed(() => tabBar.tabs.reduce<RouteRecordNameGeneric[]>((cacheMenus, item) => {
    item.meta.keepAlive && cacheMenus.push(item.name)
    return cacheMenus
  }, []))

  // 是否激活
  const isActive = (path: string) => route.path === path

  // 是否存在
  const isExist = (path: string) => tabBar.tabs.some(item => item.path === path)

  // 获取 index
  const getIndex = (path: string) => tabBar.tabs.findIndex(item => item.path === path)

  // 获取当前Tabs的固定标签
  const getCurrentTabsAffixTab = (index?: number, direction?: 'left' | 'right'): Tab[] => {
    return tabBar.tabs.filter((item, i) => {
      let boundary = true
      if (index !== undefined && direction)
        boundary = direction === 'left' ? i < index : i > index

      return item.meta?.affixTab && boundary
    })
  }

  // 添加 tabBar
  const addTab = (tab: Tab) => {
    if (blacklist.every(item => item === tab.meta.title))
      return

    // 存在就替换，不存在就push
    isExist(tab.path)
      ? tabBar.tabs.splice(getIndex(tab.path), 1, tab)
      : tabBar.tabs.push(tab)
  }

  // 关闭
  const closeTab = (tab: Tab) => {
    if (tabBar.tabs.length === 1)
      return
    const index = getIndex(tab.path)
    tabBar.tabs.splice(index, 1)
    isActive(tab.path) && router.push(tabBar.tabs.at(-1).path)
  }

  // 刷新当前激活的路由
  const refresh = async () => {
    const appStore = useAppStore()
    appStore.toggleFullScreenLoading(true)
    tabBar.refreshFlag = false
    await asyncWait(tabBar.refreshWaitDuration)
    tabBar.refreshFlag = true
    appStore.toggleFullScreenLoading(false)
  }

  // 关闭左侧
  const closeLeft = (path: string) => {
    const index = getIndex(path)
    if (index === 0 || index === -1)
      return
    index > activeIndex.value && router.push(path)
    const tabs = tabBar.tabs.slice(index)
    tabBar.tabs = [...getCurrentTabsAffixTab(index, 'left'), ...tabs]
  }

  // 关闭右侧
  const closeRight = (path: string) => {
    const index = getIndex(path)
    if (index === tabBar.tabs.length - 1 || index === -1)
      return
    index < activeIndex.value && router.push(path)
    const tabs = tabBar.tabs.slice(0, index + 1)
    tabBar.tabs = [...tabs, ...getCurrentTabsAffixTab(index, 'right')]
  }

  // 关闭其他
  const closeOther = (path: string) => {
    const i = getIndex(path)
    if (i === -1)
      return
    i !== activeIndex.value && router.push(path)
    const tabs = [...getCurrentTabsAffixTab()]
    const tab = tabBar.tabs[i]
    if (!tab.meta?.affixTab)
      tabs.push(tab)
    tabBar.tabs = tabs
  }

  // 关闭全部
  const closeAll = () => {
    tabBar.tabs = [...getCurrentTabsAffixTab()]
    // 重定向到首页
    void router.push(RouterConstant.HOME_PATH)
  }

  // 获取路由中的固定标签
  const getRouterAffixTabs = (routes: AppRouteRecordRaw[]): Tab[] => {
    return routes.reduce<Tab[]>((tabs, { path, name, meta, children }) => {
      meta?.affixTab && tabs.push({ fullPath: path, name, meta, path })
      children?.length && tabs.push(...getRouterAffixTabs(children))
      return tabs
    }, [])
  }

  // 初始化标签栏
  const initializeTabBar = (routes: AppRouteRecordRaw[]) => {
    // 初始化固定标签
    tabBar.tabs = [...getRouterAffixTabs(routes)]
  }

  // 监听路由变化
  watch(() => route.fullPath, () => {
    addTab(pick(route, ['meta', 'path', 'name', 'fullPath']))
  }, { immediate: true })

  return {
    ...tabBarRefs,
    activeTab,
    activeIndex,
    cacheMenus,
    isActive,
    isExist,
    getIndex,
    addTab,
    closeTab,
    refresh,
    closeLeft,
    closeRight,
    closeOther,
    closeAll,
    getCurrentTabsAffixTab,
    getRouterAffixTabs,
    initializeTabBar,
  }
})

export default useTabBarStore
