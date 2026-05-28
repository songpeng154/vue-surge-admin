<script setup lang="ts">
import type { SchemaFormContent } from '@/components/common/schema-form/components/schema-form-content/types/type'
import { useGridContext } from '@/components/common/grid/hooks/context.ts'
import SchemaFormItem from '@/components/common/schema-form/components/schema-form-item/index.vue'
import { normalizeSchema } from '@/components/common/schema-form/core/normalize'
import { useSchemaFormContext } from '@/components/common/schema-form/hooks/context.ts'

const { schema, gridProps, gridItemProps, disabled } = defineProps<SchemaFormContent>()
const emit = defineEmits<{
  overflowChange: [value: boolean]
}>()
const id = useId()
const { schemaFormProps, model } = useSchemaFormContext()!
const normalizedSchema = computed(() => normalizeSchema(schema as any, {
  schemaFormProps,
  model: model.value,
  fallbackGridItemProps: gridItemProps,
  disabled,
  formId: id,
}))

const GridOverflowObserver = defineComponent({
  setup() {
    const gridContext = useGridContext()
    if (gridContext) {
      watch(gridContext.isOverflow, value => emit('overflowChange', value), {
        immediate: true,
      })
    }
    return () => null
  },
})
</script>

<template>
  <grid v-bind="gridProps">
    <GridOverflowObserver />
    <template
      v-for="config in normalizedSchema"
      :key="config.key"
    >
      <SchemaFormItem
        v-if="config.componentName || config.contentSlot || config.slot"
        :id="id"
        :grid-item-props="gridItemProps"
        :schema="config"
        :disabled="disabled"
      >
        <slot v-if="config.contentSlot" :name="config.contentSlot" />
        <template v-if="config.slot" #[config.slot]="scope">
          <slot :name="config.slot" v-bind="scope || {}" />
        </template>
      </SchemaFormItem>
    </template>
    <slot />
  </grid>
</template>

<style scoped lang="scss">

</style>
