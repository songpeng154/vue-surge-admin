import type { Rule } from 'unocss'
import AppConstant from '../constant/app.ts'

const neutralConfig = AppConstant.THEME.modes.light

// 中性主题规则映射
interface NeutralThemeUnocssRuleMapping {
  // 类名前缀 (如 'bg', 'text', 'border',['bg','backgroundColor'])
  prefixes: string | string[]
  // 允许的键值集合 (如 ['main', 'secondary'])
  keys: string[]
  // 生成的 CSS 属性名 (如 'background-color', 'color')
  cssProp: string
  // CSS 变量的前缀 (如 'background-color', 'text-color')
  cssVarPrefix: string
}

// unocss 规则主题映射
export const UNOCSS_RULE_THEME_MAPPING: NeutralThemeUnocssRuleMapping[] = [
  {
    prefixes: 'text',
    keys: Object.keys(neutralConfig.textColor),
    cssProp: 'color',
    cssVarPrefix: 'text-color',
  },
  {
    prefixes: 'bg',
    keys: Object.keys(neutralConfig.backgroundColor),
    cssProp: 'background-color',
    cssVarPrefix: 'background-color',
  },
  {
    prefixes: 'border',
    keys: Object.keys(neutralConfig.borderColor),
    cssProp: 'border-color',
    cssVarPrefix: 'border-color',
  },
  {
    prefixes: 'bg-fill',
    keys: Object.keys(neutralConfig.fillColor),
    cssProp: 'background-color',
    cssVarPrefix: 'fill-color',
  },
]

function generatePrefixRegex(prefixes: string | string[], keys: string[]): RegExp {
  const prefixList = Array.isArray(prefixes) ? prefixes : [prefixes]

  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\\-]/g, '\\$&')

  const safePrefixes = prefixList.map(escapeRegExp)

  const prefixPattern = `(${safePrefixes.join('|')})`

  if (!keys || keys.length === 0)
    return new RegExp(`^${prefixPattern}-(?!)`)

  const safeKeys = keys.map(escapeRegExp)

  return new RegExp(`^${prefixPattern}-(${safeKeys.join('|')})$`)
}

export function createAutoComplete(prefixes: string | (string[]), keys: string[]) {
  const prefix = Array.isArray(prefixes) ? prefixes.join('|') : prefixes
  const key = keys.join('|')
  return `(${prefix})-(${key})`
}

// 生成中性主题规则
export function generateNeutralThemeRules(): Rule[] {
  return UNOCSS_RULE_THEME_MAPPING.map(({ prefixes, keys, cssProp, cssVarPrefix }) => {
    return [
      generatePrefixRegex(prefixes, keys),
      ([, , matchKey]) => ({ [cssProp]: `var(--${cssVarPrefix}-${matchKey})` }),
      {
        autocomplete: createAutoComplete(prefixes, keys),
      },
    ]
  })
}

// 生成调色板
export function generatePalette(colorName: keyof AppTheme['colors']) {
  return {
    'DEFAULT': `var(--${colorName}-main)`,
    'shallow': `var(--${colorName}-shallow)`,
    'shallow-hover': `var(--${colorName}-shallow-hover)`,
    'border': `var(--${colorName}-border)`,
    'border-hover': `var(--${colorName}-border-hover)`,
    'hover': `var(--${colorName}-hover)`,
    'active': `var(--${colorName}-active)`,
    'text': `var(--${colorName}-text)`,
    'text-hover': `var(--${colorName}-text-hover)`,
    'text-active': `var(--${colorName}-text-active)`,
  }
}
