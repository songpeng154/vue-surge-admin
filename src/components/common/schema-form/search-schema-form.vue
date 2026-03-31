<script setup lang="ts">
import type { UnwrapSchema } from '@/components/common/schema-form/types/common.ts'
import type {
  SearchSchemaFormExpose,
  SearchSchemaFormProps,
  SearchSchemaFormSlots,
} from '@/components/common/schema-form/types/search.ts'
import { take } from 'es-toolkit'
import { useProvideSchemaFormContext } from '@/components/common/schema-form/hooks/context.ts'
import useExpose from '@/components/common/schema-form/hooks/expose.ts'
import useMethod from '@/components/common/schema-form/hooks/method.ts'
import useOmitProps from '@/hooks/common/omit-props.ts'

const props = withDefaults(defineProps<SearchSchemaFormProps>(), {
  autoPlaceholder: true,
  autoRules: true,
  autoLabelWidth: true,
  hideActionButton: false,
  showLabel: true,
  showFeedback: true,
  showRequireMark: undefined,
  labelAlign: 'right',
  labelPlacement: 'left',
  inline: true,
  submitText: '搜索',
  resetText: '重置',
  defaultDateFormat: 'yyyy-MM-dd HH:mm:ss',
  defaultTimeFormat: 'HH:mm:ss',
  defaultDateValueFormat: 'yyyy-MM-dd HH:mm:ss',
  defaultTimeValueFormat: 'HH:mm:ss',
  gridItemProps: () => ({
    span: {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 4,
    },
  }),
  gridProps: () => ({
    cols: 24,
    yGap: 12,
    responsive: 'self',
  }),
  searchShowNumber: 3,
  enableCollapsed: true,
  collapsedText: '展开',
  unCollapsedText: '收起',
})
const slots = defineSlots<SearchSchemaFormSlots>()

// 表单模型
const model = defineModel<Recordable>('model', { required: true })
const schema = defineModel<UnwrapSchema[]>('schema', { required: true })
// 是否折叠
const collapsed = defineModel<boolean>('collapsed', { default: true })

// 提供Schema上下文
useProvideSchemaFormContext(props, model)
const formProps = useOmitProps(props, ['searchShowNumber', 'schema', 'collapsed', 'enableCollapsed', 'collapsedText', 'unCollapsedText'])
const formContentSlots = useOmitProps(slots, ['customActionButton', 'buttonAfter', 'buttonBefore'])

// 通用方法
const { formRef, commonExpose } = useExpose()
const { handleReset, handleSubmit } = useMethod(props, commonExpose, model)

// 搜索Schema
const searchSchemas = computed(() => {
  if (!props.enableCollapsed || !collapsed.value)
    return schema.value
  return take(schema.value, props.searchShowNumber)
})

// 展开收起文案
const text = computed(() => ({
  text: !collapsed.value ? props.unCollapsedText : props.collapsedText,
  icon: !collapsed.value ? 'i-ic:outline-keyboard-arrow-up' : 'i-ic:outline-keyboard-arrow-down',
}))

function toggleCollapsed(isCollapsed?: boolean) {
  collapsed.value = isCollapsed || !collapsed.value
}

defineExpose<SearchSchemaFormExpose>({ ...commonExpose, toggleCollapsed })
</script>

<template>
  <schema-form-wrap
    ref="formRef"
    v-bind="formProps"
    :model="model"
  >
    <schema-form-content :schema="searchSchemas as UnwrapSchema[]" :grid-props="gridProps">
      <template v-for="(slot, key) in formContentSlots" #[key]="scope">
        <slot :name="key" v-bind="scope || {}" />
      </template>
      <grid-item
        v-if="!props.hideActionButton"
        :span="4"
        suffix
      >
        <div class="flex gap-[12px] justify-end">
          <slot name="buttonBefore" />
          <slot name="customActionButton">
            <n-button
              v-if="!hideReset"
              :loading="props.resetLoading"
              @click="handleReset"
            >
              {{ props.resetText }}
            </n-button>
            <n-button
              type="primary"
              :loading="props.submitLoading"
              @click="handleSubmit"
            >
              {{ props.submitText }}
            </n-button>
            <n-button
              v-if="props.enableCollapsed"
              type="primary"
              text
              @click="toggleCollapsed()"
            >
              <template #icon>
                <icon :icon="text.icon" />
              </template>
              {{ text.text }}
            </n-button>
          </slot>
          <slot name="buttonAfter" />
        </div>
      </grid-item>
    </schema-form-content>
  </schema-form-wrap>
</template>

<style scoped lang="scss">
:deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>
