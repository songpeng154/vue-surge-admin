/* --------------鍒嗙粍琛ㄥ崟-------------- */

import type { GridItemProps, GridProps } from '@/components/common/grid/types'
import type {
  DefineSchema,
  SchemaFormCommonExpose,
  SchemaFormCommonProps,
  SchemaFormCommonSlots,
  UnwrapSchema,
} from '@/components/common/schema-form/types/common.ts'
// 妯″潡琛ㄥ崟缁撴瀯
import type { ComponentsName } from '@/components/common/schema-form/types/component.ts'

// 鍥炶皟鍙傛暟
export interface GroupCallbackParams<
  TForm extends Recordable = Recordable,
  DComponentsName extends ComponentsName = ComponentsName,
> {
  group: GroupCallbackSchema<TForm, DComponentsName>

  model: TForm
}

// 缁勫洖璋冨弬鏁?
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
  // 妯″潡鏍囬
  title: MaybeRef<string>

  // 甯姪鎻愮ず淇℃伅
  helpMessage?: MaybeRef<string>

  // 鏄惁闅愯棌
  hide?: MaybeRef<boolean> | GroupCallbackParamsFunction<TForm, DComponentsName, boolean>

  // 琛ㄥ崟
  form: DefineSchema<TForm, DComponentsName>[]

  // 鏄惁鎶樺彔
  collapsed?: boolean

  // 鎶樺彔鏃舵樉绀虹殑琛屾暟
  collapsedRows?: number

  // 鏄惁闅愯棌鎶樺彔鎸夐挳
  hideCollapseButton?: MaybeRef<boolean>

  // TODO:鏈畬鎴?
  // 绂佺敤琛ㄥ崟
  disabled?: MaybeRef<boolean>

  // grid item缁勪欢灞炴€?
  gridItemProps?: MaybeRef<number | GridItemProps>

  // grid缁勪欢灞炴€?
  gridProps?: MaybeRef<GridProps>
}

export type UnwrapGroupSchema<
  TForm extends Recordable = any,
  DComponentsName extends ComponentsName = ComponentsName,
> = {
  title: string
  helpMessage?: string
  hide?: boolean | GroupCallbackParamsFunction<TForm, DComponentsName, boolean>
  form: UnwrapSchema<TForm, DComponentsName>[]
  collapsed?: boolean
  collapsedRows?: number
  hideCollapseButton?: boolean
  disabled?: boolean
  gridItemProps?: number | GridItemProps
  gridProps?: GridProps
}

export interface RuntimeGroupBaseSchema<
  TForm extends Recordable = any,
  DComponentsName extends ComponentsName = ComponentsName,
> {
  key: string
  title: string
  helpMessage?: string
  form: UnwrapSchema<TForm, DComponentsName>[]
  collapsed: boolean
  collapsedRows: number
  hideCollapseButton?: boolean
  disabled?: boolean
  gridItemProps?: number | GridItemProps
  gridProps?: GridProps
}

export interface GroupCallbackSchema<
  TForm extends Recordable = any,
  DComponentsName extends ComponentsName = ComponentsName,
> {
  key?: string
  title: string
  helpMessage?: string
  form: UnwrapSchema<TForm, DComponentsName>[]
  collapsed?: boolean
  collapsedRows?: number
  hideCollapseButton?: boolean
  disabled?: boolean
  gridItemProps?: number | GridItemProps
  gridProps?: GridProps
}

export interface RuntimeGroupSchema<
  TForm extends Recordable = any,
  DComponentsName extends ComponentsName = ComponentsName,
> extends RuntimeGroupBaseSchema<TForm, DComponentsName> {
  hide?: boolean | GroupCallbackParamsFunction<TForm, DComponentsName, boolean>
}

export interface GroupSchemaFormProps extends SchemaFormCommonProps {
  // schema 閰嶇疆
  schema: UnwrapGroupSchema[]

  // 榛樿鏄惁鎶樺彔
  defaultCollapsed?: boolean

  // 榛樿涓嶆姌鍙犵殑琛屾暟
  defaultCollapsedRows?: number

  // 鎶樺彔鏂囧瓧 (榛樿:灞曞紑)
  collapsedText?: string

  // 鏈姌鍙犳枃瀛?(榛樿:鏀惰捣)
  expandedText?: string
}

export interface GroupSchemaFormExpose extends SchemaFormCommonExpose {
  toggleCollapsed: (index: number, isCollapsed?: boolean) => void
}

export interface GroupSchemaFormSlots extends SchemaFormCommonSlots {
  // 鑷畾涔塯roup鏍囬
  groupTitle: (props: { config: RuntimeGroupSchema }) => any

  // 鑷畾涔夋姌鍙犳寜閽?
  collapsedButton: (props: {
    config: RuntimeGroupSchema
    overflow: boolean
    toggleCollapsed: (config: RuntimeGroupSchema, isCollapsed?: boolean) => void
  }) => any
}
