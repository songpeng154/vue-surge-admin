import type { FormItemRule } from 'naive-ui'
import type { GridItemProps } from '@/components/common/grid/types'
import type {
  CallbackParams,
  CallbackParamsFunction,
  OptionType,
  Schema,
  SchemaFormCommonProps,
  UnwrapSchema,
} from '@/components/common/schema-form/types/common.ts'
import type { ComponentsName } from '@/components/common/schema-form/types/component'
import type {
  NormalizedSchema,
  NormalizeSchemaContext,
  NormalizeSchemaListContext,
  SchemaComponentAdapter,
} from '@/components/common/schema-form/core/types'
import { isFunction, isString, omit } from 'es-toolkit'
import { get, isArray, isNumber } from 'es-toolkit/compat'
import { getSchemaComponentAdapter } from '@/components/common/schema-form/core/registry'
import { generatePlaceholder, generateRule, handleRulePresets } from '@/components/common/schema-form/core/rules'

const FORM_ITEM_OMIT_KEYS: (keyof Schema)[] = [
  'field',
  'component',
  'label',
  'componentProps',
  'componentContent',
  'hide',
  'rules',
  'tooltip',
  'gridItemProps',
  'contentSlot',
  'slot',
]

function callbackParamsFunction<TForm extends Recordable, R>(value: R | CallbackParamsFunction<TForm, any, R>, params: CallbackParams<TForm>): R {
  return isFunction(value)
    ? value(params)
    : value
}

function normalizeGridItemProps(item?: number | GridItemProps): GridItemProps {
  return (isNumber(item) ? { span: item } : item || {}) as GridItemProps
}

function resolveRules<TForm extends Recordable>(schema: UnwrapSchema<TForm>, props: SchemaFormCommonProps): FormItemRule | FormItemRule[] | undefined {
  const rules = schema.rules
  if (!rules) {
    const isRequire = Boolean(schema.showRequireMark ?? props.showRequireMark)
    const shouldGenerateRequiredRule = Boolean(props.autoRequiredRule && isRequire && schema.component && isString(schema.label))
    return shouldGenerateRequiredRule ? generateRule(schema.label as string, schema.component!) : undefined
  }

  if (typeof rules === 'string')
    return handleRulePresets(rules)

  return rules
}

function resolveComponentProps<TForm extends Recordable>(schema: UnwrapSchema<TForm>, adapter: SchemaComponentAdapter | undefined, ctx: NormalizeSchemaContext<TForm>, params: CallbackParams<TForm>) {
  const { component, componentProps, placeholder, startPlaceholder, endPlaceholder, options, disabled } = schema
  const mapProps: Recordable = {}

  if (!component || !adapter)
    return { ...(componentProps as Recordable) }

  const props = (componentProps as Recordable) || {}

  if (adapter.valueType === 'date') {
    mapProps.format = ctx.schemaFormProps.defaultDateFormat
    mapProps.valueFormat = ctx.schemaFormProps.defaultDateValueFormat
  }

  if (adapter.valueType === 'time') {
    mapProps.format = ctx.schemaFormProps.defaultTimeFormat
    mapProps.valueFormat = ctx.schemaFormProps.defaultTimeValueFormat
  }

  if (ctx.schemaFormProps.autoPlaceholder && adapter.mapPlaceholder && isString(schema.label)) {
    const autoPlaceholder = generatePlaceholder(schema.label, component, props.type)
    if (isArray(autoPlaceholder)) {
      mapProps.startPlaceholder = autoPlaceholder[0]
      mapProps.endPlaceholder = autoPlaceholder[1]
    }
    else if (autoPlaceholder) {
      mapProps.placeholder = autoPlaceholder
    }
  }

  if (placeholder && adapter.mapPlaceholder)
    mapProps.placeholder = placeholder

  if ((startPlaceholder || endPlaceholder) && adapter.valueType === 'date' && props.type?.includes?.('range')) {
    if (startPlaceholder)
      mapProps.startPlaceholder = startPlaceholder
    if (endPlaceholder)
      mapProps.endPlaceholder = endPlaceholder
  }

  if (options && adapter.mapOptions)
    mapProps.options = options as OptionType[]

  if (disabled !== undefined || ctx.disabled !== undefined)
    mapProps.disabled = callbackParamsFunction(disabled, params) ?? ctx.disabled

  return {
    ...mapProps,
    ...props,
  }
}

function resolveSchemaError(schema: UnwrapSchema, adapter: SchemaComponentAdapter | undefined, componentProps: Recordable) {
  if (!schema.component)
    return undefined

  if (!adapter)
    return `SchemaForm: unknown component "${String(schema.component)}".`

  if (adapter.valueType === 'date' && componentProps.type && adapter.dateTypes && !adapter.dateTypes.includes(componentProps.type))
    return `SchemaForm: datePicker.type only supports ${adapter.dateTypes.join(', ')}.`
}

export function normalizeSchemaItem<TForm extends Recordable>(schema: UnwrapSchema<TForm>, ctx: NormalizeSchemaContext<TForm>): NormalizedSchema<TForm> {
  const field = schema.field as string | undefined
  const params = {
    schema,
    model: ctx.model,
    value: field ? get(ctx.model, field) : undefined,
    field,
  } as CallbackParams<TForm>

  const componentName = schema.component as ComponentsName | string | undefined
  const adapter = getSchemaComponentAdapter(componentName)
  const componentProps = resolveComponentProps(schema, adapter, ctx, params)
  const error = resolveSchemaError(schema, adapter, componentProps)
  const label = schema.label ? callbackParamsFunction(schema.label as any, params) : undefined

  return {
    raw: schema,
    model: ctx.model,
    key: field || schema.slot || schema.contentSlot || `${ctx.formId}-${ctx.index}`,
    field,
    label,
    visible: callbackParamsFunction(schema.hide, params) ?? true,
    componentName,
    component: adapter?.component,
    adapter,
    componentProps,
    formItemProps: omit(schema, FORM_ITEM_OMIT_KEYS),
    gridItemProps: normalizeGridItemProps(schema.gridItemProps || ctx.fallbackGridItemProps || ctx.schemaFormProps.gridItemProps),
    rules: resolveRules(schema, ctx.schemaFormProps),
    slot: schema.slot as string | undefined,
    contentSlot: schema.contentSlot as string | undefined,
    error,
  }
}

export function normalizeSchema<TForm extends Recordable>(schema: UnwrapSchema<TForm>[], ctx: NormalizeSchemaListContext<TForm>) {
  return schema.map((item, index) => normalizeSchemaItem(item, { ...ctx, index }))
}
