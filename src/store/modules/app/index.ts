import type { GlobalThemeOverrides } from 'naive-ui'
import type { AppStore } from '@/store/modules/app/type'
import { generate } from '@ant-design/colors'
import { cloneDeep, merge } from 'es-toolkit'
import { darkTheme, lightTheme, useOsTheme } from 'naive-ui'
import { defineStore } from 'pinia'
import AppConstant from '@/constant/app'
import breakpoint from '@/hooks/common/breakpoint.ts'
import { appCache } from '@/store/caches'
import { setCSSVariables, temporaryClearTransition, toKebabCase } from '@/utils'

// 初始APP STORE
export const initialAppStore: AppStore = {
  // 主题颜色
  themeColor: AppConstant.PRIMARY_COLOR,
  // 主题模式
  themeMode: 'light',
  // 主题模式跟随系统
  themeModeFollowingSystem: true,
  // 是否开启页面切换动画
  isPageStartAnimation: true,
  // 页面动画
  pageAnimationMode: 'zoom-fade',
  // 布局模式
  layoutMode: 'side',
  // 布局风格
  layoutStyle: 'side-dark',
  // 全屏loading
  fullScreenLoading: false,
  // 是否折叠侧边栏
  isCollapsedSidebar: false,
  // 是否折叠混合侧边栏
  isCollapsedMixSidebar: false,
  // 是否固定混合侧边栏
  isFixedMixSidebarDrawer: false,
  // 混合侧边栏抽屉是否可见
  mixSidebarDrawerVisible: false,
  // 菜单是否开启手风琴模式
  isMenuAccordion: true,
  // 移动端 menu 可见
  mobileSidebarVisible: false,
  // 侧边栏宽度
  sidebarWidth: 240,
  // 混合侧边栏宽度
  mixSidebarWidth: 94,
  // 折叠侧边栏的宽度
  collapsedSidebarWidth: 56,
  // 是否开启面包屑
  breadcrumbVisible: true,
  // 标签栏可见
  tabBarVisible: true,
  // 头部高度
  headerHeight: 56,
  // 标签栏高度
  tabBarHeight: 44,
  footerVisible: true,
  footerHeight: 40,
}

