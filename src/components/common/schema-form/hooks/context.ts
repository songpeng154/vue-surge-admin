import type { ModelRef } from 'vue'
import type { SchemaFormCommonProps, SchemaItemData } from '@/components/common/schema-form/types/common.ts'
import { createInjectionState } from '@vueuse/core'
import { get, set } from 'es-toolkit/compat'

const [useProvideSchemaFormContext, useSchemaFormContext] = createInjectionState((schemaFormProps: SchemaFormCommonProps, model: ModelRef<Recordable>) => {
  const itemsDataMap = reactive<Map<string, SchemaItemData>>(new Map())

  const maxLabelWidth = computed(() => Math.max(...Array.from(itemsDataMap.values(), value => value.labelWidth)))

  // 获取model值
  const getModelValue = (field: string) => get(model.value, field)

  // 设置model值
  const setModelValue = (field: string, value: any) => set(model.value, field, value)

  return { schemaFormProps, model, getModelValue, setModelValue, maxLabelWidth, itemsDataMap }
})

export { useProvideSchemaFormContext, useSchemaFormContext }
