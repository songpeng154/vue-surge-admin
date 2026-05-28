<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import type { SchemaFormCommonExpose, SchemaFormCommonProps } from '@/components/common/schema-form/types/common.ts'
import { useSchemaFormExposeController } from '@/components/common/schema-form/core/form-expose'
import { useSchemaFormContext } from '@/components/common/schema-form/hooks/context.ts'
import useOmitProps from '@/hooks/common/omit-props.ts'

const props = defineProps<SchemaFormCommonProps>()
const { model } = useSchemaFormContext()!

const nFormProps = useOmitProps(props, [
  'formClass',
  'formStyle',
  'model',
  'gridItemProps',
  'gridProps',
  'showActions',
  'defaultDateFormat',
  'defaultTimeFormat',
  'defaultDateValueFormat',
  'defaultTimeValueFormat',
  'autoPlaceholder',
  'autoRequiredRule',
  'autoLabelWidth',
  'scrollToFirstError',
  'submitLoading',
  'submitText',
  'resetLoading',
  'resetText',
  'hideReset',
  'onSubmit',
  'onFinish',
  'onFinishFailed',
  'onReset',
  'onResetAfter',
])

const formRef = ref<FormInst>()
const commonExpose = useSchemaFormExposeController({ props, formRef })

defineExpose<SchemaFormCommonExpose>(commonExpose)
</script>

<template>
  <n-form
    ref="formRef"
    :class="formClass"
    :style="props.formStyle"
    v-bind="nFormProps"
    :model="model"
  >
    <slot />
  </n-form>
</template>

<style scoped lang="scss">

</style>
