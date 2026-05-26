<script setup lang="tsx">
import type { GridItemProps } from '@/components/common/grid/types'
import type { SchemaFormItemProps } from '@/components/common/schema-form/components/schema-form-item/types/type.ts'
import type {
  CallbackParams,
  CallbackParamsFunction,
  OptionType,
  Schema,
  UnwrapSchema,
} from '@/components/common/schema-form/types/common.ts'
import { isFunction, isString, isUndefined, omitBy } from 'es-toolkit'
import { get, isArray, isNumber } from 'es-toolkit/compat'
import { computed, isVNode, useSlots } from 'vue'
import { useSchemaFormContext } from '@/components/common/schema-form/hooks/context.ts'
import {
  componentFunction,
  generatePlaceholder,
  generateRule,
  handleRulePresets,
} from '@/components/common/schema-form/utils'
import { SCHEMA_RENDER_COMPONENTS } from '@/components/common/schema-form/utils/components'
import elementIndex from '@/hooks/common/element-index.ts'
import useOmitProps from '@/hooks/common/omit-props.ts'
import renderIcon from '@/hooks/components/render-icon.ts'

const props = defineProps<SchemaFormItemProps>()
const schema = defineModel<UnwrapSchema>('schema', { required: true })

const slots = useSlots()
const { schemaFormProps, model, getModelValue, setModelValue, maxLabelWidth, itemsDataMap } = useSchemaFormContext()!
const { RenderUnoIcon } = renderIcon()
const itemEl = useCurrentElement<HTMLElement>()
const index = elementIndex(itemEl)

// 鍞竴鏍囪瘑
const uniqueIdentifier = computed(() => `${props.id}-${index.value}`)

// 鍥炶皟鍙傛暟
const callbackParams = computed(() => ({
  schema: schema.value,
  model: model.value,
  value: schema.value.field ? get(model.value, schema.value.field) : undefined,
  field: schema.value.field,
}) as CallbackParams)

const isHide = computed(() => callbackParamsFunction<boolean | undefined>(schema.value.hide) ?? true)

const gridItemPropsMap = computed(() => {
  const item = schema.value.gridItemProps || props.gridItemProps || schemaFormProps.gridItemProps
  return (isNumber(item) ? { span: item } : item) as GridItemProps
})

// 鎵ц鍥炶皟鍑芥暟骞惰繑鍥炲師鍊?
function callbackParamsFunction<T = never>(value: T | CallbackParamsFunction<any, any, T>) {
  return isFunction(value)
    ? value(callbackParams.value)
    : value
}

