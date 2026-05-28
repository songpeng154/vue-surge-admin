import type { GridItemProps, GridProps } from '@/components/common/grid/types'
import type { NormalizedSchema } from '@/components/common/schema-form/core/types'
import type { UnwrapSchema } from '@/components/common/schema-form/types/common.ts'

export interface SchemaFormContent {
  schema: UnwrapSchema[] | NormalizedSchema[]

  gridProps: GridProps

  gridItemProps?: number | GridItemProps

  disabled?: boolean
}
