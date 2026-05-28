<script setup lang="ts">
import type { GridProps } from '@/components/common/grid/types'
import type {
  GroupCallbackSchema,
  GroupSchemaFormExpose,
  GroupSchemaFormProps,
  GroupSchemaFormSlots,
  RuntimeGroupSchema,
  UnwrapGroupSchema,
} from '@/components/common/schema-form/types/group.ts'
import { isBoolean, isFunction } from 'es-toolkit'
import SchemaFormActions from '@/components/common/schema-form/components/schema-form-actions.vue'
import { exposeSchemaForm, useSchemaFormController } from '@/components/common/schema-form/core/controller'

const props = withDefaults(defineProps<GroupSchemaFormProps>(), {
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
  collapsedText: '展开',
  expandedText: '收起',
  defaultCollapsed: true,
  defaultCollapsedRows: 2,
})
const slots = defineSlots<GroupSchemaFormSlots>()

const model = defineModel<Recordable>('model', { required: true })
const schema = defineModel<UnwrapGroupSchema[]>('schema', { required: true })

const { formRef, commonExpose, formProps, formContentSlots } = useSchemaFormController(props, model, slots, {
  omitFormProps: ['schema'],
  omitContentSlots: ['actions', 'actionsAfter', 'actionsBefore', 'groupTitle', 'collapsedButton'],
})

const groupState = reactive(new Map<string, { collapsed: boolean }>())
const groupOverflowMap = reactive(new Map<string, boolean>())

function getGroupKey(config: UnwrapGroupSchema, index: number) {
  return `${String(config.title || 'group')}-${index}`
}

function createRuntimeGroupSchema(item: UnwrapGroupSchema, index: number): RuntimeGroupSchema {
  const key = getGroupKey(item, index)
  const state = groupState.get(key)
  const collapsed = state?.collapsed ?? item.collapsed ?? props.defaultCollapsed
  return {
    key,
    title: item.title,
    helpMessage: item.helpMessage,
    hide: item.hide,
    form: item.form,
    collapsed,
    collapsedRows: item.collapsedRows ?? props.defaultCollapsedRows,
    hideCollapseButton: item.hideCollapseButton,
    disabled: item.disabled,
    gridItemProps: item.gridItemProps,
    gridProps: item.gridProps,
  }
}

function createGroupCallbackSchema(config: RuntimeGroupSchema): GroupCallbackSchema {
  return {
    key: config.key,
    title: config.title,
    helpMessage: config.helpMessage,
    form: config.form,
    collapsed: config.collapsed,
    collapsedRows: config.collapsedRows,
    hideCollapseButton: config.hideCollapseButton,
    disabled: config.disabled,
    gridItemProps: config.gridItemProps,
    gridProps: config.gridProps,
  }
}

const groupSchema = computed<RuntimeGroupSchema[]>(() => {
  const source = schema.value as UnwrapGroupSchema[]
  const result: RuntimeGroupSchema[] = []
  for (let index = 0; index < source.length; index += 1)
    result.push(createRuntimeGroupSchema(source[index], index))
  return result
})

function handleGroupHide(config: RuntimeGroupSchema) {
  let isVisible = true
  if (isBoolean(config.hide))
    isVisible = !config.hide
  if (isFunction(config.hide))
    isVisible = !config.hide({ group: createGroupCallbackSchema(config), model: model.value })
  return isVisible
}

function getGroupExpandCollapseText(config: RuntimeGroupSchema) {
  return {
    text: config.collapsed ? props.collapsedText : props.expandedText,
    icon: config.collapsed ? 'i-ic:outline-keyboard-arrow-down' : 'i-ic:outline-keyboard-arrow-up',
  }
}

function toggleCollapse(config: RuntimeGroupSchema, isCollapsed?: boolean) {
  groupState.set(config.key, {
    collapsed: isCollapsed ?? !config.collapsed,
  })
}

function toggleCollapseByIndex(index: number, isCollapsed?: boolean) {
  const group = groupSchema.value[index]
  group && toggleCollapse(group, isCollapsed)
}

function handleGroupOverflowChange(config: RuntimeGroupSchema, isOverflow: boolean) {
  groupOverflowMap.set(config.key, isOverflow)
}

function isCollapseButtonVisible(config: RuntimeGroupSchema) {
  return !config.hideCollapseButton && groupOverflowMap.get(config.key) === true
}

function handleGridPropsMap(config: RuntimeGroupSchema): GridProps {
  return {
    ...props.gridProps,
    ...config.gridProps,
    collapsed: config.collapsed,
    notCollapsedRows: config.collapsedRows,
  }
}

defineExpose<GroupSchemaFormExpose>(exposeSchemaForm<GroupSchemaFormExpose>(commonExpose, {
  toggleCollapsed: toggleCollapseByIndex,
}))
</script>

<template>
  <schema-form-wrap
    ref="formRef"
    v-bind="formProps"
    :model="model"
  >
    <template v-for="(config) in groupSchema" :key="config.key">
      <template v-if="handleGroupHide(config)">
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
                  size="14px"
                />
              </template>
              {{ config.helpMessage }}
            </n-tooltip>
          </div>
          <slot
            v-if="isCollapseButtonVisible(config)"
            name="collapsedButton"
            :config="config"
            :overflow="groupOverflowMap.get(config.key) === true"
            :toggle-collapsed="toggleCollapse"
          >
            <n-button
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
          @overflow-change="handleGroupOverflowChange(config, $event)"
        >
          <template v-for="(slot, key) in formContentSlots" #[key]="scope">
            <slot :name="key" v-bind="scope || {}" />
          </template>
        </schema-form-content>
      </template>
    </template>
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
  background: var(--primary-shallow);
  border-radius: var(--border-radius-md);

  &-title {
    display: inline-flex;
    align-items: center;
    line-height: 20px;
    gap: 7px;

    &-placeholder {
      display: inline-block;
      height: 25px;
      width: 4px;
      background: var(--primary-main);
      border-radius: var(--border-radius-md);
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
