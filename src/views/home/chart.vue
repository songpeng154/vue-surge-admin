<script setup lang="ts">
import type { ECOption } from '@/hooks/common/echarts/core.ts'
import { useRequest } from 'norm-axios'
import useEcharts from '@/hooks/common/echarts'
import echarts from '@/hooks/common/echarts/core.ts'
import SystemApi from '@/service/api/system.ts'

const { echartsDom: dom1, render: renderUsageCount } = useEcharts()
const { echartsDom: dom2, render: renderTechnologyStack } = useEcharts()

const { run: getUsageCount } = useRequest(SystemApi.getUsageCount, {
  manual: true,
})

const { run: getTechnologyStack } = useRequest(SystemApi.getTechnologyStack, {
  manual: true,
})

const getUsageCountOptions = (label: string[], value: number[]): ECOption => {
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
        type: 'line',
        smooth: 0.4,
        lineStyle: {
          cap: 'round', // 让线的端点变成圆角
        },
        areaStyle: { // 设置折线图下方的渐变色
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(102, 117, 255, 1)' }, // 渐变起始颜色
            { offset: 1, color: 'rgba(102, 117, 255, .2)' }, // 渐变终止颜色（透明）
          ]),
        },
      },
    ],
  }
}

const getTechnologyStackOptions = (data: { name: string, value: number }[]): ECOption => {
  return {
    grid: {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20,
      containLabel: true,
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: 'top',
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        avoidLabelOverlap: false,
        data,
        itemStyle: {
          borderRadius: 10,
        },
      },
    ],
  }
}

onMounted(() => {
  getUsageCount().then((res) => {
    if (!res) return
    const labelList = res.map(item => item.label)
    const valueList = res.map(item => item.value)
    renderUsageCount(getUsageCountOptions(labelList, valueList))
  })
  getTechnologyStack().then((res) => {
    if (!res) return
    renderTechnologyStack(getTechnologyStackOptions(res))
  })
})
</script>

<template>
  <grid :x-gap="10" :y-gap="10" :cols="{ xs: 4, sm: 4, md: 8, lg: 8, xl: 8 }">
    <grid-item :span="4">
      <n-card hoverable title="近期使用量">
        <div ref="dom1" class="h-300px" />
      </n-card>
    </grid-item>
    <grid-item :span="4">
      <n-card title="主要技术">
        <div ref="dom2" class="h-300px" />
      </n-card>
    </grid-item>
  </grid>
</template>

<style scoped lang="scss">

</style>
