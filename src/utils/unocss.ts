import type { Rule } from 'unocss'
import AppConstant from '../constant/app.ts'

const neutralConfig = AppConstant.THEME.modes.light

export const TEXT_COLOR_KEYS = Object.keys(neutralConfig.textColor)
export const BACKGROUND_COLOR_KEYS = Object.keys(neutralConfig.backgroundColor)
export const BORDER_COLOR_KEYS = Object.keys(neutralConfig.borderColor)
export const FILL_COLOR_KEYS = Object.keys(neutralConfig.fillColor)

/**
 * 内部方法：生成前缀正则
 */
function generatePrefixRegex(prefix: string, keys: string[]): RegExp {
  if (!keys || keys.length === 0)
    return new RegExp(`^${prefix}-(?!)`)
  const safeKeys = keys.map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return new RegExp(`^${prefix}-(${safeKeys.join('|')})$`)
}

/**
 * 生成 UnoCSS 动态规则的公共方法
 * @param prefix       类名前缀 (如 'bg', 'text', 'border')
 * @param keys         允许的键值集合 (如 ['main', 'secondary'])
 * @param cssProp      生成的 CSS 属性名 (如 'background-color', 'color')
 * @param cssVarPrefix CSS 变量的前缀 (如 'background-color', 'text-color')
 * @returns            UnoCSS 动态规则元组
 */
export function createThemeRule(
  prefix: string,
  keys: string[],
  cssProp: string,
  cssVarPrefix: string,
): Rule {
  return [
    generatePrefixRegex(prefix, keys),
    // UnoCSS 动态规则的回调，自动拼接为 CSS 变量
    ([, matchKey]) => ({ [cssProp]: `var(--${cssVarPrefix}-${matchKey})` }),
    { autocomplete: `bg-$${cssProp}` },
  ]
}
