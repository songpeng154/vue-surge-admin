import type { Component } from 'vue'
// 从 naive-ui/es 单独导入每个组件，实现真正的按需加载
import { defineAsyncComponent } from 'vue'

// 使用动态导入从 naive-ui/es 单独加载每个组件
const componentLoaders: Record<string, () => Promise<Component>> = {
  input: () => import('naive-ui/es/input').then(m => m.default),
  select: () => import('naive-ui/es/select').then(m => m.default),
  autoComplete: () => import('naive-ui/es/auto-complete').then(m => m.default),
  cascader: () => import('naive-ui/es/cascader').then(m => m.default),
  colorPicker: () => import('naive-ui/es/color-picker').then(m => m.default),
  checkbox: () => import('naive-ui/es/checkbox').then(m => m.default),
  checkboxGroup: () => import('naive-ui/es/checkbox').then(m => m.NCheckboxGroup),
  datePicker: () => import('naive-ui/es/date-picker').then(m => m.default),
  dynamicInput: () => import('naive-ui/es/dynamic-input').then(m => m.default),
  dynamicTags: () => import('naive-ui/es/dynamic-tags').then(m => m.default),
  inputNumber: () => import('naive-ui/es/input-number').then(m => m.default),
  mention: () => import('naive-ui/es/mention').then(m => m.default),
  radio: () => import('naive-ui/es/radio').then(m => m.default),
  radioGroup: () => import('naive-ui/es/radio').then(m => m.NRadioGroup),
  rate: () => import('naive-ui/es/rate').then(m => m.default),
  slider: () => import('naive-ui/es/slider').then(m => m.default),
  switch: () => import('naive-ui/es/switch').then(m => m.default),
  timePicker: () => import('naive-ui/es/time-picker').then(m => m.default),
  transfer: () => import('naive-ui/es/transfer').then(m => m.default),
  treeSelect: () => import('naive-ui/es/tree-select').then(m => m.default),
  upload: () => import('naive-ui/es/upload').then(m => m.default),
  iconSelect: () => import('@/components/common/icon/icon-selector.vue').then(m => m.default),
}

// schema form 可渲染的组件 - 使用异步组件实现按需加载
export const SCHEMA_RENDER_COMPONENTS = Object.fromEntries(
  Object.entries(componentLoaders).map(([key, loader]) => [
    key,
    defineAsyncComponent({
      loader,
      // 延迟显示加载组件的时间（默认 200ms）
      delay: 200,
      // 超时时间
      timeout: 3000,
    }),
  ]),
) as Record<string, Component>
