<script lang="ts" setup>
import AppConstant from '@/constant/app'
import useAppStore from '@/store/modules/app'

const appStore = useAppStore()
</script>

<template>
  <n-divider>
    主题颜色
  </n-divider>
  <n-flex justify="space-between" :wrap="false">
    <div
      v-for="item in AppConstant.THEME_COLORS"
      :key="item"
      :style="{ background: item }"
      class="themeCard"
      @click="appStore.setThemeColor(item)"
    >
      <icon v-if="appStore.themeColor === item" icon="i-ant-design:check-outlined" />
    </div>
  </n-flex>
</template>

<style lang="scss" scoped>
.themeCard {
  width: 20px;
  height: 20px;
  border-radius:  var(--border-radius-sm);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
</style>
