import { omit } from 'es-toolkit'
import { computed } from 'vue'

/**
 * 省略属性
 * @param value 目标对象
 * @param keys 省略的key
 */
function useOmitProps<T extends Recordable, K extends keyof T>(value: T, keys: K[]) {
  return computed(() => omit(value, keys))
}

export default useOmitProps
