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

// 批量设置CSS变量
export function setCSSVariables(variable: Recordable, el: HTMLElement = document.documentElement) {
  Object.keys(variable).forEach((key) => {
    if (getCSSVariable(key, el) === variable[key])
      return
    setCSSVariable(key, variable[key], el)
  })
}

// 设置Css变量
export function setCSSVariable(key: string, value: string, el: HTMLElement = document.documentElement) {
  el.style.setProperty(`--${key}`, value)
}

// 获取CSS变量
export function getCSSVariable(key: string, el: HTMLElement = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(`--${key}`)
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
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // 在小写字母或数字和大写字母之间加上 -
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // 在连续大写字母和小写字母之间加上 -
    .toLowerCase() // 转为小写
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
export const getImageUrl = (path: string) => {
  return new URL(`../assets/images/${path}`, import.meta.url).href
}
