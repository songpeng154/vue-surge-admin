<script setup lang="ts">
import type { GridProps } from '@/components/common/grid/types'
import type {
  GroupSchemaFormExpose,
  GroupSchemaFormProps,
  GroupSchemaFormSlots,
  UnwrapGroupSchema,
} from '@/components/common/schema-form/types/group.ts'
import { isBoolean, isFunction } from 'es-toolkit'
import { useProvideSchemaFormContext } from '@/components/common/schema-form/hooks/context.ts'
import useExpose from '@/components/common/schema-form/hooks/expose.ts'
import useMethod from '@/components/common/schema-form/hooks/method.ts'
import useOmitProps from '@/hooks/common/omit-props.ts'

const props = withDefaults(defineProps<GroupSchemaFormProps>(), {
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
  collapsedText: '展开',
  unCollapsedText: '收起',
  defaultCollapsed: true,
  defaultNotCollapsedRows: 2,
})
const slots = defineSlots<GroupSchemaFormSlots>()

// 表单模型
const model = defineModel<Recordable>('model', { required: true })
const schema = defineModel<UnwrapGroupSchema[]>('schema', { required: true })

// 提供Schema上下文
useProvideSchemaFormContext(props, model)
const formProps = useOmitProps(props, ['schema'])
const formContentSlots = useOmitProps(slots, ['customActionButton', 'buttonAfter', 'buttonBefore', 'groupTitle', 'collapsedButton'])
// 通用的导出方法
const { formRef, commonExpose } = useExpose()
// 通用方法
const { handleReset, handleSubmit } = useMethod(props, commonExpose, model)

const groupSchema = ref<UnwrapGroupSchema[]>([])

function handleGroupHide(config: UnwrapGroupSchema) {
  let isHide = true
  if (isBoolean(config.hide))
    isHide = !config.hide
  if (isFunction(config.hide))
    isHide = !config.hide({ group: config, model: model.value })
  return isHide
}

// 展开收起文案
function getGroupExpandCollapseText(config: UnwrapGroupSchema) {
  return {
    text: config.collapsed ?? props.defaultCollapsed ? props.collapsedText : props.unCollapsedText,
    icon: config.collapsed ?? props.defaultCollapsed ? 'i-ic:outline-keyboard-arrow-down' : 'i-ic:outline-keyboard-arrow-up',
  }
}

function toggleCollapse(config: UnwrapGroupSchema, isCollapsed?: boolean) {
  config.collapsed = isCollapsed ?? !config.collapsed
}

function toggleCollapseByIndex(index: number, isCollapsed?: boolean) {
  toggleCollapse(groupSchema.value[index], isCollapsed)
}

function handleGridPropsMap(config: UnwrapGroupSchema): GridProps {
  const gridProps = props.gridProps || config.gridProps
  return {
    ...gridProps,
    collapsed: config.collapsed,
    notCollapsedRows: config.notCollapsedRows,
  }
}

watchEffect(() => {
  groupSchema.value = schema.value.map((item) => {
    item.collapsed = item.collapsed ?? props.defaultCollapsed
    item.notCollapsedRows = item.notCollapsedRows || props.defaultNotCollapsedRows
    return item
  })
})

defineExpose<GroupSchemaFormExpose>({
  ...commonExpose,
  toggleCollapsed: toggleCollapseByIndex,
})
</script>

<template>
  <schema-form-wrap
    ref="formRef"
    v-bind="formProps"
    :model="model"
  >
    <template v-for="(config, i) in groupSchema" :key="i">
      <template v-if="handleGroupHide">
        <div class="schemaForm-groupHeader">
          <div class="schemaForm-groupHeader-title">
            <slot name="groupTitle" :config="config">
              <span class="schemaForm-groupHeader-title-placeholder" />
              <span class="schemaForm-groupHeader-title-name">{{ config.title }}</span>
            </slot>
            <n-tooltip v-if="config.helpMessage" trigger="hover">
              <template #trigger>
                <icon
                  icon="i-ant-design:question-circle-outlined"
                  class="text-tertiary"
                  size="14ox"
                />
              </template>
              {{ config.helpMessage }}
            </n-tooltip>
          </div>
          <slot
            name="collapsedButton"
            :config="config"
            :toggle-collapsed="toggleCollapse"
          >
            <n-button
              v-if="!config.isHidCollapseButton"
              :disabled="false"
              text
              type="primary"
              @click="toggleCollapse(config)"
            >
              <template #icon>
                <icon :icon="getGroupExpandCollapseText(config).icon" />
              </template>
              {{ getGroupExpandCollapseText(config).text }}
            </n-button>
          </slot>
        </div>
        <schema-form-content
          class="px-5px"
          :schema="config.form"
          :disabled="config.disabled"
          :grid-item-props="config.gridItemProps"
          :grid-props="handleGridPropsMap(config)"
        >
          <template v-for="(slot, key) in formContentSlots" #[key]="scope">
            <slot :name="key" v-bind="scope || {}" />
          </template>
        </schema-form-content>
      </template>
    </template>
    <n-flex
      v-if="!props.hideActionButton"
      :span="24"
      justify="end"
      align="middle"
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
  </schema-form-wrap>
</template>

<style scoped lang="scss">
.schemaForm-groupHeader {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 5px 10px;
  background: theme('colors.primaryShallow');
  border-radius: theme('borderRadius.md');

  &-title {
    display: inline-flex;
    align-items: center;
    line-height: 20px;
    gap: 7px;

    &-placeholder {
      display: inline-block;
      height: 25px;
      width: 4px;
      background: theme('colors.primary');
      border-radius: theme('borderRadius.md');
      flex-shrink: 0;
    }

    &-name {
      font-size: 15px;
      font-weight: 500;
      position: relative;
      letter-spacing: 1px;
    }
  }
}
</style>
