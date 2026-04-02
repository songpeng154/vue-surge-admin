import type { ResponsiveValue } from '@/components/common/grid/types'
import { isObject } from 'es-toolkit/compat'
import AppConstant from '@/constant/app.ts'
/*
* 响应式道具值
* xs < 530
* sm > xs || sm > 730
* md >= 992
* lg >= 1200
* xl >= 1920
*
* 具体响应值 >> /src/constant/app.ts >> SCREEN_BREAKPOINTS
* */
function responsivePropsValue<K extends Recordable>(width: Ref<number>, data: K, key: keyof K) {
  const getResponsiveValue = (record: ResponsiveValue) => {
    const b = AppConstant.THEME.breakpoints
    const { xs, sm, md, lg, xl } = record
    const w = width.value
    if (xs && w <= b.xs)
      return xs
    let v: any
    if (sm && (w > b.xs || w >= b.sm))
      v = sm
    if (md && w >= b.md)
      v = md
    if (lg && w >= b.lg)
      v = lg
    if (xl && w >= b.xl)
      v = xl
    return v
  }

  return computed(() => Number(isObject(data[key]) ? getResponsiveValue(data[key]) : data[key]))
}

export default responsivePropsValue
