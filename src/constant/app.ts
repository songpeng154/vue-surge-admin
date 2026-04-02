import type { GlobalThemeOverrides } from 'naive-ui'

export default class AppConstant {
  // 主题配置
  static THEME: AppTheme = {
    colors: {
      primary: '#6675ff',

      success: '#52C41A',

      warning: '#FAAE13',

      error: '#FF4D4E',

      info: '#5a70df',
    },
    textSize: {
      sm: '12px',
      md: '14px',
      lg: '16px',
      xl: '18px',
    },
    borderRadius: {
      sm: '2px',
      md: '4px',
      lg: '8px',
      xl: '10px',
    },
    breakpoints: {
      xs: 530,
      sm: 768,
      md: 992,
      lg: 1200,
      xl: 1920,
    },
    modes: {
      light: {
        textColor: {
          main: 'rgba(31, 34, 37, .9)',
          secondary: 'rgba(51, 54, 57, .9)',
          tertiary: 'rgba(118, 124, 130, .9)',
          disabled: 'rgba(194, 194, 194, .9)',
          inverted: 'rgba(255, 255, 255, .9)',
        },
        backgroundColor: {
          layout: '#f6f6f6',
          container: '#ffffff',
          layer: '#ffffff',
          mask: '#333333',
          inverted: '#24242b',
        },
        fillColor: {
          main: 'rgba(225,225,225,.8)',
          secondary: 'rgba(225,225,225,.4)',
          tertiary: 'rgba(225,225,225,.2)',
          // inverted: 'rgba(90,90,90,.4)',
          inverted: 'rgba(100,100,100,.2)',
        },
        borderColor: {
          main: 'rgba(224,224,230,.9)',
          secondary: 'rgba(224,224,230,.8)',
          tertiary: 'rgba(224,224,230,.6)',
          inverted: 'rgba(255,255,255,.1)',
        },
      },
      dark: {
        textColor: {
          main: 'rgba(255, 255, 255, .9)',
          secondary: 'rgba(255, 255, 255, 0.82)',
          tertiary: 'rgba(255, 255, 255, 0.52)',
          disabled: 'rgba(255, 255, 255, 0.38)',
          inverted: 'rgba(255, 255, 255, .9)',
        },
        backgroundColor: {
          layout: '#101014',
          container: '#18181c',
          layer: '#2c2c32',
          mask: '#333333',
          inverted: '#24242b',
        },
        fillColor: {
          main: 'rgba(60,60,60,.8)',
          secondary: 'rgba(60,60,60,.6)',
          tertiary: 'rgba(60,60,60,.4)',
          inverted: 'rgba(100,100,100,.9)',
        },
        borderColor: {
          main: 'rgba(255,255,255,.15)',
          secondary: 'rgba(255,255,255,.1)',
          tertiary: 'rgba(255,255,255,.08)',
          inverted: 'rgba(255,255,255,.05)',
        },
      },
    },
  }

  // naive 组件主题配置
  static NAIVE_THEME_CONFIG: Record<ThemeMode, GlobalThemeOverrides> = {
    light: {},
    dark: {
      Button: {
        textColorPrimary: 'rgba(255, 255, 255, .9)',
        textColorHoverPrimary: 'rgba(255, 255, 255, .9)',
        textColorPressedPrimary: 'rgba(255, 255, 255, .9)',
        textColorFocusPrimary: 'rgba(255, 255, 255, .9)',
        textColorDisabledPrimary: 'rgba(255, 255, 255, .9)',
        textColorSuccess: 'rgba(255, 255, 255, .9)',
        textColorHoverSuccess: 'rgba(255, 255, 255, .9)',
        textColorPressedSuccess: 'rgba(255, 255, 255, .9)',
        textColorFocusSuccess: 'rgba(255, 255, 255, .9)',
        textColorDisabledSuccess: 'rgba(255, 255, 255, .9)',
        textColorWarning: 'rgba(255, 255, 255, .9)',
        textColorHoverWarning: 'rgba(255, 255, 255, .9)',
        textColorPressedWarning: 'rgba(255, 255, 255, .9)',
        textColorFocusWarning: 'rgba(255, 255, 255, .9)',
        textColorDisabledWarning: 'rgba(255, 255, 255, .9)',
        textColorError: 'rgba(255, 255, 255, .9)',
        textColorHoverError: 'rgba(255, 255, 255, .9)',
        textColorPressedError: 'rgba(255, 255, 255, .9)',
        textColorFocusError: 'rgba(255, 255, 255, .9)',
        textColorDisabledError: 'rgba(255, 255, 255, .9)',
        textColorInfo: 'rgba(255, 255, 255, .9)',
        textColorHoverInfo: 'rgba(255, 255, 255, .9)',
        textColorPressedInfo: 'rgba(255, 255, 255, .9)',
        textColorFocusInfo: 'rgba(255, 255, 255, .9)',
        textColorDisabledInfo: 'rgba(255, 255, 255, .9)',
      },
    },
  }

  // 系统主题色预设
  static THEME_COLORS = [
    this.THEME.colors.primary,
    '#31b3b3',
    '#3498DB',
    '#dd4939',
    '#D35400',
    '#F39C12',
    '#8e4dc3',
    '#16A085',
    '#27bc51',
  ]
}
