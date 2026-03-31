// 主题模式
declare type ThemeMode = 'light' | 'dark'

// 文字颜色
declare interface TextColor {
  // 一级文本颜色
  main: string

  // 二级文本颜色
  secondary: string

  // 三级文本颜色
  tertiary: string

  // 禁用
  disabled: string

  // 反转
  inverted: string
}

// 背景颜色
declare interface BackgroundColor {
  // 布局背景颜色
  layout: string

  // 容器背景颜色
  container: string

  // 浮层背景颜色
  layer: string

  // 遮罩层背景
  mask: string

  // 反转
  inverted: string
}

// 边框颜色
declare interface ThemeBorderColor {
  // 一级边框颜色
  main: string

  // 二级边框颜色
  secondary: string

  // 三级边框颜色
  tertiary: string

  // 反转
  inverted: string
}

// 填充颜色
declare interface ThemeFillColor {
  // 一级填充颜色
  main: string

  // 二级填充颜色
  secondary: string

  // 三级填充颜色
  tertiary: string

  // 反转
  inverted: string
}

// 字体大小
declare interface TextSize {
  sm: string

  md: string

  lg: string

  xl: string
}

// 边框圆角
declare interface BorderRadius {
  sm: string

  md: string

  lg: string

  xl: string
}

declare interface PrimaryTheme {
  shallowBg: string
  shallowBgHover: string
  border: string
  borderHover: string
  text: string
  textHover: string
  main: string
  hover: string
  active: string
}

declare type BreakpointType = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// 屏幕断点
declare type Breakpoints<T = number> = Record<BreakpointType, T>

// 色板
interface Palettes {
  // 浅色 (极浅)
  shallow: string

  // 浅色悬浮
  shallowHover: string

  // 常规边框
  border: string

  // 边框悬浮
  borderHover: string

  // 主色悬浮 (略浅于主色)
  hover: string

  // 核心主色
  main: string

  // 主色点击/激活 (略深)
  active: string

  // 文本悬浮色
  textHover: string

  // 核心文本色
  text: string

  // 文本点击色 (极深)
  textActive: string
}

// 中性主题
declare interface NeutralTheme {
  // 文字颜色
  textColor: TextColor

  // 背景颜色
  backgroundColor: BackgroundColor

  // 边框颜色
  borderColor: ThemeBorderColor

  // 填充颜色
  fillColor: ThemeFillColor
}

// 主题
declare interface AppTheme {
  // 颜色
  colors: {
    // 主题色
    primary: string

    // 成功色
    success: string

    // 警告色
    warning: string

    // 错误色
    error: string

    // 信息提醒色
    info: string
  }

  // 字体大小
  textSize: TextSize

  // 边框圆角
  borderRadius: BorderRadius

  // 屏幕断点
  breakpoints: Breakpoints

  // 根据模式切换的中性主题
  modes: Record<ThemeMode, NeutralTheme>
}

declare type ThemeColorsKeys = keyof AppTheme['colors']

declare type ThemePalettes = Record<ThemeColorsKeys, Palettes>

// 主题模式配置
declare type ThemeModeConfig = Record<ThemeMode, AppTheme>
