<script setup lang="ts">
import type { UnwrapSchema } from '@/components/common/schema-form/types/common.ts'
import type {
  PopupSchemaFormExpose,
  PopupSchemaFormProps,
  PopupSchemaFormSlots,
} from '@/components/common/schema-form/types/popup.ts'
import { useProvideSchemaFormContext } from '@/components/common/schema-form/hooks/context.ts'
import useExpose from '@/components/common/schema-form/hooks/expose.ts'
import useMethod from '@/components/common/schema-form/hooks/method.ts'
import useOmitProps from '@/hooks/common/omit-props.ts'

const props = withDefaults(defineProps<PopupSchemaFormProps>(), {
  autoPlaceholder: true,
  autoRules: true,
  autoLabelWidth: true,
  autoScrollToFailField: true,
  hideActionButton: false,
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

// 表单模型
const model = defineModel<Recordable>('model', { required: true })
const schema = defineModel<UnwrapSchema[]>('schema', { required: true })
const visible = defineModel<boolean>('visible', { required: true })

const [DefineActionButton, ActionButton] = createReusableTemplate()
const [DefineForm, Form] = createReusableTemplate()

// 提供Schema上下文
useProvideSchemaFormContext(props, model)
const formProps = useOmitProps(props, [
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
])
const formContentSlots = useOmitProps(slots, ['customActionButton', 'buttonAfter', 'buttonBefore', 'popupHeader', 'popupFormBefore', 'popupFormAfter', 'popupFooter'])
// 通用方法
const { formRef, commonExpose } = useExpose()
const { handleReset, handleSubmit } = useMethod(props, commonExpose, model)
const dialog = useDialog()
// 关闭弹框并重置表单
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
    onNegativeClick: () => {
    },
  })
}

function onUpdateShow(isShow: boolean) {
  if (isShow)
    return
  if (props.closeConfirm)
    return showConfirmModal()
  closeAndReset()
}

defineExpose<PopupSchemaFormExpose>(commonExpose)
</script>

<template>
  <!-- 操作按钮 -->
  <DefineActionButton>
    <n-flex
      v-if="!props.hideActionButton"
      justify="flex-end"
      align="center"
      gap="12"
    >
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
      </slot>
      <slot name="buttonAfter" />
    </n-flex>
  </DefineActionButton>
  <!-- 表单 -->
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

  <!-- 抽屉 -->
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

  <!-- 模态框 -->
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
