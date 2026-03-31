import type { GridItemData } from '@/components/common/grid/types'

export function resolveItemData(cols: number, props: GridItemData): GridItemData {
  const originSpan = props.span ?? 1
  const originOffset = props.offset ?? 0
  const offset = Math.min(originOffset, cols)
  const span = Math.min(offset > 0 ? originSpan + originOffset : originSpan, cols)
  return {
    span,
    offset,
    suffix: 'suffix' in props ? props.suffix !== false : false,
  }
}

export function setItemVisible(cols: number, collapsed: boolean, notCollapsedRows: number, itemDataList: GridItemData[]) {
  let displayIndexList: number[] = []

  const isOverflow = (span: number) => Math.ceil(span / cols) > notCollapsedRows

  if (collapsed) {
    let spanSum = itemDataList.reduce((num, item, index) => {
      if (item.suffix) {
        num += item.span
        displayIndexList.push(index)
      }
      return num
    }, 0)

    for (let i = 0; i < itemDataList.length; i++) {
      const item = itemDataList[i]
      if (!item.suffix) {
        spanSum += item.span
        if (isOverflow(spanSum))
          break
        displayIndexList.push(i)
      }
    }
  }
  else {
    displayIndexList = itemDataList.map((_, index) => index)
  }

  const overflow = itemDataList.some((item, index) => !item.suffix && !displayIndexList.includes(index))

  return { overflow, displayIndexList }
}
