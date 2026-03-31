<script setup lang="ts">
import { useRequest } from 'norm-axios'
import SystemApi from '@/service/api/system.ts'

const { data } = useRequest(SystemApi.getStatistics)

const countList = computed(() => {
  return [
    {
      name: '用户数量',
      count: data.value?.userTotal,
      undulations: 10,
      icon: 'i-fxemoji:palmtree',
    },
    {
      name: '访问量',
      count: data.value?.visitCount,
      undulations: -15,
      icon: 'i-fxemoji:documenttextpicture',
    },
    {
      name: '下载量',
      count: data.value?.downloadCount,
      undulations: 20,
      icon: 'i-fxemoji:handbag',
    },
    {
      name: '使用量',
      count: data.value?.useCount,
      undulations: -24,
      icon: 'i-fxemoji:pencil',
    },
  ]
})
</script>

<template>
  <grid :x-gap="10" :y-gap="10" :cols="{ xs: 4, sm: 8, md: 8, lg: 16, xl: 16 }">
    <grid-item v-for="(item, i) in countList" :key="i" :span="4">
      <n-card hoverable>
        <div class="flex gap-[10px] items-center">
          <icon :icon="item.icon" size="60px" />
          <div class="flex-1">
            <div class="text-lg font-bold flex items-center justify-between">
              <n-number-animation
                show-separator
                :from="0"
                :to="item.count"
              />
              <div class="text-xs font-400 p-5px rounded-md bg-fill-secondary">
                <span v-if="item.undulations > 0" class="text-green-5">+{{ item.undulations }}%</span>
                <span v-else class="text-red">{{ item.undulations }}%</span>
              </div>
            </div>
            {{ item.name }}
          </div>
        </div>
      </n-card>
    </grid-item>
  </grid>
</template>

<style scoped lang="scss">
</style>
