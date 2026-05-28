import type { GridItemProps } from '@/components/common/grid/types'
import type { NormalizedSchema } from '@/components/common/schema-form/core/types'

export interface SchemaFormItemProps {
  schema: NormalizedSchema

  id: string

  disabled?: boolean

  gridItemProps?: GridItemProps | number
}
