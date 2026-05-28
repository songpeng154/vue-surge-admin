<script setup lang="ts">
import type { UnwrapSchema } from '@/components/common/schema-form/types/common.ts'
import type {
  PopupSchemaFormExpose,
  PopupSchemaFormProps,
  PopupSchemaFormSlots,
} from '@/components/common/schema-form/types/popup.ts'
import SchemaFormActions from '@/components/common/schema-form/components/schema-form-actions.vue'
import { exposeSchemaForm, useSchemaFormController } from '@/components/common/schema-form/core/controller'

const props = withDefaults(defineProps<PopupSchemaFormProps>(), {
  autoPlaceholder: true,
  autoRequiredRule: true,
  autoLabelWidth: true,
  scrollToFirstError: true,
  showActions: true,
  showLabel: true,
  showFeedback: true,
  showRequireMark: undefined,
  labelOverflowOmitted: false,
  labelPlacement: 'top',
  submitText: '提交',
  resetText: '重置',
  defaultDateFormat: 'yyyy-MM-dd HH:mm:ss',
  defaultTimeFormat: 'HH:mm:ss',
  defaultDateValueFormat: 'yyyy-MM-dd HH:mm:ss',
  defaultTimeValueFormat: 'HH:mm:ss',
  gridProps: () => ({
    cols: 24,
    yGap: 12,
  }),
  gridItemProps: 24,
  popupType: 'drawer',
  maskClosable: true,
  closeResetModel: true,
  closeConfirm: true,
  confirmTitle: '关闭提示',
  confirmContent: '您确定要关闭它吗？',
  drawerContentProps: () => ({ closable: true }),
  colProps: 24,
})

const slots = defineSlots<PopupSchemaFormSlots>()

const drawerDefaultWidth = '500px'
const modalDefaultWidth = '800px'
const modalDefaultHeight = '70vh'

const model = defineModel<Recordable>('model', { required: true })
const schema = defineModel<UnwrapSchema[]>('schema', { required: true })
const visible = defineModel<boolean>('visible', { required: true })

const [DefineActionButton, ActionButton] = createReusableTemplate()
const [DefineForm, Form] = createReusableTemplate()

const { formRef, commonExpose, formProps, formContentSlots } = useSchemaFormController(props, model, slots, {
  omitFormProps: [
    'schema',
    'visible',
    'popupType',
    'title',
    'width',
    'height',
    'drawerProps',
    'drawerContentProps',
    'modalProps',
    'modalCardProps',
    'maskClosable',
    'closeResetModel',
    'closeConfirm',
    'confirmTitle',
    'confirmContent',
  ],
  omitContentSlots: ['actions', 'actionsAfter', 'actionsBefore', 'popupHeader', 'popupFormBefore', 'popupFormAfter', 'popupFooter'],
})

const dialog = useDialog()

function closeAndReset() {
  props.closeResetModel && commonExpose.resetFields()
  visible.value = false
}

function showConfirmModal() {
  dialog.warning({
    title: props.confirmTitle,
    content: props.confirmContent,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      closeAndReset()
    },
    onNegativeClick: () => {},
  })
}

function onUpdateShow(isShow: boolean) {
  if (isShow)
    return
  if (props.closeConfirm)
    return showConfirmModal()
  closeAndReset()
}

defineExpose<PopupSchemaFormExpose>(exposeSchemaForm<PopupSchemaFormExpose>(commonExpose))
</script>

<template>
  <DefineActionButton>
    <SchemaFormActions
      v-model:model="model"
      :form-props="props"
      :expose="commonExpose"
    >
      <template #actionsBefore>
        <slot name="actionsBefore" />
      </template>
      <template v-if="$slots.actions" #actions>
        <slot name="actions" />
      </template>
      <template #actionsAfter>
        <slot name="actionsAfter" />
      </template>
    </SchemaFormActions>
  </DefineActionButton>

  <DefineForm>
    <schema-form-wrap
      ref="formRef"
      v-bind="formProps"
      :model="model"
    >
      <schema-form-content :schema="schema" :grid-props="gridProps">
        <template v-for="(slot, key) in formContentSlots" #[key]="scope">
          <slot :name="key" v-bind="scope || {}" />
        </template>
      </schema-form-content>
    </schema-form-wrap>
  </DefineForm>

  <n-drawer
    v-if="props.popupType === 'drawer'"
    :width="props.width || drawerDefaultWidth"
    :height="props.height"
    v-bind="props.drawerProps"
    :show="visible"
    :mask-closable="props.maskClosable"
    @update:show="onUpdateShow"
  >
    <n-drawer-content v-bind="props.drawerContentProps">
      <template #header>
        <slot name="popupHeader">
          {{ props.title || props.drawerContentProps?.title }}
        </slot>
      </template>
      <slot name="popupFormBefore" />
      <Form />
      <slot name="popupFormAfter" />
      <template #footer>
        <slot name="popupFooter">
          <ActionButton />
        </slot>
      </template>
    </n-drawer-content>
  </n-drawer>

  <n-modal
    v-else-if="props.popupType === 'modal'"
    v-bind="props.modalProps"
    :show="visible"
    :mask-closable="props.maskClosable"
    @update:show="onUpdateShow"
  >
    <n-card
      :style="{ width: props.width || modalDefaultWidth, height: props.height || modalDefaultHeight }"
      content-class="overflow-auto"
      v-bind="props.modalCardProps"
    >
      <template #header>
        <slot name="popupHeader">
          {{ props.title || props.modalCardProps?.title }}
        </slot>
      </template>
      <slot name="popupFormBefore" />
      <Form />
      <slot name="popupFormAfter" />
      <template #footer>
        <slot name="popupFooter">
          <ActionButton />
        </slot>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped lang="scss">
</style>
