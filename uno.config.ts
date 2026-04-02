import type { Theme } from '@unocss/preset-wind4/theme'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { defineConfig, presetIcons, presetWind4, transformerDirectives } from 'unocss'
import AppConstant from './src/constant/app'
import {
  generateNeutralThemeRules,
  generatePalette,
} from './src/utils/unocss.ts'

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
    presetWind4(),
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
    ...generateNeutralThemeRules(),
  ],
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
  },
  theme: {
    colors: {
      primary: generatePalette('primary'),
      success: generatePalette('success'),
      warning: generatePalette('warning'),
      error: generatePalette('error'),
      info: generatePalette('info'),
    },
    radius: {
      sm: 'var(--border-radius-sm)',
      md: 'var(--border-radius-md)',
      lg: 'var(--border-radius-lg)',
      xl: 'var(--border-radius-xl)',
    },
    text: {
      sm: {
        fontSize: 'var(--text-size-sm)',
      },
      md: {
        fontSize: 'var(--text-size-md)',
      },
      lg: {
        fontSize: 'var(--text-size-lg)',
      },
      xl: {
        fontSize: 'var(--text-size-xl)',
      },
    },
    breakpoint: Object.entries(AppConstant.THEME.breakpoints).reduce((breakpoints, [key, value]) => {
      breakpoints[key] = `${value}px`
      return breakpoints
    }, {}),
  },
})
