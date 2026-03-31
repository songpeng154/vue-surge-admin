<script setup lang="ts">
import type { ECOption } from '@/hooks/common/echarts/core.ts'
import { useRequest } from 'norm-axios'
import useEcharts from '@/hooks/common/echarts'
import SystemApi from '@/service/api/system.ts'

const { echartsDom, render } = useEcharts()

const { run } = useRequest(SystemApi.getAccessCount, {
  manual: true,
})

function getOptions(label: string[], value: number[]): ECOption {
  return {
    grid: {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: label,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: value,
        type: 'bar',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  }
}

onMounted(() => {
  run().then((res) => {
    if (!res)
      return
    const labelList = res.map(item => item.label)
    const valueList = res.map(item => item.value)
    render(getOptions(labelList, valueList))
  })
})
</script>

<template>
  <n-card title="流量趋势">
    <div ref="echartsDom" class="h-300px" />
  </n-card>
</template>

<style scoped lang="scss">

</style>