const FormItem = defineComponent(() => {
  const formItemProps = useOmitProps(schema.value, [
    'field',
    'component',
    'label',
    'componentProps',
    'componentContent',
    'hide',
    'rule',
    'tooltip',
    'gridItemProps',
    'contentSlot',
    'slot',
  ])

  // formItem rule
  const formItemRules = computed(() => {
    const rule = schema.value.rule
    if (!rule) {
      const isRequire = Boolean(schema.value.showRequireMark ?? schemaFormProps.showRequireMark)
      const isAutoRules = Boolean(schemaFormProps.autoRules && isRequire && schema.value.component && isString(schema.value.label))

      return isAutoRules ? generateRule(schema.value.label as string, schema.value.component!) : undefined
    }
    // 澶勭悊瑙勫垯棰勮
    if (typeof rule === 'string')
      return handleRulePresets(rule)
    return rule
  })

  const DynamicComponent = computed(() => schema.value.component ? SCHEMA_RENDER_COMPONENTS[schema.value.component] : undefined)

  // 鍔ㄦ€佺粍浠跺睘鎬?
  const dynamicComponentAttribute = computed<Recordable>(() => {
    const { component, componentProps, placeholder, startPlaceholder, endPlaceholder, options, disabled } = schema.value

    if (!component)
      return {}

    const { isDateComponent, isTimeComponent, isMapPlaceholder, isMapOptions } = componentFunction[component] ?? {}

    // 闇€瑕佹槧灏勭殑Props
    const mapProps: Recordable = {}

    // 澶勭悊榛樿鏃ユ湡鏍煎紡
    if (isDateComponent) {
      mapProps.format = schemaFormProps.defaultDateFormat
      mapProps.valueFormat = schemaFormProps.defaultDateValueFormat
    }

    // 澶勭悊榛樿鏃堕棿鏍煎紡
    if (isTimeComponent) {
      mapProps.format = schemaFormProps.defaultTimeFormat
      mapProps.valueFormat = schemaFormProps.defaultTimeValueFormat
    }

    // 澶勭悊鑷姩鐢熸垚Placeholder
    if (schemaFormProps.autoPlaceholder && isString(schema.value.label)) {
      const placeholder = generatePlaceholder(schema.value.label, component, (componentProps as Recordable)?.type)
      if (isArray(placeholder)) {
        mapProps.startPlaceholder = placeholder[0]
        mapProps.endPlaceholder = placeholder[1]
      }
      else {
        mapProps.placeholder = placeholder
      }
    }

    // 鏄犲皠placeholder
    if (placeholder && isMapPlaceholder)
      mapProps.placeholder = placeholder

    // 鏄犲皠鏃ユ湡鑼冨洿placeholder
    if (
      (startPlaceholder || endPlaceholder)
      && isDateComponent
      && (componentProps as Recordable)?.type.includes('range')
    ) {
      if (startPlaceholder)
        mapProps.startPlaceholder = startPlaceholder
      if (endPlaceholder)
        mapProps.endPlaceholder = endPlaceholder
    }

    // 鏄犲皠 options
    if (options && isMapOptions)
      mapProps.options = options

    // 绂佺敤
    if (disabled !== undefined || props.disabled !== undefined)
      mapProps.disabled = callbackParamsFunction(disabled) ?? props.disabled

    return {
      ...mapProps,
      ...componentProps,
    }
  })

  // 娓叉煋鍔ㄦ€佺粍浠?
  const renderComponent = () => {
    const component = schema.value.component
    if (!component)
      return
    if (!DynamicComponent.value) {
      const message = `SchemaForm: unknown component "${component}".`
      console.error(message, schema.value)
      return <n-alert type="error" title="Schema component error">{message}</n-alert>
    }

    const { isCheckedBind } = componentFunction[component] ?? {}

    const bindType = schema.value?.vModelBind ? schema.value?.vModelBind : isCheckedBind ? 'checked' : 'value'

    const modelBind = {
      [bindType]: getModelValue(schema.value.field as string),
      [`onUpdate:${bindType}`]: v => setModelValue(schema.value.field as string, v),
    }

    // 閫夐」鏄犲皠 checkbox 缁勪欢
    const optionsMapCheckboxComponent = (options: OptionType[]) => {
      return options.map(item => (
        <n-checkbox
          value={item.value}
          disabled={item.disabled}
        >
          { item.label }
        </n-checkbox>
      ))
    }

    // 閫夐」鏄犲皠 radio 缁勪欢
    const optionsMapRadioComponent = (options: OptionType[]) => {
      return options.map(item => (
        <n-radio
          value={item.value}
          disabled={item.disabled}
        >
          { item.label }
        </n-radio>
      ))
    }

    // 鍔ㄦ€佺粍浠舵彃妲?
    const dynamicComponentSlots = () => {
      const componentContent = schema.value.componentContent
      const isOptionsTransformCheckbox = schema.value.component === 'checkboxGroup' && schema.value.options
      const isOptionsTransformRadio = schema.value.component === 'radioGroup' && schema.value.options

      if (!componentContent && !isOptionsTransformCheckbox && !isOptionsTransformRadio)
        return undefined

      const defaultSlot = (slot: Schema['componentContent']) => ({ default: () => slot })

      // 鏄惁鏄犲皠 checkbox 缁勪欢
      if (isOptionsTransformCheckbox)
        return defaultSlot(optionsMapCheckboxComponent(schema.value.options!))
      // 鏄惁鏄犲皠 radio 缁勪欢
      if (isOptionsTransformRadio)
        return defaultSlot(optionsMapRadioComponent(schema.value.options!))

      // 缁勪欢榛樿鎻掓Ы鍐呭
      const content = callbackParamsFunction(componentContent)

      if (isArray(content) || isString(content) || isVNode(content))
        return defaultSlot(content)

      return content
    }

    return (
      <DynamicComponent.value
        v-slots={dynamicComponentSlots()}
        {...modelBind}
        {...dynamicComponentAttribute.value}
      >
      </DynamicComponent.value>
    )
  }

  const renderTooltip = (tooltip?: string) => {
    return (
      <n-tooltip>
        { {
          default: () => tooltip,
          trigger: () => RenderUnoIcon('i-ic:outline-help', {
            class: 'ml-5px mb-4px',
          }),
        } }
      </n-tooltip>
    )
  }

  const renderFormItemSlots = () => {
    // 澶勭悊榛樿鎻掓Ы
    const defaultSlot = () => {
      return () => schema.value.contentSlot ? slots.default?.() : renderComponent()
    }
    // 澶勭悊label
    const labelSlot = () => {
      if (!schema.value.label)
        return
      const label = callbackParamsFunction(schema.value.label)
      return () => (
        <>
          { label }
          { schema.value.tooltip ? renderTooltip(schema.value.tooltip) : undefined }
        </>
      )
    }

    return omitBy(
      {
        default: defaultSlot(),
        label: labelSlot(),
      },
      isUndefined,
    )
  }

  const labelWidth = computed(() => {
    if (schema.value.labelWidth)
      return schema.value.labelWidth
    if (schemaFormProps.labelWidth)
      return schemaFormProps.labelWidth
    return schemaFormProps.autoLabelWidth && maxLabelWidth.value && schemaFormProps.labelPlacement !== 'top' ? `${maxLabelWidth.value}px` : undefined
  })
  return () => (
    <n-form-item
      feedback-class="feedback"
      {...formItemProps.value}
      rule={formItemRules.value}
      path={schema.value.field}
      label-style={{ minWidth: labelWidth.value }}
      label-width={undefined}
      v-slots={renderFormItemSlots()}
    />
  )
})

