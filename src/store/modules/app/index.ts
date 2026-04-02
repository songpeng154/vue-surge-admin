import type { GlobalThemeOverrides } from 'naive-ui'
import type { AppStore } from '@/store/modules/app/type'
import { generate } from '@ant-design/colors'
import { cloneDeep, merge, omit } from 'es-toolkit'
import { darkTheme, lightTheme, useOsTheme } from 'naive-ui'
import { defineStore } from 'pinia'
import AppConstant from '@/constant/app'
import breakpoint from '@/hooks/common/breakpoint.ts'
import { appCache } from '@/store/caches'
import { generateCssVariableString, injectCSS, temporaryClearTransition } from '@/utils'

// 初始APP STORE
export const initialAppStore: AppStore = {
  // 主题颜色
  themeColor: AppConstant.THEME.colors.primary,
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
  // 中性主题
  const neuterTheme = computed(() => AppConstant.THEME.modes[appStore.themeMode])
  // 主题调色板
  const themePalettes = computed(() => {
    const colors = {
      ...AppConstant.THEME.colors,
      primary: appStore.themeColor,
    }
    return Object.entries(colors).reduce<ThemePalettes>((gradient, [key, value]) => {
      // 生成色板
      const palette = generatePalette(value)
      // 映射梯度
      gradient[key] = paletteMapGradientColor(palette)
      return gradient
    }, {} as ThemePalettes)
  })
  // naive主题
  const naiveTheme = computed(() => isLight.value ? lightTheme : darkTheme)
  // 是否小屏幕
  const isSmallScreen = computed(() => smaller('sm').value)

  const createToggle = (key: keyof AppStore) => (val?: boolean) => {
    (appStore[key] as boolean) = val ?? !(appStore[key] as boolean)
  }

  // 切换Sidebar折叠
  const toggleSidebarCollapsed = createToggle('isCollapsedSidebar')
  // 切换移动端Sidebar可见
  const toggleMobileSidebarVisible = createToggle('mobileSidebarVisible')
  // 切换混合Sidebar折叠
  const toggleMixSidebarCollapsed = createToggle('isCollapsedMixSidebar')
  // 切换混合SidebarDrawer可见
  const toggleMixSidebarDrawerVisible = createToggle('mixSidebarDrawerVisible')
  // 切换混合SidebarDrawer固定
  const toggleFixedMixSidebarDrawer = createToggle('isFixedMixSidebarDrawer')
  // 切换全屏loading
  const toggleFullScreenLoading = createToggle('fullScreenLoading')

  // 生成色板
  function generatePalette(color: string) {
    return generate(color, {
      theme: isDark.value ? 'dark' : 'default',
      backgroundColor: neuterTheme.value.backgroundColor?.layout,
    })
  }

  // 生成 CSS 变量
  function generateCssVars(theme: Readonly<any>) {
    return Object
      .entries(theme)
      .map(([key, value]) => generateCssVariableString(value, key, ':root'))
  }

  // 调色板映射为梯度颜色
  function paletteMapGradientColor(palette: string[]): Palettes {
    return {
      shallow: palette[0],
      shallowHover: palette[1],
      border: palette[2],
      borderHover: palette[3],
      hover: palette[4],
      main: palette[5],
      active: palette[6],
      textHover: palette[7],
      text: palette[8],
      textActive: palette[9],
    }
  }

  // 适配 Naive 主题
  function adaptNaiveTheme(theme: AppTheme, palettes: ThemePalettes, neutralTheme: NeutralTheme) {
    const naiveThemeOverride: GlobalThemeOverrides = {
      Layout: {
        textColorInverted: neutralTheme.textColor.inverted,
        siderBorderColorInverted: neutralTheme.borderColor.inverted,
        headerBorderColorInverted: neutralTheme.borderColor.inverted,
        footerBorderColorInverted: neutralTheme.borderColor.inverted,
      },
      common: {
        // ==============================
        // 1. 品牌色 & 语义色 (映射色板)
        // ==============================

        // 主色 (Primary)
        primaryColor: palettes.primary.main,
        primaryColorHover: palettes.primary.hover,
        primaryColorPressed: palettes.primary.main,
        primaryColorSuppl: palettes.primary.active,

        // 成功色 (Success)
        successColor: palettes.success.main,
        successColorHover: palettes.success.hover,
        successColorPressed: palettes.success.main,
        successColorSuppl: palettes.success.active,

        // 警告色 (Warning)
        warningColor: palettes.warning.main,
        warningColorHover: palettes.warning.hover,
        warningColorPressed: palettes.warning.main,
        warningColorSuppl: palettes.warning.active,

        // 错误色 (Error)
        errorColor: palettes.error.main,
        errorColorHover: palettes.error.hover,
        errorColorPressed: palettes.error.main,
        errorColorSuppl: palettes.error.active,

        // 提示色 (Info)
        infoColor: palettes.info.main,
        infoColorHover: palettes.info.hover,
        infoColorPressed: palettes.info.main,
        infoColorSuppl: palettes.info.active,

        // ==============================
        // 2. 中性色 (文本、背景、边框)
        // ==============================

        // 文本颜色
        textColorBase: neutralTheme.textColor.main,
        textColor1: neutralTheme.textColor.main,
        textColor2: neutralTheme.textColor.secondary,
        textColor3: neutralTheme.textColor.tertiary,
        textColorDisabled: neutralTheme.textColor.disabled,

        // 背景颜色
        bodyColor: neutralTheme.backgroundColor.layout,
        cardColor: neutralTheme.backgroundColor.container,
        popoverColor: neutralTheme.backgroundColor.layer,
        modalColor: neutralTheme.backgroundColor.layer,
        invertedColor: neutralTheme.backgroundColor.inverted,

        // 交互填充色
        hoverColor: neutralTheme.fillColor.secondary,
        pressedColor: neutralTheme.fillColor.main,
        actionColor: neutralTheme.fillColor.tertiary,

        // // 边框颜色
        borderColor: neutralTheme.borderColor.main,
        dividerColor: neutralTheme.borderColor.secondary,

        // ==============================
        // 3. 基础排版与几何属性
        // ==============================

        // 边框圆角
        borderRadiusSmall: theme.borderRadius.sm,
        borderRadius: theme.borderRadius.md,

        // 字体大小
        fontSizeSmall: theme.textSize.sm,
        fontSize: theme.textSize.md,
        fontSizeLarge: theme.textSize.lg,
        fontSizeHuge: theme.textSize.xl,
      },
    }
    themeOverrides.value = merge(naiveThemeOverride, AppConstant.NAIVE_THEME_CONFIG[appStore.themeMode])
  }

  // 更新主题
  function updateTheme() {
    const baseTheme = omit(AppConstant.THEME, ['colors', 'breakpoints', 'modes'])

    // 生成基础 CSS 变量
    const baseCssVars = generateCssVars(baseTheme)
    // 生成主题色 CSS 变量
    const themeColorCssVars = generateCssVars(themePalettes.value)
    // 生成中性色 CSS 变量
    const neuterThemeCssVars = generateCssVars(neuterTheme.value)

    const cssVarsString = [...baseCssVars, ...themeColorCssVars, ...neuterThemeCssVars].join('\n')

    injectCSS(cssVarsString, 'theme')

    // 适配 Naive 主题
    adaptNaiveTheme(AppConstant.THEME, themePalettes.value, neuterTheme.value)
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
    if (!document.startViewTransition)
      return toggleThemeMode(mode)

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
