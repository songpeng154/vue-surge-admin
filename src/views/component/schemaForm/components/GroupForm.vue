<script setup lang="ts">
import type { DefineGroupSchema, GroupSchemaFormExpose } from '@/components/common/schema-form/types/group.ts'

const area = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          {
            value: 'xihu',
            label: '西湖',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      {
        value: 'nanjing',
        label: '南京',
        children: [
          {
            value: 'zhonghuamen',
            label: '中华门',
          },
        ],
      },
    ],
  },
]

const form = ref({
  name: {
    a: {
      b: '',
    },
  },
  email: 'xxx',
  status: null,
  date: null,
  startTime: null,
  endTime: null,
  area: null,
  organization: null,
  description: null,
  like: [],
  mention: null,
})
const schemaForm = ref<GroupSchemaFormExpose>()
const [isDisabled, toggleDisabled] = useToggle()

const emailAutoComplete = computed(() => ['@gmail.com', '@163.com', '@qq.com'].map((v) => {
  const prefix = form.value.email?.split('@')[0]
  return {
    label: prefix + v,
    value: prefix + v,
  }
}),
)
const schema = ref<DefineGroupSchema<typeof form.value>[]>([
  {
    title: '用户信息',
    helpMessage: '用户信息',
    gridItemProps: 12,
    form: [
      {
        field: 'name.a.b',
        label: '用户昵称',
        component: 'input',
      },
      {
        field: 'email',
        label: '邮箱',
        component: 'autoComplete',
        options: emailAutoComplete,
        rule: 'mail',
      },
      {
        field: 'status',
        label: '状态',
        component: 'select',
        options: [
          {
            label: '未完成',
            value: 0,
          },
          {
            label: '已完成',
            value: 1,
          },
        ],
      },
      {
        field: 'like',
        label: '喜欢什么呢？',
        component: 'select',
        componentProps: {
          multiple: true,
        },
        options: [
          {
            label: '读书',
            value: 0,
          },
          {
            label: '游戏',
            value: 1,
          },
          {
            label: '写代码',
            value: 2,
          },
        ],
      },
      {
        field: 'date',
        label: '日期',
        component: 'datePicker',
        showRequireMark: true,
      },
      {
        field: 'mention',
        label: '提及',
        component: 'mention',
        placeholder: '输入@符号进行提及',
        options: [
          {
            label: 'Surge',
            value: 'Surge',
          },
          {
            label: '呼和浩特',
            value: '呼和浩特',
          },
          {
            label: '内蒙古',
            value: '内蒙古',
          },
        ],
      },
      {
        field: 'workPlace',
        label: '工作地点',
        component: 'radioGroup',
        options: [
          {
            label: '北京',
            value: 0,
          },
          {
            label: '呼和浩特',
            value: 1,
          },
          {
            label: '上海',
            value: 2,
          },
        ],
      },
    ],
  },
  {
    title: '企业信息',
    gridItemProps: 8,
    disabled: isDisabled,
    form: [
      {
        field: 'email',
        label: '邮箱',
        component: 'autoComplete',
        options: emailAutoComplete,
        rule: 'mail',
        disabled: false,
      },
      {
        field: 'startTime',
        label: '开始时间',
        component: 'timePicker',
      },
      {
        field: 'endTime',
        label: '结束时间',
        component: 'timePicker',
      },
      {
        field: 'area',
        label: '地区',
        component: 'cascader',
        options: area,
      },
      {
        field: 'organization',
        label: '组织机构',
        component: 'treeSelect',
        componentProps: {
          keyField: 'value',
        },
        options: area,
      },
      {
        field: 'description',
        label: '描述',
        component: 'input',
        componentProps: {
          type: 'textarea',
        },
        gridItemProps: 24,
      },
    ],
  },
  {
    title: '自定义标题',
    gridItemProps: 12,
    form: [
      {
        field: 'email',
        label: '邮箱',
        component: 'autoComplete',
        options: emailAutoComplete,
        rule: 'mail',
        disabled: false,
      },
      {
        field: 'startTime',
        label: '开始时间',
        component: 'timePicker',
      },
      {
        field: 'endTime',
        label: '结束时间',
        component: 'timePicker',
      },
      {
        field: 'area',
        label: '地区',
        component: 'cascader',
        options: area,
      },
      {
        field: 'organization',
        label: '组织机构',
        component: 'treeSelect',
        componentProps: {
          keyField: 'value',
        },
        options: area,
      },
      {
        field: 'description',
        label: '描述',
        component: 'input',
        componentProps: {
          type: 'textarea',
        },
        gridItemProps: 24,
      },
    ],
  },
])
</script>

<template>
  <n-split
    direction="horizontal"
    :default-size="0.20"
    :max="0.80"
    :min="0.20"
  >
    <template #1>
      <div class="p-24px h-full overflow-auto">
        <pre>{{ JSON.stringify(form, null, 2) }}</pre>
      </div>
    </template>
    <template #2>
      <div class="p-24px h-full overflow-auto">
        <n-flex class="mb-5">
          <n-button @click="schemaForm?.toggleCollapsed(1)">
            切换第二组表单的展开和收起
          </n-button>
          <n-button @click="toggleDisabled()">
            切换第二组表单是否禁用
          </n-button>
        </n-flex>
        <group-schema-form
          ref="schemaForm"
          v-model:model="form"
          v-model:schema="schema"
          :on-finish="model => {
            console.log(model)
          }"
          :on-finish-failed="error => {
            console.log(error)
          }"
        >
          <template #groupTitle="{ config }">
            <span v-if="config.title === '自定义标题'">自定义标题</span>
          </template>
          <!--          <template #collapsedButton="{config,toggleCollapsed}"> -->
          <!--            <n-button @click="toggleCollapsed(config)">{{ config.collapsed ? '展开' : '折叠' }}</n-button> -->
          <!--          </template> -->
        </group-schema-form>
      </div>
    </template>
  </n-split>
</template>

<style scoped lang="scss">

</style>