// 娣诲姞 item label width
watch([itemEl, () => schema.value.label], async () => {
  await nextTick()
  if (!itemEl.value || index.value === -1 || props.id === undefined)
    return
  const label = itemEl.value.querySelector('.n-form-item-label')
  if (!label || !schema.value.field)
    return
  itemsDataMap.set(uniqueIdentifier.value, {
    el: itemEl.value,
    field: schema.value.field as string,
    labelWidth: label.clientWidth,
  })
})

onUnmounted(() => {
  // 鍒犻櫎 item
  itemsDataMap.delete(uniqueIdentifier.value)
})
</script>

<template>
  <grid-item v-if="isHide" v-bind="gridItemPropsMap">
    <FormItem v-if="!schema.slot" />
    <slot v-else :name="schema.slot" />
  </grid-item>
</template>

<style scoped lang="scss">
:deep(.n-input-number), :deep(.n-time-picker), :deep(.n-date-picker) {
  width: 100%;
}

:deep(.feedback) {
  min-height: 20px;
  height: 20px;
  font-size: 12px;
  padding-top: 2px !important;
}

:deep(.n-form-item-label__text) {
  white-space: nowrap; /* 闃叉鏂囨湰鎹㈣ */
  overflow: hidden; /* 瓒呭嚭閮ㄥ垎闅愯棌 */
  text-overflow: ellipsis; /* 婧㈠嚭鐨勬枃鏈樉绀虹渷鐣ュ彿 */
}
</style>
