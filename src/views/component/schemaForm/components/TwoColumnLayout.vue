<script setup lang="ts">
import type { FormItemRule } from 'naive-ui'
import type { DefineSchema } from '@/components/common/schema-form/types/common.ts'
import renderIcon from '@/hooks/components/render-icon.ts'

const { RenderUnoIcon } = renderIcon()

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
  age: null,
  password: '',
  confirmPassword: '',
  status: null,
  skill: null,
  date: null,
  dateRange: [],
  startTime: null,
  endTime: null,
  area: null,
  organization: null,
  score: null,
  show: true,
  description: null,
  like: [],
  tags: ['小菜鸡', '码农'],
  color: null,
  mention: null,
  workPlace: 0,
  schedule: 50,
  userList: [],
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
    label: '名称',
    component: 'input',
    tooltip: '这是一个Tooltip',
    placeholder: '这个placeholder会覆盖到自动生成的placeholder',
    componentContent: {
      prefix: () => RenderUnoIcon('i-ant-design:user-outlined'),
    },
    showRequireMark: false,
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'autoComplete',
    options: emailAutoComplete,
    rule: 'mail',
  },
  {
    field: 'age',
    label: '年龄',
    component: 'inputNumber',
  },
  {
    field: 'password',
    label: '密码',
    component: 'input',
    componentProps: {
      type: 'password',
      showPasswordOn: 'click',
    },
    showRequireMark: true,
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    component: 'input',
    first: true,
    componentProps: {
      type: 'password',
      showPasswordOn: 'click',
      disabled: computed(() => !form.value.password),
    },
    rule: [
      {
        required: true,
        message: '请再次输入密码',
        trigger: 'blur',
      },
      {
        message: '俩次输入密码不一致',
        trigger: ['blur', 'input'],
        validator: (rule: FormItemRule, value: string) => {
          return (
            !!form.value.password
            && form.value.password.startsWith(value)
            && form.value.password.length >= value.length
          )
        },
      },
    ],
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
    field: 'skill',
    label: '技能',
    component: 'checkboxGroup',
    options: [
      {
        label: 'Vue',
        value: 0,
      },
      {
        label: 'React',
        disabled: true,
        value: 1,
      },
      {
        label: 'Naive',
        value: 2,
      },
      {
        label: 'VueUse',
        value: 3,
      },
      {
        label: 'VueQuery',
        value: 4,
      },
      {
        label: 'Axios',
        value: 5,
      },
      {
        label: 'Unocss',
        value: 6,
      },
    ],
  },
  {
    field: 'tags',
    label: '标签',
    component: 'dynamicTags',
  },
  {
    field: 'color',
    label: '颜色',
    component: 'colorPicker',
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
    field: 'score',
    label: '评分',
    component: 'rate',
  },
  {
    field: 'schedule',
    label: '进度',
    component: 'slider',
  },
  {
    field: 'show',
    label: '启用',
    component: 'switch',
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
    field: 'userList',
    label: '用户',
    component: 'transfer',
    options: Array.from({ length: 100 }, (v, i) => {
      return {
        value: i,
        label: `用户${i}`,
      }
    }),
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
  },
  {
    slot: 'test2',
  },
  {
    label: '自定义插槽',
    contentSlot: 'test',
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
        <schema-form
          v-model:model="form"
          v-model:schema="schema"
          :grid-item-props="12"
          show-require-mark
        >
          <template #test>
            <div class="text-white p-5 bg-primary flex-center h-full w-full">
              这是一个<span class="text-black">包含</span>FormItem自定义插槽
            </div>
          </template>
          <template #test2>
            <div class="text-white p-5 bg-primary flex-center h-full">
              这是一个<span class="text-black">不包含</span>FormItem自定义插槽
            </div>
          </template>
        </schema-form>
      </div>
    </template>
  </n-split>
</template>

<style scoped lang="scss">

</style>
