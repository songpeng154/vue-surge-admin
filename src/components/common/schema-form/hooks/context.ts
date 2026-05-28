import type { ModelRef } from 'vue'
import type { SchemaFormCommonProps, SchemaItemData } from '@/components/common/schema-form/types/common.ts'
import { createInjectionState } from '@vueuse/core'
import { get, set } from 'es-toolkit/compat'

const [useProvideSchemaFormContext, useSchemaFormContext] = createInjectionState((schemaFormProps: SchemaFormCommonProps, model: ModelRef<Recordable>) => {
  const itemsDataMap = reactive<Map<string, SchemaItemData>>(new Map())

  const maxLabelWidth = computed(() => {
    const widths = Array.from(itemsDataMap.values())
      .map(value => value.labelWidth)
      .filter((value): value is number => typeof value === 'number' && value > 0)
    return widths.length ? Math.max(...widths) : 0
  })

  // 获取model值
  const getModelValue = (field: string) => get(model.value, field)

  // 设置model值
  const setModelValue = (field: string, value: any) => set(model.value, field, value)

  return { schemaFormProps, model, getModelValue, setModelValue, maxLabelWidth, itemsDataMap }
})

export { useProvideSchemaFormContext, useSchemaFormContext }
