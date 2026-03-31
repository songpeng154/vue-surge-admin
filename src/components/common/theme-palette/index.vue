<script setup lang="ts">
import AppConstant from '@/constant/app'
import useAppStore from '@/store/modules/app'

const appStore = useAppStore()
</script>

<template>
  <n-popover trigger="hover">
    <template #trigger>
      <hover-container>
        <icon icon="i-ic:baseline-color-lens" />
      </hover-container>
    </template>
    <h4 class="mb-1">
      调色板
    </h4>
    <n-flex>
      <span
        v-for="item in AppConstant.THEME_COLORS"
        :key="item"
        class="text-white rounded-sm flex-center h-[20px] w-[20px] cursor-pointer"
        :style="{ background: item }"
        @click="appStore.setThemeColor(item)"
      >
        <icon v-if="item === appStore.themeColor" icon="i-ic:baseline-check" />
      </span>
    </n-flex>
  </n-popover>
</template>

<style scoped lang="scss">

</style>
