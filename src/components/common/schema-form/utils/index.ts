import type { FormItemRule } from 'naive-ui/es/form/src/interface'
import type { RulePresets, RulePresetsType, Schema } from '@/components/common/schema-form/types/common.ts'
import type { ComponentsName } from '@/components/common/schema-form/types/component'
import { isString } from 'es-toolkit'
import { isArray } from 'es-toolkit/compat'
import RegUtils from '@/utils/reg'

type ComponentFunction = Record<ComponentsName, {
  // 是否映射 占位符
  isMapPlaceholder?: boolean

  // 是否映射 选项
  isMapOptions?: boolean

  // 是否是选择类型的组件
  isSelectComponent?: boolean

  // 是否是输入类型的组件
  isInputComponent?: boolean

  // 是否日期类型的组件
  isDateComponent?: boolean

  // 是否时间类型的组件
  isTimeComponent?: boolean

  // 组件的双向绑定是否是 Checked
  isCheckedBind?: boolean
}>

export const componentFunction: ComponentFunction = {
  autoComplete: {
    isInputComponent: true,
    isMapOptions: true,
    isMapPlaceholder: true,
  },
  cascader: {
    isSelectComponent: true,
    isMapOptions: true,
    isMapPlaceholder: true,
  },
  colorPicker: {
    isSelectComponent: true,
  },
  checkbox: {
    isCheckedBind: true,
  },
  checkboxGroup: {},
  datePicker: {
    isDateComponent: true,
    isMapPlaceholder: true,
  },
  dynamicInput: {
    isMapPlaceholder: true,
  },
  dynamicTags: {},
  input: {
    isInputComponent: true,
    isMapPlaceholder: true,
  },
  inputNumber: {
    isInputComponent: true,
    isMapPlaceholder: true,
  },
  mention: {
    isInputComponent: true,
    isMapPlaceholder: true,
    isMapOptions: true,
  },
  radio: {
    isCheckedBind: true,
  },
  radioGroup: {
  },
  select: {
    isSelectComponent: true,
    isMapPlaceholder: true,
    isMapOptions: true,
  },
  timePicker: {
    isSelectComponent: true,
    isTimeComponent: true,
    isMapPlaceholder: true,
  },
  transfer: {
    isMapOptions: true,
  },
  treeSelect: {
    isSelectComponent: true,
    isMapPlaceholder: true,
    isMapOptions: true,
  },
  upload: {},
  rate: {},
  switch: {},
  slider: {},
}

// 规则预设
const rulePresets: RulePresetsType = {
  mail: {
    requiredMessage: '请输入邮箱',
    incorrectMessage: '请输入合法邮箱',
    validator: (value: string) => RegUtils.MATCH_EMAIL.test(value),
  },
  phone: {
    requiredMessage: '请输入手机号',
    incorrectMessage: '请输入合法手机号',
    validator: (value: string) => RegUtils.MATCH_PHONE.test(value),
  },
  landline: {
    requiredMessage: '请输入固定电话',
    incorrectMessage: '请输入合法固定电话',
    validator: (value: string) => RegUtils.MATCH_LANDLINE.test(value),
  },
  idCard: {
    requiredMessage: '请输入身份证',
    incorrectMessage: '请输入合法身份证',
    validator: (value: string) => RegUtils.MATCH_ID_CARD.test(value),
  },
  url: {
    requiredMessage: '请输入网址',
    incorrectMessage: '请输入合法网址',
    validator: (value: string) => RegUtils.MATCH_URL.test(value),
  },
}

// 默认占位符
function defaultPlaceholder(label: Schema['label']) {
  const l = isString(label) ? label : ''

  return {
    daterange: ['开始日期', '结束日期'],
    datetimerange: ['开始日期时间', '结束日期时间'],
    yearrange: ['开始年', '结束年'],
    monthrange: ['开始月', '结束月'],
    quarterrange: ['开始季度', '结束季度'],
    input: `请输入${l}`,
    pick: `请选择${l}`,
    default: `${l}是必填项`,
  }
}

// 生成placeholder
export function generatePlaceholder(label: Schema['label'], component: ComponentsName, type?: string) {
  const placeholder = defaultPlaceholder(label)
  const { isDateComponent, isInputComponent, isSelectComponent } = componentFunction[component]
  //  处理日期范围类型
  if (isDateComponent && type?.includes('range'))
    return [placeholder[type][0], placeholder[type][1]]

  else if (isInputComponent)
    return placeholder.input

  else if (isSelectComponent)
    return placeholder.pick
}

// 生成规则
export function generateRule(label: string, component: ComponentsName): FormItemRule {
  const placeholder = defaultPlaceholder(label)
  const { isInputComponent, isSelectComponent } = componentFunction[component]
  let message: string = placeholder.default

  if (isInputComponent)
    message = placeholder.input
  else if (isSelectComponent)
    message = placeholder.pick

  return {
    required: true,
    message,
    validator(rule: FormItemRule, value: any) {
      if (value === null
        || value === undefined
        || value === ''
        || (isArray(value) && value.length === 0)) {
        return new Error(message)
      }

      return true
    },
    trigger: isInputComponent ? 'blur' : 'change',
  }
}

// 处理规则预设
export function handleRulePresets(rule: RulePresets): FormItemRule {
  return {
    required: true,
    validator(_rule: FormItemRule, value: string) {
      const { requiredMessage, incorrectMessage, validator } = rulePresets[rule]
      if (!value)
        return Promise.reject(requiredMessage)
      if (!validator(value))
        return Promise.reject(incorrectMessage)
      return Promise.resolve()
    },
    trigger: 'blur',
  }
}
