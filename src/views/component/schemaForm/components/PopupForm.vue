<script setup lang="ts">
import type { DefineSchema } from '@/components/common/schema-form/types/common.ts'

const [visible1, toggleVisible1] = useToggle()
const [visible2, toggleVisible2] = useToggle()

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

const emailAutoComplete = computed(() => ['@gmail.com', '@163.com', '@qq.com'].map((v) => {
  const prefix = form.value.email?.split('@')[0]
  return {
    label: prefix + v,
    value: prefix + v,
  }
}),
)
const schema = ref<DefineSchema<typeof form.value>[]>([
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
    rules: 'mail',
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
])
</script>

<template>
  <n-flex>
    <n-button @click="toggleVisible1()">
      打开模态框
    </n-button>
    <n-button @click="toggleVisible2()">
      打开抽屉
    </n-button>
  </n-flex>
  <popup-schema-form
    v-model:model="form"
    v-model:schema="schema"
    v-model:visible="visible1"
    title="模态框"
    popup-type="modal"
    :close-confirm="false"
    :grid-item-props="12"
  />

  <popup-schema-form
    v-model:model="form"
    v-model:schema="schema"
    v-model:visible="visible2"
    title="抽屉"
  />
</template>

<style scoped lang="scss">

</style>
