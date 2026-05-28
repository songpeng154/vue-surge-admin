import type { FormItemRule } from 'naive-ui/es/form/src/interface'
import type { RulePresets, RulePresetsType, Schema } from '@/components/common/schema-form/types/common.ts'
import type { ComponentsName } from '@/components/common/schema-form/types/component'
import { isString } from 'es-toolkit'
import { isArray } from 'es-toolkit/compat'
import RegUtils from '@/utils/reg'
import { getSchemaComponentAdapter } from '@/components/common/schema-form/core/registry'

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

function defaultPlaceholder(label: Schema['label']) {
  const l = isString(label) ? label : ''

  return {
    daterange: ['开始日期', '结束日期'],
    datetimerange: ['开始日期时间', '结束日期时间'],
    input: `请输入${l}`,
    pick: `请选择${l}`,
    default: `${l}是必填项`,
  }
}

export function generatePlaceholder(label: Schema['label'], component: ComponentsName, type?: string) {
  const placeholder = defaultPlaceholder(label)
  const adapter = getSchemaComponentAdapter(component)

  if (adapter?.valueType === 'date' && type?.includes('range')) {
    const rangePlaceholder = placeholder[type as keyof typeof placeholder]
    return isArray(rangePlaceholder) ? [rangePlaceholder[0], rangePlaceholder[1]] : undefined
  }

  if (adapter?.valueType === 'input')
    return placeholder.input

  if (adapter?.valueType === 'select')
    return placeholder.pick
}

export function generateRule(label: string, component: ComponentsName): FormItemRule {
  const placeholder = defaultPlaceholder(label)
  const adapter = getSchemaComponentAdapter(component)
  let message: string = placeholder.default

  if (adapter?.valueType === 'input')
    message = placeholder.input
  else if (adapter?.valueType === 'select')
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
    trigger: adapter?.valueType === 'input' ? 'blur' : 'change',
  }
}

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
