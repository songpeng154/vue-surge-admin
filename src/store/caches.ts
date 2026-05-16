import type { MenuSearchOption } from '@/layout/components/header/components/menu-search/components/menu-search-modal.vue'
import type { AppStore } from '@/store/modules/app/type'
import { createCache } from '@/utils/cache'

// Token缓存
export const tokenCache = createCache<string>('SURGE_TOKEN', 'cookie')
// 记住我缓存
export const rememberMeCache = createCache<boolean>('SURGE_REMEMBER_ME', 'cookie')

// App配置缓存
export const appCache = createCache<AppStore>('SURGE_APP')

// 菜单搜索缓存
export const menuSearchCache = createCache<MenuSearchOption[]>('SURGE_MENU_SEARCH')
