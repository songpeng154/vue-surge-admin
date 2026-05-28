<script setup lang="tsx">
import type { GridItemProps } from '@/components/common/grid/types'
import type { SchemaFormItemProps } from '@/components/common/schema-form/components/schema-form-item/types/type.ts'
import type { CallbackParams, OptionType, Schema } from '@/components/common/schema-form/types/common.ts'
import { isString, omitBy } from 'es-toolkit'
import { isArray, isNumber } from 'es-toolkit/compat'
import { isVNode, useSlots } from 'vue'
import { useSchemaFormContext } from '@/components/common/schema-form/hooks/context.ts'
import renderIcon from '@/hooks/components/render-icon.ts'

const props = defineProps<SchemaFormItemProps>()
const slots = useSlots()
const { getModelValue, setModelValue, maxLabelWidth, itemsDataMap, schemaFormProps } = useSchemaFormContext()!
const { RenderUnoIcon } = renderIcon()
const itemEl = useCurrentElement<HTMLElement>()
const uniqueIdentifier = computed(() => props.schema.key)

const isVisible = computed(() => props.schema.visible)
const gridItemPropsMap = computed(() => {
  const item = props.schema.gridItemProps || props.gridItemProps || schemaFormProps.gridItemProps
  return (isNumber(item) ? { span: item } : item) as GridItemProps
})

const labelWidth = computed(() => {
  const raw = props.schema.raw
  if (raw.labelWidth)
    return raw.labelWidth
  if (schemaFormProps.labelWidth)
    return schemaFormProps.labelWidth
  return schemaFormProps.autoLabelWidth && maxLabelWidth.value && schemaFormProps.labelPlacement !== 'top' ? `${maxLabelWidth.value}px` : undefined
})

const shouldMeasureLabel = computed(() => Boolean(
  schemaFormProps.autoLabelWidth
  && schemaFormProps.labelPlacement !== 'top'
  && props.schema.field
  && isVisible.value
  && !props.schema.raw.labelWidth
  && !schemaFormProps.labelWidth,
))

function optionsMapCheckboxComponent(options: OptionType[]) {
  return options.map(item => (
    <n-checkbox
      value={item.value}
      disabled={item.disabled}
    >
      { item.label }
    </n-checkbox>
  ))
}

function optionsMapRadioComponent(options: OptionType[]) {
  return options.map(item => (
    <n-radio
      value={item.value}
      disabled={item.disabled}
    >
      { item.label }
    </n-radio>
  ))
}

