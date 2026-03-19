/* --------------分组表单-------------- */

import type { UnwrapRef } from 'vue'
import type { GridItemProps, GridProps } from '@/components/common/grid/types'
import type {
  DefineSchema,
  SchemaFormCommonExpose,
  SchemaFormCommonProps,
  SchemaFormCommonSlots,
} from '@/components/common/schema-form/types/common.ts'
// 模块表单结构
import type { ComponentsName } from '@/components/common/schema-form/types/component.ts'

// 回调参数
export interface GroupCallbackParams<
  TForm extends Recordable = Recordable,
  DComponentsName extends ComponentsName = ComponentsName,
> {
  group: UnwrapGroupSchema<TForm, DComponentsName>

  model: TForm
}

// 组回调参数
export type GroupCallbackParamsFunction<
  TForm extends Recordable = Recordable,
  DComponentsName extends ComponentsName = ComponentsName,
  R = never,
>
  = ((params: GroupCallbackParams<TForm, DComponentsName>) => R)

export interface DefineGroupSchema<
  TForm extends Recordable = any,
  DComponentsName extends ComponentsName = ComponentsName,
> {
  // 模块标题
  title: MaybeRef<string>

  // 帮助提示信息
  helpMessage?: MaybeRef<string>

  // 是否隐藏
  hide?: MaybeRef<boolean> | GroupCallbackParamsFunction<TForm, DComponentsName, boolean>

  // 表单
  form: DefineSchema<TForm, DComponentsName>[]

  // 是否折叠
  collapsed?: boolean

  // 折叠时显示的行数
  notCollapsedRows?: number

  // 是否隐藏折叠按钮
  isHidCollapseButton?: MaybeRef<boolean>

  // TODO:未完成
  // 禁用表单
  disabled?: MaybeRef<boolean>

  // grid item组件属性
  gridItemProps?: MaybeRef<number | GridItemProps>

  // grid组件属性
  gridProps?: MaybeRef<GridProps>
}

export type UnwrapGroupSchema<
  TForm extends Recordable = any,
  DComponentsName extends ComponentsName = ComponentsName,
> = UnwrapRef<DefineGroupSchema<TForm, DComponentsName>>

export interface GroupSchemaFormProps extends SchemaFormCommonProps {
  // schema 配置
  schema: UnwrapGroupSchema[]

  // 默认是否折叠
  defaultCollapsed?: boolean

  // 默认不折叠的行数
  defaultNotCollapsedRows?: number

  // 折叠文字 (默认:展开)
  collapsedText?: string

  // 未折叠文字 (默认:收起)
  unCollapsedText?: string
}

export interface GroupSchemaFormExpose extends SchemaFormCommonExpose {
  toggleCollapsed: (index: number, isCollapsed?: boolean) => void
}

export interface GroupSchemaFormSlots extends SchemaFormCommonSlots {
  // 自定义group标题
  groupTitle: (props: { config: UnwrapGroupSchema }) => any

  // 自定义折叠按钮
  collapsedButton: (props: {
    config: UnwrapGroupSchema
    toggleCollapsed: (config: UnwrapGroupSchema, isCollapsed: boolean) => void
  }) => any
}