const useAppStore = defineStore('App', () => {
  const osTheme = useOsTheme()
  const { smaller } = breakpoint()

  const appStore = reactive<AppStore>(appCache.get() || cloneDeep(initialAppStore))
  const appStoreRefs = toRefs(appStore)
  const themeOverrides = ref<GlobalThemeOverrides>()

  // 是否暗黑模式
  const isDark = computed(() => appStore.themeMode === 'dark')
  // 是否明亮模式
  const isLight = computed(() => !isDark.value)
  // 是否反转侧边栏
  const isInvertedSidebar = computed(() => (appStore.layoutStyle === 'side-dark' || appStore.layoutStyle === 'side-top-dark') && isLight.value)
  // 是否反转头部
  const isInvertedHeader = computed(() => appStore.layoutStyle === 'side-top-dark' && isLight.value)
  // 动态侧边栏宽度
  const dynamicSidebarWidth = computed(() => appStore.isCollapsedSidebar ? appStore.collapsedSidebarWidth : appStore.sidebarWidth)
  // 动态混合侧边栏宽度
  const dynamicMixSidebarWidth = computed(() => appStore.isCollapsedMixSidebar ? appStore.collapsedSidebarWidth : appStore.mixSidebarWidth)
  // naive主题
  const naiveTheme = computed(() => isLight.value ? lightTheme : darkTheme)
  // 主题色色板
  const primaryColorsPalette = computed(() => generate(appStore.themeColor, {
    theme: isDark.value ? 'dark' : 'default',
  }))
  // 是否小屏幕
  const isSmallScreen = computed(() => smaller('sm').value)

  // 切换Sidebar折叠
  const toggleSidebarCollapsed = (isCollapsed?: boolean) => {
    appStore.isCollapsedSidebar = isCollapsed ?? !appStore.isCollapsedSidebar
  }

  // 切换移动端Sidebar可见
  const toggleMobileSidebarVisible = (isVisible?: boolean) => {
    appStore.mobileSidebarVisible = isVisible ?? !appStore.mobileSidebarVisible
  }

  // 切换混合Sidebar折叠
  const toggleMixSidebarCollapsed = (isCollapsed?: boolean) => {
    appStore.isCollapsedMixSidebar = isCollapsed ?? !appStore.isCollapsedMixSidebar
  }

  // 切换混合SidebarDrawer可见
  const toggleMixSidebarDrawerVisible = (isVisible?: boolean) => {
    appStore.mixSidebarDrawerVisible = isVisible ?? !appStore.mixSidebarDrawerVisible
  }

  // 切换混合SidebarDrawer可见
  const toggleFixedMixSidebarDrawer = (isFixedMix?: boolean) => {
    appStore.isFixedMixSidebarDrawer = isFixedMix ?? !appStore.isFixedMixSidebarDrawer
  }

  // 切换全屏loading
  const toggleFullScreenLoading = (isShow?: boolean) => {
    appStore.fullScreenLoading = isShow ?? !appStore.fullScreenLoading
  }

  // 生成主题css变量
  const generateThemeCSSVariables = (theme: Theme & NeutralTheme) => {
    Object.keys(theme).forEach((key) => {
      const variable = Object.keys(theme[key]).reduce((obj, item) => {
        obj[`${toKebabCase(key)}-${item}`] = theme[key][item]
        return obj
      }, {})
      setCSSVariables(variable)
    })
  }

  // 生成色板CSS变量
  const generatePaletteCSSVariables = (name: string, colors: string[]) => {
    const variable = colors.reduce((obj, item, i) => {
      obj[`${name}-${i}`] = item
      return obj
    }, {})
    setCSSVariables(variable)
  }

  // 适配 Naive 主题
  const adaptNaiveTheme = (gradientTheme: string[], {
    backgroundColor,
    textColor,
    borderColor,
    borderRadius,
    textSize,
  }: Theme & NeutralTheme) => {
    const naiveThemeOverride: GlobalThemeOverrides = {
      common: {
        /* 主题色 */
        primaryColor: gradientTheme[5],
        primaryColorHover: gradientTheme[4],
        primaryColorPressed: gradientTheme[5],
        primaryColorSuppl: gradientTheme[6],
        /* 文字颜色 */
        textColor1: textColor?.base,
        textColor2: textColor?.secondary,
        textColor3: textColor?.tertiary,
        textColorDisabled: textColor?.disabled,
        /* 背景颜色 */
        bodyColor: backgroundColor?.layout,
        cardColor: backgroundColor?.container,
        modalColor: backgroundColor?.layer,
        invertedColor: backgroundColor?.inverted,
        popoverColor: backgroundColor?.layer,
        /* 边框颜色 */
        borderColor: borderColor?.base,
        /* 字体大小 */
        fontSize: textSize?.md,
        fontSizeMini: textSize?.sm,
        fontSizeTiny: textSize?.sm,
        fontSizeSmall: textSize?.sm,
        fontSizeLarge: textSize?.lg,
        fontSizeHuge: textSize?.lg,
        /* 边框圆角 */
        borderRadius: borderRadius?.md,
        borderRadiusSmall: borderRadius?.sm,
      },
      Layout: {
        textColorInverted: textColor?.inverted,
        siderBorderColorInverted: borderColor?.inverted,
        headerBorderColorInverted: borderColor?.inverted,
      },
      Button: {},
    }
    themeOverrides.value = merge(naiveThemeOverride, AppConstant.NAIVE_THEME_CONFIG[appStore.themeMode])
  }

  // 更新主题
  const updateTheme = () => {
    // 中性主题
    const neuterTheme = AppConstant.THEME_MODE_CONFIG[appStore.themeMode]
    // 合并主题
    const mergeTheme = merge(AppConstant.THEME, neuterTheme)

    // 生成主题色CSS变量
    generatePaletteCSSVariables('primary', primaryColorsPalette.value)
    // 生成主题CSS变量
    generateThemeCSSVariables(mergeTheme)
    // 适配 Naive 主题
    adaptNaiveTheme(primaryColorsPalette.value, mergeTheme)
  }

  // 设置主题颜色
  const setThemeColor = (color: string) => {
    appStore.themeColor = color
    temporaryClearTransition(updateTheme)
  }

  // 切换主题模式
  const toggleThemeMode = (mode: ThemeMode = appStore.themeMode === 'light' ? 'dark' : 'light', clearTransition: boolean = true) => {
    appStore.themeMode = mode
    document.documentElement.classList.toggle('dark')
    clearTransition ? temporaryClearTransition(updateTheme) : updateTheme()
  }

  const toggleThemeModeTransition = async (event: MouseEvent, mode?: ThemeMode) => {
    await nextTick()

    // 检查浏览器是否支持 View Transition API
    if (!document.startViewTransition) return toggleThemeMode(mode)

    // 使用 View Transition API 切换主题模式
    const transition = document.startViewTransition(() => {
      toggleThemeMode(mode, false)
    })

    transition.ready.then(() => {
      const { clientX, clientY } = event

      const endRadius = Math.hypot(Math.max(clientX, innerWidth - clientX), Math.max(clientY, innerHeight - clientY))

      const clipPath = [`circle(0px at ${clientX}px ${clientY}px)`, `circle(${endRadius}px at ${clientX}px ${clientY}px)`]

      const isDark = document.documentElement.classList.contains('dark')

      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 450,
          easing: 'ease-in',
          // 防止闪烁
          fill: 'both',
          pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
        },
      )
    })
  }

  // 切换主题模式跟随系统
  const toggleThemeModeFollowingSystem = (isFollow?: boolean) => {
    appStore.themeModeFollowingSystem = isFollow ?? !appStore.themeModeFollowingSystem
    // 开启跟随系统后，设置主题模式
    if (appStore.themeModeFollowingSystem)
      toggleThemeMode(osTheme.value as ThemeMode)
  }

  // 初始化主题
  const initTheme = () => {
    appStore.themeModeFollowingSystem
      ? toggleThemeMode(osTheme.value as ThemeMode)
      : toggleThemeMode(appStore.themeMode)
  }

  return {
    ...appStoreRefs,
    isDark,
    isLight,
    isInvertedSidebar,
    isInvertedHeader,
    dynamicSidebarWidth,
    dynamicMixSidebarWidth,
    naiveTheme,
    themeOverrides,
    primaryColorsPalette,
    isSmallScreen,
    setThemeColor,
    toggleThemeMode,
    toggleThemeModeTransition,
    toggleThemeModeFollowingSystem,
    toggleSidebarCollapsed,
    toggleMobileSidebarVisible,
    toggleMixSidebarCollapsed,
    toggleMixSidebarDrawerVisible,
    toggleFixedMixSidebarDrawer,
    toggleFullScreenLoading,
    initTheme,
  }
})

export default useAppStore
