<script setup lang="tsx">
import type { SchemaFormExpose } from '@/components/common/schema-form/types/base.ts'
import type { CallbackParams, DefineSchema } from '@/components/common/schema-form/types/common.ts'
import type { GroupSchemaFormExpose, UnwrapGroupSchema } from '@/components/common/schema-form/types/group.ts'
import type { SearchSchemaFormExpose } from '@/components/common/schema-form/types/search.ts'

interface BasicModel {
  name: string
  age: number | null
  status: number | null
  dateRange: string[] | null
  workTime: string | null
  skills: string[]
  gender: string | null
  agree: boolean
  enabled: boolean
  showAdvanced: boolean
  advancedNote: string
  remark: string
}

interface AsyncModel {
  city: string | null
  dept: string | null
  tags: string[]
  color: string | null
  score: number | null
  progress: number
  mention: string
}

const testLogs = ref<string[]>([])

function pushLog(message: string) {
  testLogs.value.unshift(`${new Date().toLocaleTimeString()} ${message}`)
  testLogs.value = testLogs.value.slice(0, 12)
}

function stringify(value: unknown) {
  return JSON.stringify(value, null, 2)
}

const basicFormRef = ref<SchemaFormExpose>()
const basicResult = ref('未操作')
const basicModel = ref<BasicModel>({
  name: '',
  age: null,
  status: null,
  dateRange: null,
  workTime: null,
  skills: [],
  gender: null,
  agree: false,
  enabled: true,
  showAdvanced: false,
  advancedNote: '',
  remark: '',
})
const basicSchema = ref<DefineSchema<BasicModel>[]>([
  {
    field: 'name',
    label: '姓名',
    component: 'input',
    showRequireMark: true,
    tooltip: '测试 tooltip、自动 placeholder、自动必填规则',
  },
  {
    field: 'age',
    label: '年龄',
    component: 'inputNumber',
    componentProps: { min: 0, max: 120 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'select',
    showRequireMark: true,
    options: [
      { label: '启用', value: 1 },
      { label: '停用', value: 0 },
    ],
  },
  {
    field: 'dateRange',
    label: '时间范围',
    component: 'datePicker',
    componentProps: { type: 'datetimerange' },
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间',
  },
  {
    field: 'workTime',
    label: '上班时间',
    component: 'timePicker',
  },
  {
    field: 'skills',
    label: '技能',
    component: 'checkboxGroup',
    options: [
      { label: 'Vue', value: 'vue' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'Naive UI', value: 'naive' },
    ],
  },
  {
    field: 'gender',
    label: '性别',
    component: 'radioGroup',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
  {
    field: 'agree',
    label: '单 Checkbox',
    component: 'checkbox',
    componentContent: '我同意协议',
  },
  {
    field: 'enabled',
    label: '是否启用',
    component: 'switch',
  },
  {
    field: 'showAdvanced',
    label: '显示高级项',
    component: 'switch',
    tooltip: '切换后观察“高级说明”的显示/隐藏是否符合预期',
  },
  {
    field: 'advancedNote',
    label: ({ model }: CallbackParams<BasicModel>) => `高级说明（showAdvanced=${model.showAdvanced}）`,
    component: 'input',
    hide: ({ model }: CallbackParams<BasicModel>) => model.showAdvanced,
    disabled: ({ model }: CallbackParams<BasicModel>) => !model.enabled,
    gridItemProps: 24,
  },
  {
    field: 'remark',
    label: '备注',
    component: 'input',
    componentProps: { type: 'textarea', rows: 3 },
    gridItemProps: 24,
  },
  {
    label: 'contentSlot',
    contentSlot: 'basicContentSlot',
    gridItemProps: 24,
  },
  {
    slot: 'fullCustomItem',
    gridItemProps: 24,
  },
])

async function validateBasicForm() {
  try {
    await basicFormRef.value?.validate()
    basicResult.value = '校验通过：validate promise resolved'
    pushLog('基础表单手动 validate 通过')
  }
  catch {
    basicResult.value = '校验失败：应该自动滚动到第一个错误字段'
    pushLog('基础表单手动 validate 失败')
  }
}

function resetBasicValidation() {
  basicFormRef.value?.restoreValidation()
  basicResult.value = '已调用 restoreValidation'
  pushLog('基础表单 restoreValidation 已调用')
}

function handleBasicFinish(model: Recordable) {
  basicResult.value = '提交成功：onFinish 已触发'
  pushLog(`基础表单 onFinish：${stringify(model)}`)
}

function handleBasicFinishFailed(error: unknown) {
  basicResult.value = '提交失败：onFinishFailed 已触发'
  pushLog(`基础表单 onFinishFailed：${String(error)}`)
}

const customActionRef = ref<SchemaFormExpose>()
const customActionModel = ref({ keyword: '', count: 1 })
const customActionSchema = ref<DefineSchema<typeof customActionModel.value>[]>([
  { field: 'keyword', label: '关键词', component: 'input', showRequireMark: true },
  { field: 'count', label: '数量', component: 'inputNumber', componentProps: { min: 1 } },
])

async function submitCustomAction() {
  try {
    await customActionRef.value?.validate()
    pushLog('自定义 actions 校验通过')
  }
  catch {
    pushLog('自定义 actions 校验失败')
  }
}

const searchFormRef = ref<SearchSchemaFormExpose>()
const searchModel = ref({ keyword: '', status: null, owner: '', date: null, category: null, tag: '' })
const searchCollapsed = ref(true)
const searchSchema = ref<DefineSchema<typeof searchModel.value>[]>([
  { field: 'keyword', label: '关键词', component: 'input' },
  { field: 'status', label: '状态', component: 'select', options: [{ label: '启用', value: 1 }, { label: '停用', value: 0 }] },
  { field: 'owner', label: '负责人', component: 'input' },
  { field: 'date', label: '日期', component: 'datePicker' },
  { field: 'category', label: '分类', component: 'select', options: [{ label: 'A 类', value: 'a' }, { label: 'B 类', value: 'b' }] },
  { field: 'tag', label: '标签', component: 'input' },
])

function callSearchCollapse(value?: boolean) {
  searchFormRef.value?.toggleCollapsed(value as boolean)
  pushLog(`SearchSchemaForm.toggleCollapsed(${String(value)}) 已调用`)
}

const groupFormRef = ref<GroupSchemaFormExpose>()
const groupModel = ref({
  baseName: '',
  baseCode: '',
  extName: '',
  extCode: '',
  extOwner: '',
  extRemark: '',
  secret: '',
  hideExt: false,
})
const groupSchema = ref<UnwrapGroupSchema<typeof groupModel.value>[]>([
  {
    title: '基础信息',
    collapsed: false,
    gridProps: { cols: 12, yGap: 4 },
    collapsedRows: 2,
    form: [
      { field: 'baseName', label: '基础名称', component: 'input', showRequireMark: true },
      { field: 'baseCode', label: '基础编码', component: 'input' },
    ],
  },
  {
    title: '扩展信息',
    collapsedRows: 1,
    helpMessage: '测试分组折叠状态不会写回父级 schema，且局部 gridProps 覆盖全局 gridProps',
    form: [
      { field: 'extName', label: '扩展名称', component: 'input' },
      { field: 'extCode', label: '扩展编码', component: 'input' },
      { field: 'extOwner', label: '扩展负责人', component: 'input' },
      { field: 'extRemark', label: '扩展备注', component: 'input' },
      { field: 'secret', label: '禁用字段', component: 'input', disabled: true },
    ],
  },
  {
    title: '可隐藏分组',
    hide: ({ model }) => model.hideExt,
    form: [
      { field: 'hideExt', label: '显示隐藏分组', component: 'switch' },
    ],
  },
])
const groupSchemaSnapshot = computed(() => stringify(groupSchema.value))

function toggleOverflowGroup(value?: boolean) {
  groupFormRef.value?.toggleCollapsed(1, value)
  pushLog(`GroupSchemaForm.toggleCollapsed(1, ${String(value)}) 已调用`)
}

const popupVisible = ref(false)
const popupModalVisible = ref(false)
const popupModel = ref({ title: '', owner: '', priority: null })
const popupSchema = ref<DefineSchema<typeof popupModel.value>[]>([
  { field: 'title', label: '标题', component: 'input', showRequireMark: true },
  { field: 'owner', label: '负责人', component: 'input' },
  { field: 'priority', label: '优先级', component: 'select', options: [{ label: '高', value: 'high' }, { label: '中', value: 'middle' }, { label: '低', value: 'low' }] },
])

const resetFormRef = ref<SchemaFormExpose>()
const resetModel = ref({ name: '第一条记录', extra: '初始额外字段' })
const resetSchema = ref<DefineSchema<typeof resetModel.value>[]>([
  { field: 'name', label: '名称', component: 'input' },
  { field: 'extra', label: '额外字段', component: 'input' },
])

function switchRecord() {
  resetModel.value.name = '第二条记录'
  resetModel.value.extra = '新的额外字段'
  pushLog('reset 测试：已模拟切换记录')
}

function addRuntimeField() {
  ;(resetModel.value as any).runtimeOnly = '重置后应该被清理'
  pushLog('reset 测试：已新增 runtimeOnly')
}

function callResetFields() {
  resetFormRef.value?.resetFields()
  pushLog('resetFields 已调用；检查 runtimeOnly 是否被删除')
}

const asyncModel = ref<AsyncModel>({
  city: null,
  dept: null,
  tags: [],
  color: '#18a058',
  score: 3,
  progress: 30,
  mention: '',
})
const asyncSchema = ref<DefineSchema<AsyncModel>[]>([
  {
    field: 'city',
    label: '级联选择',
    component: 'cascader',
    options: [
      { label: '广东', value: 'gd', children: [{ label: '深圳', value: 'sz' }, { label: '广州', value: 'gz' }] },
      { label: '浙江', value: 'zj', children: [{ label: '杭州', value: 'hz' }] },
    ],
  },
  {
    field: 'dept',
    label: '树选择',
    component: 'treeSelect',
    options: [
      { label: '研发部', key: 'rd', children: [{ label: '前端组', key: 'fe' }, { label: '后端组', key: 'be' }] },
      { label: '产品部', key: 'pm' },
    ],
  },
  { field: 'tags', label: '动态标签', component: 'dynamicTags' },
  { field: 'color', label: '颜色', component: 'colorPicker' },
  { field: 'score', label: '评分', component: 'rate' },
  { field: 'progress', label: '滑块', component: 'slider', componentProps: { min: 0, max: 100 } },
  {
    field: 'mention',
    label: 'Mention',
    component: 'mention',
    options: [
      { label: 'Alice', value: 'alice' },
      { label: 'Bob', value: 'bob' },
    ],
  },
])

const labelWidthModel = ref({ veryLongA: '', veryLongB: '', short: '' })
const labelWidthSchema = ref<DefineSchema<typeof labelWidthModel.value>[]>([
  { field: 'veryLongA', label: '非常非常长的标签 A', component: 'input' },
  { field: 'veryLongB', label: '更长一点的标签用于 ResizeObserver 测量', component: 'input' },
  { field: 'short', label: '短标签', component: 'input' },
])

const errorModel = ref({ badDate: null, badComponent: '' })
const errorSchema = ref<DefineSchema<typeof errorModel.value>[]>([
  {
    field: 'badDate',
    label: '非法日期类型',
    component: 'datePicker',
    componentProps: { type: 'weekrange' as any },
  },
  {
    field: 'badComponent',
    label: '不存在组件',
    component: 'notExists' as any,
  },
])
</script>

<template>
  <div class="schema-form-bug-repro">
    <n-alert type="info" title="Schema Form 功能验收 Demo" class="mb-16px">
      按卡片从上到下手测：默认按钮、校验、插槽、折叠、分组、弹窗、reset、异步组件、autoLabelWidth、错误配置提示。
    </n-alert>

    <n-card title="测试日志" class="mb-16px">
      <n-empty v-if="!testLogs.length" description="暂无操作日志" />
      <n-timeline v-else>
        <n-timeline-item v-for="log in testLogs" :key="log" type="info" :content="log" />
      </n-timeline>
    </n-card>

    <n-grid :cols="1" :y-gap="16">
      <n-gi>
        <n-card title="1. 基础 SchemaForm：常用组件 / 校验 / 插槽 / 动态属性">
          <p class="case-note">
            验收点：默认提交/重置按钮显示；input/select/date/time/inputNumber/checkbox/radio/switch 正常；showRequireMark 自动规则；tooltip；contentSlot；slot 整项替换；label 回调；disabled 回调；hide 回调。
          </p>
          <n-space class="mb-12px">
            <n-button type="primary" @click="validateBasicForm">
              手动 validate
            </n-button>
            <n-button @click="resetBasicValidation">
              restoreValidation
            </n-button>
            <n-tag :type="basicResult.includes('通过') ? 'success' : basicResult.includes('失败') ? 'error' : 'default'">
              {{ basicResult }}
            </n-tag>
          </n-space>
          <schema-form
            ref="basicFormRef"
            v-model:model="basicModel"
            v-model:schema="basicSchema"
            show-require-mark
            :on-finish="handleBasicFinish"
            :on-finish-failed="handleBasicFinishFailed"
          >
            <template #basicContentSlot>
              <n-alert type="success" title="contentSlot 正常">
                这个内容由业务侧插入，但仍应该处在 n-form-item 中。
              </n-alert>
            </template>
            <template #fullCustomItem>
              <n-alert type="warning" title="slot 整项替换正常">
                这个 schema 只配置了 slot，不应该额外包默认组件。
              </n-alert>
            </template>
            <template #actionsBefore>
              <n-tag type="info">
                actionsBefore
              </n-tag>
            </template>
            <template #actionsAfter>
              <n-tag type="success">
                actionsAfter
              </n-tag>
            </template>
          </schema-form>
          <pre>{{ stringify(basicModel) }}</pre>
        </n-card>
      </n-gi>

      <n-gi>
        <n-card title="2. actions：有 slot 时覆盖默认 actions">
          <p class="case-note">
            验收点：这里应该只显示自定义按钮；不会再出现默认提交/重置按钮。上一个基础表单未传 actions，所以默认按钮应正常显示。
          </p>
          <schema-form
            ref="customActionRef"
            v-model:model="customActionModel"
            v-model:schema="customActionSchema"
          >
            <template #actions>
              <n-button type="warning" @click="submitCustomAction">
                自定义校验按钮
              </n-button>
            </template>
          </schema-form>
          <pre>{{ stringify(customActionModel) }}</pre>
        </n-card>
      </n-gi>

      <n-gi>
        <n-card title="3. SearchSchemaForm：折叠状态 / 默认搜索重置按钮">
          <p class="case-note">
            验收点：默认搜索/重置按钮显示；只展示前 2 项时可展开；连续调用 toggleCollapsed(false) 应一直保持展开，不应反向切换。
          </p>
          <n-space class="mb-12px">
            <n-button @click="searchCollapsed = true">
              collapsed = true
            </n-button>
            <n-button @click="callSearchCollapse(false)">
              toggleCollapsed(false)
            </n-button>
            <n-button @click="callSearchCollapse(true)">
              toggleCollapsed(true)
            </n-button>
            <n-button @click="callSearchCollapse()">
              toggleCollapsed()
            </n-button>
            <n-tag>collapsed：{{ searchCollapsed }}</n-tag>
          </n-space>
          <search-schema-form
            ref="searchFormRef"
            v-model:model="searchModel"
            v-model:schema="searchSchema"
            v-model:collapsed="searchCollapsed"
            :search-show-number="2"
          />
          <pre>{{ stringify(searchModel) }}</pre>
        </n-card>
      </n-gi>

      <n-gi>
        <n-card title="4. GroupSchemaForm：分组折叠 / slot / gridProps / 不污染父 schema">
          <p class="case-note">
            验收点：collapsedRows 表示折叠时保留几行；没有溢出的分组不显示折叠按钮；有溢出的分组才显示展开/收起按钮；折叠状态不应写回父级 schema JSON。
          </p>
          <n-space class="mb-12px">
            <n-button @click="toggleOverflowGroup(false)">
              展开第二个分组
            </n-button>
            <n-button @click="toggleOverflowGroup(true)">
              折叠第二个分组
            </n-button>
            <n-tag>下方 JSON 是父级 schema 当前值</n-tag>
          </n-space>
          <group-schema-form
            ref="groupFormRef"
            v-model:model="groupModel"
            v-model:schema="groupSchema"
            :grid-props="{ cols: 24, yGap: 20 }"
            :grid-item-props="12"
          />
          <n-grid :cols="2" :x-gap="12" responsive="screen">
            <n-gi>
              <h4>model</h4>
              <pre>{{ stringify(groupModel) }}</pre>
            </n-gi>
            <n-gi>
              <h4>父级 schema 快照</h4>
              <pre>{{ groupSchemaSnapshot }}</pre>
            </n-gi>
          </n-grid>
        </n-card>
      </n-gi>

      <n-gi>
        <n-card title="5. PopupSchemaForm：Drawer / Modal / close reset / actions">
          <p class="case-note">
            验收点：Drawer 和 Modal 都能打开；默认 footer actions 显示；关闭确认正常；closeResetModel=true 时关闭后恢复首次 baseline。
          </p>
          <n-space class="mb-12px">
            <n-button type="primary" @click="popupVisible = true">
              打开 Drawer 表单
            </n-button>
            <n-button type="primary" secondary @click="popupModalVisible = true">
              打开 Modal 表单
            </n-button>
          </n-space>
          <popup-schema-form
            v-model:visible="popupVisible"
            v-model:model="popupModel"
            v-model:schema="popupSchema"
            title="Drawer 表单测试"
            confirm-content="确认关闭 Drawer 吗？关闭后会 resetFields。"
          />
          <popup-schema-form
            v-model:visible="popupModalVisible"
            v-model:model="popupModel"
            v-model:schema="popupSchema"
            popup-type="modal"
            title="Modal 表单测试"
            confirm-content="确认关闭 Modal 吗？关闭后会 resetFields。"
          />
          <pre>{{ stringify(popupModel) }}</pre>
        </n-card>
      </n-gi>

      <n-gi>
        <n-card title="6. resetFields：恢复首次 baseline / 清理 runtimeOnly">
          <p class="case-note">
            验收点：点击“新增 runtimeOnly”后 JSON 应出现 runtimeOnly；点击 resetFields 后 runtimeOnly 应被删除，且 name/extra 恢复首次挂载值。
          </p>
          <n-space class="mb-12px">
            <n-button @click="switchRecord">
              模拟切换记录
            </n-button>
            <n-button @click="addRuntimeField">
              新增 runtimeOnly
            </n-button>
            <n-button type="primary" @click="callResetFields">
              调用 resetFields
            </n-button>
          </n-space>
          <schema-form
            ref="resetFormRef"
            v-model:model="resetModel"
            v-model:schema="resetSchema"
          />
          <pre>{{ stringify(resetModel) }}</pre>
        </n-card>
      </n-gi>

      <n-gi>
        <n-card title="7. 异步/低频组件：cascader / treeSelect / dynamicTags / colorPicker / rate / slider / mention">
          <p class="case-note">
            验收点：低频组件应懒加载成功；页面首次进入不应卡死；每个组件修改后 model 应同步更新。
          </p>
          <schema-form
            v-model:model="asyncModel"
            v-model:schema="asyncSchema"
            :grid-item-props="12"
          />
          <pre>{{ stringify(asyncModel) }}</pre>
        </n-card>
      </n-gi>

      <n-gi>
        <n-card title="8. autoLabelWidth：ResizeObserver 标签宽度测量">
          <p class="case-note">
            验收点：labelPlacement=left 且 autoLabelWidth=true 时，短标签应和最长标签对齐；改窗口宽度后不应残留错位。
          </p>
          <schema-form
            v-model:model="labelWidthModel"
            v-model:schema="labelWidthSchema"
            label-placement="left"
            :auto-label-width="true"
          />
          <pre>{{ stringify(labelWidthModel) }}</pre>
        </n-card>
      </n-gi>

      <n-gi>
        <n-card title="9. 错误配置提示：非法 datePicker.type / 不存在 component">
          <p class="case-note">
            验收点：错误配置应该在对应表单项内展示 n-alert，不应该打崩整张表单，也不应该把非法 datePicker.type 继续传给 Naive UI。
          </p>
          <schema-form
            v-model:model="errorModel"
            v-model:schema="errorSchema"
            :show-actions="false"
          />
          <pre>{{ stringify(errorModel) }}</pre>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<style scoped lang="scss">
.schema-form-bug-repro {
  padding: 16px;

  .case-note {
    margin-bottom: 12px;
    color: var(--text-color-2);
    line-height: 1.6;
  }

  h4 {
    margin: 12px 0 6px;
  }

  pre {
    margin-top: 12px;
    padding: 12px;
    max-height: 360px;
    overflow: auto;
    background: rgb(0 0 0 / 6%);
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.5;
  }
}
</style>
