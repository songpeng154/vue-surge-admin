import type { DebouncedFunc } from 'es-toolkit/dist/compat/function/debounce'
import { debounce } from 'es-toolkit/compat'

export interface DebounceOptions {
  /**
   * If `true`, the function will be invoked on the leading edge of the timeout.
   * @default false
   */
  leading?: MaybeRef<boolean>
  /**
   * If `true`, the function will be invoked on the trailing edge of the timeout.
   * @default true
   */
  trailing?: MaybeRef<boolean>
  /**
   * The maximum time `func` is allowed to be delayed before it's invoked.
   * @default Infinity
   */
  maxWait?: MaybeRef<number>
}

function useDebounce<F extends AnyFunction>(fn: F, ms: MaybeRef<number>, options: DebounceOptions) {
  const createDebounceFn = () => {
    return debounce(fn, toValue(ms), {
      leading: toValue(options.leading),
      trailing: toValue(options.trailing),
      maxWait: toValue(options.maxWait),
    })
  }

  let debounceFn: DebouncedFunc<F> = createDebounceFn()

  watchEffect(() => {
    if (debounceFn) debounceFn.cancel()
    debounceFn = createDebounceFn()
  })

  return debounceFn
}

export default useDebounce