function renderTooltip(tooltip?: string) {
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

function renderComponentSlots() {
  const raw = props.schema.raw
  const componentContent = raw.componentContent
  const isOptionsTransformCheckbox = raw.component === 'checkboxGroup' && raw.options
  const isOptionsTransformRadio = raw.component === 'radioGroup' && raw.options

  if (!componentContent && !isOptionsTransformCheckbox && !isOptionsTransformRadio)
    return undefined

  const defaultSlot = (slot: Schema['componentContent']) => ({ default: () => slot })

  if (isOptionsTransformCheckbox)
    return defaultSlot(optionsMapCheckboxComponent(raw.options!))
  if (isOptionsTransformRadio)
    return defaultSlot(optionsMapRadioComponent(raw.options!))

  const content = typeof componentContent === 'function'
    ? (componentContent as (params: CallbackParams) => any)({
        schema: raw,
        model: props.schema.model,
        value: props.schema.field ? getModelValue(props.schema.field) : undefined,
        field: props.schema.field as any,
      } as CallbackParams)
    : componentContent

  if (isArray(content) || isString(content) || isVNode(content))
    return defaultSlot(content)

  return content
}

function renderSchemaComponent() {
  const item = props.schema
  const RawComponent = item.component as any

  if (item.error) {
    console.error(item.error, item.raw)
    return <n-alert type="error" title="Schema component error">{item.error}</n-alert>
  }

  if (!RawComponent)
    return undefined

  const modelProp = item.raw.vModelBind || item.adapter?.modelProp || 'value'
  const modelBind = item.field
    ? {
        [modelProp]: getModelValue(item.field),
        [`onUpdate:${modelProp}`]: (v: any) => setModelValue(item.field!, v),
      }
    : {}

  return (
    <RawComponent
      v-slots={renderComponentSlots()}
      {...modelBind}
      {...item.componentProps}
    />
  )
}

function renderFormItemSlots() {
  const item = props.schema
  const defaultSlot = () => {
    return () => item.contentSlot ? slots.default?.() : renderSchemaComponent()
  }
  const labelSlot = () => {
    if (!item.label)
      return
    return () => (
      <>
        { item.label }
        { item.raw.tooltip ? renderTooltip(item.raw.tooltip) : undefined }
      </>
    )
  }

  return omitBy(
    {
      default: defaultSlot(),
      label: labelSlot(),
    },
    value => value === undefined,
  )
}

function FormItem() {
  return (
    <n-form-item
      feedback-class="feedback"
      {...props.schema.formItemProps}
      rule={props.schema.rules}
      path={props.schema.field}
      label-width={labelWidth.value}
      v-slots={renderFormItemSlots()}
    />
  )
}

let stopLabelResize: (() => void) | undefined
let activeLabelKey: string | undefined
let activeItemKey: string | undefined

function clearItemData() {
  if (activeItemKey)
    itemsDataMap.delete(activeItemKey)
  activeItemKey = undefined
}

function setItemData(labelWidth?: number) {
  if (!itemEl.value || !props.schema.field || !isVisible.value) {
    clearItemData()
    return
  }
  const key = uniqueIdentifier.value
  if (activeItemKey && activeItemKey !== key)
    itemsDataMap.delete(activeItemKey)
  const current = itemsDataMap.get(key)
  itemsDataMap.set(key, {
    el: itemEl.value,
    field: props.schema.field,
    labelWidth: labelWidth ?? current?.labelWidth,
  })
  activeItemKey = key
}

function clearLabelMeasure() {
  stopLabelResize?.()
  stopLabelResize = undefined
  if (activeLabelKey) {
    const current = itemsDataMap.get(activeLabelKey)
    if (current)
      itemsDataMap.set(activeLabelKey, { ...current, labelWidth: 0 })
  }
  activeLabelKey = undefined
}

function setLabelWidth(label: HTMLElement) {
  if (!itemEl.value || !props.schema.field || !activeLabelKey)
    return
  const previousWidth = label.style.width
  label.style.width = 'auto'
  const labelText = label.querySelector<HTMLElement>('.n-form-item-label__text')
  const labelTextWidth = labelText?.scrollWidth ?? 0
  const labelWidth = Math.max(label.scrollWidth, labelTextWidth)
  label.style.width = previousWidth
  setItemData(Math.ceil(labelWidth))
}

watch([itemEl, () => props.schema.field, isVisible], () => {
  setItemData()
}, { flush: 'post', immediate: true })

watch([itemEl, () => props.schema.label, shouldMeasureLabel], async () => {
  clearLabelMeasure()
  if (!shouldMeasureLabel.value)
    return
  await nextTick()
  if (!itemEl.value)
    return
  const label = itemEl.value.querySelector<HTMLElement>('.n-form-item-label')
  if (!label)
    return
  activeLabelKey = uniqueIdentifier.value
  setLabelWidth(label)

  if (typeof ResizeObserver === 'undefined')
    return
  const observer = new ResizeObserver(() => setLabelWidth(label))
  observer.observe(label)
  stopLabelResize = () => observer.disconnect()
}, { flush: 'post' })

onUnmounted(() => {
  clearLabelMeasure()
  clearItemData()
})
</script>

<template>
  <grid-item v-if="isVisible" v-bind="gridItemPropsMap">
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
