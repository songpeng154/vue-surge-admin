<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import type { FormValidateCallback, ShouldRuleBeApplied } from 'naive-ui/es/form/src/interface'
import type { SchemaFormCommonExpose, SchemaFormCommonProps } from '@/components/common/schema-form/types/common.ts'
import { cloneDeep } from 'es-toolkit'
import { useSchemaFormContext } from '@/components/common/schema-form/hooks/context.ts'
import useOmitProps from '@/hooks/common/omit-props.ts'
import { scrollToElement } from '@/utils'

const props = defineProps<SchemaFormCommonProps>()
const { model, itemsDataMap } = useSchemaFormContext()!

const nFormProps = useOmitProps(props, [
  'formClass',
  'formStyle',
  'model',
  'gridItemProps',
  'gridProps',
  'hideActionButton',
  'defaultDateFormat',
  'defaultTimeFormat',
  'defaultDateValueFormat',
  'defaultTimeValueFormat',
  'autoPlaceholder',
  'autoRules',
  'autoLabelWidth',
  'autoScrollToFailField',
  'submitLoading',
  'submitText',
  'resetLoading',
  'resetText',
  'hideReset',
  'onSubmit',
  'onFinish',
  'onFinishFailed',
  'onReset',
])

const commonExpose: SchemaFormCommonExpose = {} as SchemaFormCommonExpose
const initModel = cloneDeep(model.value)
const formRef = ref<FormInst>()
function setExpose() {
  if (!formRef.value)
    return
  commonExpose.validate = async (callback?: FormValidateCallback, shouldRuleBeApplied?: ShouldRuleBeApplied) => {
    return formRef.value!.validate((errors, extra) => {
      callback?.(errors, extra)
      if (props.autoScrollToFailField) {
        // 第一个校验未通过的字段
        const firstVerificationFailedField = errors?.[0]?.[0]?.field
        // 滚动第一个校验未通过的字段
        firstVerificationFailedField && commonExpose.scrollToField(firstVerificationFailedField)
      }
    }, shouldRuleBeApplied)
  }

  commonExpose.restoreValidation = formRef.value.restoreValidation

  commonExpose.resetFields = () => {
    model.value = cloneDeep(initModel)
    commonExpose.restoreValidation()
  }

  commonExpose.scrollToField = (field: string) => {
    const item = [...itemsDataMap.values()].find(item => item.field === field)
    if (!item)
      return console.error(`未找到该${field}对应的item`)
    scrollToElement(item?.el)
  }
}

onMounted(() => {
  setExpose()
})

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
