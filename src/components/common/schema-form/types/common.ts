import type { FormInst, FormItemProps, FormItemRule } from 'naive-ui'
import type { AutoCompleteGroupOption, AutoCompleteOption } from 'naive-ui/es/auto-complete/src/interface'
import type { CascaderOption } from 'naive-ui/es/cascader/src/interface'
import type { FormSetupProps } from 'naive-ui/es/form/src/Form'
import type { MentionOption } from 'naive-ui/es/mention/src/interface'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import type { Option } from 'naive-ui/es/transfer/src/interface'
import type { TreeSelectOption } from 'naive-ui/es/tree-select/src/interface'
import type { MaybeRef, UnwrapRef, VNode } from 'vue'
import type { GridItemProps, GridProps } from '@/components/common/grid/types'
import type { ComponentsName, ComponentsNameRef, ComponentsProps } from '@/components/common/schema-form/types/component'

export interface SchemaItemData {
  // item 元素
  el: HTMLElement

  // 字段
  field: string

  // item 标签宽度
  labelWidth: number
}

// 回调参数
export interface CallbackParams<
  TForm extends Recordable = Recordable,
  DComponentsName extends ComponentsName = ComponentsName,
> {
  schema: UnwrapSchema<TForm, DComponentsName>

  value: any

  model: TForm

  field: keyof TForm
}

// 回调参数
export type CallbackParamsFunction<
  TForm extends Recordable = Recordable,
  DComponentsName extends ComponentsName = ComponentsName,
  R = never,
>
  = ((params: CallbackParams<TForm, DComponentsName>) => R)

// 插槽内容
export type SlotsContent = string | VNode | VNode[]

// 组件插槽
export type ComponentSlots = {
  default?: () => SlotsContent
} & {
  [key: string]: (...arg: any) => SlotsContent
}

/**
 * 表单规则预设
 * @description mail 邮箱
 * @description phone 手机号
 * @description landline 固定电话
 * @description idCard 身份证号
 * @description url 网址
 */
export type RulePresets = 'mail' | 'phone' | 'landline' | 'idCard' | 'url'

export type RulePresetsType = Record<RulePresets, {
  // 必填信息
  requiredMessage: string

  // 错误信息
  incorrectMessage: string

  // 验证
  validator: (value: string) => boolean
}>

export type SafeComponentProps<T> = T extends Recordable ? T : never

export type FormItemPropsRefs = WrapWithMaybeRef<Omit<FormItemProps, 'label' | 'rule' | 'path' | 'required'>>

// 通用的选项类型
export type OptionType
  = SelectMixedOption
    | AutoCompleteOption
    | AutoCompleteGroupOption
    | TreeSelectOption
    | MentionOption
    | CascaderOption
    | Option

// 常用组件属性映射
export interface CommonComponentPropsMap<
  TForm extends Recordable = any,
  DComponentsName extends ComponentsNameRef = ComponentsNameRef,
> {
  // 占位符
  placeholder?: MaybeRef<string>

  // 日期范围组件 开始占位符
  startPlaceholder?: string

  // 日期范围组件 开始占位符
  endPlaceholder?: string

  // 选项
  options?: MaybeRef<OptionType[]>

  // TODO:未完成
  // 禁用
  disabled?: MaybeRef<boolean> | CallbackParamsFunction<TForm, UnwrapRef<DComponentsName>, boolean>
}

// Schema配置
export interface Schema<
  TForm extends Recordable = any,
  DComponentsName extends ComponentsNameRef = ComponentsNameRef,
