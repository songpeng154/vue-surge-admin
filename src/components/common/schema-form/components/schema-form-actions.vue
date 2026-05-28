<script setup lang="ts">
import type { SchemaFormCommonExpose, SchemaFormCommonProps } from '@/components/common/schema-form/types/common.ts'

const props = defineProps<{
  formProps: SchemaFormCommonProps
  expose: SchemaFormCommonExpose
  justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  actionClass?: string
}>()

const model = defineModel<Recordable>('model', { required: true })

function handleSubmit() {
  if (props.formProps.onSubmit) {
    props.formProps.onSubmit(props.expose.validate, model.value)
  }
  else {
    props.expose.validate()
      .then(() => props.formProps.onFinish?.(model.value))
      .catch(err => props.formProps.onFinishFailed?.(err))
  }
}

function handleReset() {
  if (props.formProps.onReset) {
    props.formProps.onReset(props.expose.resetFields, model.value)
  }
  else {
    props.expose.resetFields()
  }
  props.formProps.onResetAfter?.(model.value)
}
</script>

<template>
  <n-flex
    v-if="formProps.showActions"
    :class="actionClass"
    :justify="justify || 'end'"
    align="center"
    gap="12"
  >
    <slot name="actionsBefore" />
    <slot name="actions">
      <n-button
        v-if="!formProps.hideReset"
        :loading="formProps.resetLoading"
        @click="handleReset"
      >
        {{ formProps.resetText }}
      </n-button>
      <n-button
        type="primary"
        :loading="formProps.submitLoading"
        @click="handleSubmit"
      >
        {{ formProps.submitText }}
      </n-button>
      <slot name="extra" />
    </slot>
    <slot name="actionsAfter" />
  </n-flex>
</template>
