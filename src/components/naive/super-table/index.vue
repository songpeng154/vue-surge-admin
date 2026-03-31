<script setup lang="ts">
import type { SuperTable } from '@/components/naive/super-table/types.ts'

// 拿到 Row 类型
type Row = SuperTable['data'][number]

const props = withDefaults(defineProps<SuperTable>(), {
  columns: () => [],
})
const slots = defineSlots<{
  [key: `cell-${string}`]: (props: { row: Row }) => any
}>()

console.log(props)
const enhancedColumns = computed(() => {
  return props.columns.map((col: any) => {
    const key = col.key
    const slotName = `cell-${key}`

    if (slots[slotName]) {
      return {
        ...col,
        render: (rowData: any) => slots[slotName]?.({ row: rowData }),
      }
    }

    return col
  })
})
</script>

<template>
  <n-data-table v-bind="props" :columns="enhancedColumns" />
</template>

<style scoped lang="scss">

</style>