> extends FormItemPropsRefs, CommonComponentPropsMap<TForm, DComponentsName> {
  // 字段
  field?: MaybeRef<keyof TForm | string>

  // label 标签的文本
  label?: MaybeRef<string> | SlotsContent | CallbackParamsFunction<TForm, UnwrapRef<DComponentsName>, SlotsContent>

  // 双向绑定名称
  vModelBind?: MaybeRef<string>

  // 组件
  component?: DComponentsName

  // 组件属性
  componentProps?: WrapWithMaybeRef<SafeComponentProps<ComponentsProps[UnwrapRef<DComponentsName>]>> | Recordable

  // 组件内容
  componentContent?: SlotsContent
    | ComponentSlots
    | ((callbackParams: CallbackParams<TForm, UnwrapRef<DComponentsName>>) => SlotsContent | ComponentSlots)

  // 自定义插槽
  slot?: MaybeRef<string>

  // formItem 插槽
  contentSlot?: MaybeRef<string>

  // grid item组件属性
  gridItemProps?: MaybeRef<number | GridItemProps>

  // 规则
  rule?: MaybeRef<RulePresets | FormItemRule | FormItemRule[]>

  // 该formItem是否隐藏
  hide?: MaybeRef<boolean> | CallbackParamsFunction<TForm, UnwrapRef<DComponentsName>, boolean>

  // 帮助提示信息
  tooltip?: MaybeRef<string>
}

// 定义JSON 格式配置
export type DefineSchema<
  TForm extends Recordable = any,
  DComponentsName extends ComponentsNameRef = ComponentsNameRef,
>
  = DComponentsName extends ComponentsNameRef ? Schema<TForm, DComponentsName> : never

// 解包 JSON 格式配置
export type UnwrapSchema<
  TForm extends Recordable = any,
  DComponentsName extends ComponentsNameRef = ComponentsNameRef,
>
  = UnwrapRef<DefineSchema<TForm, DComponentsName>>

/* --------------通用类型-------------- */

// 通用props
export interface SchemaFormCommonProps extends Partial<Omit<FormSetupProps, 'onSubmit'>> {
  // 表单类名
  formClass?: string

  // 表单样式
  formStyle?: Partial<CSSStyleDeclaration>

  // 模型
  model: Recordable

  // grid item组件属性
  gridItemProps?: number | GridItemProps

  // grid组件属性
  gridProps?: GridProps

  // 是否隐藏操作按钮
  hideActionButton?: boolean

  // 默认日期组件格式
  defaultDateFormat?: string

  // 默认时间组件格式
  defaultTimeFormat?: string

  // 默认日期组件值格式
  defaultDateValueFormat?: string

  // 默认时间组件值格式
  defaultTimeValueFormat?: string

  // 校验失败时自动滚动到对应的字段
  autoScrollToFailField?: boolean

  // 自动placeholder (item的label的类型为string才会生效，优先级最低)
  autoPlaceholder?: boolean

  // 自动规则校验 (当required为真的时候，会根据label自动生成校验提示信息,label的类型为string才会生效，优先级最低)
  autoRules?: boolean

  // 自动标签宽度 (优先级最低)
  autoLabelWidth?: boolean

  // 提交Loading
  submitLoading?: boolean

  // 提交按钮文字
  submitText?: string

  // 重置Loading
  resetLoading?: boolean

  // 重置按钮文字
  resetText?: string

  //  隐藏重置按钮
  hideReset?: boolean

  // 提交事件 (传入该事件后会覆盖 onFinish | onFinishFailed 事件)
  onSubmit?: (validate: SchemaFormCommonExpose['validate'], model: Recordable) => void

  // 提交表单且数据验证成功后回调事件
  onFinish?: (model: Recordable) => void

  // 提交表单且数据验证失败后回调事件
  onFinishFailed?: (error: any) => void

  // 重置方法
  onReset?: (validate: SchemaFormCommonExpose['resetFields'], model: Recordable) => void
}

// 通用插槽
export interface SchemaFormCommonSlots {
  // 自定义操作按钮
  customActionButton: () => any

  // 自定义按钮前面
  buttonBefore: () => any

  // 自定义按钮后面
  buttonAfter: () => any
}

// 通用方法
export interface SchemaFormCommonExpose extends FormInst {
  // 重置
  resetFields: () => void

  // 滚动到字段
  scrollToField: (field: string) => void
}
