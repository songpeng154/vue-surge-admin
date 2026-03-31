/**
 * 策略模式 （只要有一个false后面的函数就不执行）
 * [状态, 状态为true时执行的回调函数]
 */
export type TacticsAction = [ boolean, () => void ]

// 执行策略模式
export function runTacticsAction(tacticsAction: TacticsAction[]) {
  return tacticsAction.some(([flag, action]) => {
    flag && action()
    return flag
  })
}

// 获取CSS变量
export function getCSSVariable(key: string, el: HTMLElement = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(`--${key}`)
}

/**
 * 将 JS 对象转换为 CSS 变量字符串
 * @param {object} vars - 你的主题变量对象
 * @param {string} prefix - 前缀
 * @param {string} selector - CSS 选择器，通常是 ':root' 或 'html[data-theme="dark"]'
 * @returns {string} 完整的 CSS 规则字符串
 */
export function generateCssVariableString(vars: Record<string, any>, prefix?: string, selector: string = ':root'): string {
  let cssVariables = ''

  for (const [key, value] of Object.entries(vars)) {
    // 将驼峰命名 (primaryColor) 转换为中划线命名 (primary-color)
    const kebabKey = toKebabCase(key)

    // 拼接成 CSS 变量格式：--primary-color: #1677ff;
    if (prefix) {
      const kebabPrefix = toKebabCase(prefix)
      cssVariables += `  --${kebabPrefix}-${kebabKey}: ${value};\n`
    }
    else {
      cssVariables += `  --${kebabKey}: ${value};\n`
    }
  }

  // 包装在选择器中
  return `${selector} {\n${cssVariables}}`
}

// 注入CSS
export function injectCSS(css: string, id: string): void {
  let styleNode = document.getElementById(id) as HTMLStyleElement | null

  if (!styleNode) {
    styleNode = document.createElement('style')
    styleNode.id = id

    styleNode.setAttribute('type', 'text/css')

    document.head.appendChild(styleNode)
  }

  styleNode.innerHTML = css
}

// 临时清楚过渡效果
export function temporaryClearTransition(callback: () => void, time: number = 200) {
  document.documentElement.classList.add('noTransition')
  callback()
  setTimeout(() => {
    document.documentElement.classList.remove('noTransition')
  }, time)
}

// 异步等待
export async function asyncWait(millisecond: number = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined)
    }, millisecond)
  })
}

// 对象路径转为数组路径
export function objectPathToArray(path?: string): string[] {
  const regex = /[^.[\]]+/g
  const result = path?.match(regex)
  return result || []
}

// 路径转大驼峰
export function pathToPascalCase(path: string) {
  return path
    .split(/[/_-]/) // 使用正则表达式分割路径，支持 `/`, `_`, `-`
    .filter(Boolean) // 过滤掉空字符串
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
}

// 字母转'-'分隔形式
export function toKebabCase(str: string) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 判断是否有滚动条
export function hasScrollBar(element: HTMLElement) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
}

// 滚动到目标元素
export function scrollToElement(element: HTMLElement, behavior: ScrollBehavior = 'smooth', block: ScrollLogicalPosition = 'start') {
  element.scrollIntoView({
    behavior,
    block,
  })
}

// 获取图片路径
export function getImageUrl(path: string) {
  return new URL(`../assets/images/${path}`, import.meta.url).href
}
