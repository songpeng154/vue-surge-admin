import type { Theme } from '@unocss/preset-uno'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss'
import AppConstant from './src/constant/app'

export default defineConfig<Theme>({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist'],
    },
  },
  transformers: [
    transformerDirectives(),
  ],
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      // 额外的CSS属性配置
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        // 加载本地SVG 使用方式: i-local:xxx
        local: FileSystemIconLoader('./src/assets/svg'),
      },
    }),
  ],
  rules: [
    // 填充（单位 px）
    [/^full-(\d+)$/, ([, d]) => ({ width: `${d}px`, height: `${d}px` })],
    // 填充（任意单位）
    [/^full-\[(.*)\]$/, ([, d]) => ({ width: d, height: d })],
  ],
  shortcuts: {
    'w-h-full': 'w-full h-full',
    'flex-center': 'flex justify-center items-center',
    'flex-x-center': 'flex justify-center',
    'flex-y-center': 'flex items-center',

    /* 为了自定义主题的代码提示 (unocss bug) */
    // 'text-base': 'text-base',
    // 'text-secondary': 'text-secondary',
    // 'text-tertiary': 'text-tertiary',
    // 'text-inverted': 'text-inverted',
    // 'bg-container': 'bg-container',
    // 'bg-layout': 'bg-layout',
    // 'bg-layer': 'bg-layer',
    // 'bg-inverted': 'bg-inverted',
  },
  theme: {
    colors: {
      // 主色
      primary: 'var(--primary-5)',
      // 浅主色
      primaryShallow: 'var(--primary-2)',
      // 填充色
      fill: {
        // 一级填充色
        base: 'var(--fill-color-base)',
        // 二级填充色
        secondary: 'var(--fill-color-secondary)',
        // 三级填充色
        tertiary: 'var(--fill-color-tertiary)',
        // 反转
        inverted: 'var(--fill-color-inverted)',
      },
    },
    textColor: {
      // 一级文本色
      base: 'var(--text-color-base)',
      // 二级级文本色
      secondary: 'var(--text-color-secondary)',
      // 三级文本色
      tertiary: 'var(--text-color-tertiary)',
      // 反转
      inverted: 'var(--text-color-inverted)',
    },
    backgroundColor: {
      // 布局背景色
      layout: 'var(--background-color-layout)',
      // 容器背景色
      container: 'var(--background-color-container)',
      // 浮层背景色
      layer: 'var(--background-color-layer)',
      // 反转
      inverted: 'var(--background-color-inverted)',
    },
    borderColor: {
      // 一级边框色
      base: 'var(--border-color-base)',
      // 二级边框色
      secondary: 'var(--border-color-secondary)',
      // 三级边框色
      tertiary: 'var(--border-color-tertiary)',
      // 反转
      inverted: 'var(--border-color-inverted)',
    },
    borderRadius: {
      sm: 'var(--border-radius-sm)',
      md: 'var(--border-radius-md)',
      lg: 'var(--border-radius-lg)',
    },
    breakpoints: Object.entries(AppConstant.SCREEN_BREAKPOINTS).reduce((breakpoints, [key, value]) => {
      breakpoints[key] = `${value}px`
      return breakpoints
    }, {}),
  },
})
