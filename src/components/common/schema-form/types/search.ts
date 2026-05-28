/* --------------搜索表单-------------- */

import type {
  SchemaFormCommonExpose,
  SchemaFormCommonProps,
  SchemaFormCommonSlots,
  UnwrapSchema,
} from '@/components/common/schema-form/types/common.ts'

export interface SearchSchemaFormProps extends SchemaFormCommonProps {
  // schema 配置
  schema: UnwrapSchema[]

  // 是否开启折叠(关闭后折叠按钮不在显示)
  enableCollapsed?: boolean

  // 查询表单默认展示个数
  searchShowNumber?: number

  // 是否折叠
  collapsed?: boolean

  // 折叠文字 (默认:展开)
  collapsedText?: string

  // 未折叠文字 (默认:收起)
  expandedText?: string
}

export interface SearchSchemaFormExpose extends SchemaFormCommonExpose {
  toggleCollapsed: (isCollapsed: boolean) => void
}

export interface SearchSchemaFormSlots extends SchemaFormCommonSlots {

}
