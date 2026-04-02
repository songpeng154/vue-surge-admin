<script lang="ts" setup>
import type { LayoutModeOption } from '@/store/modules/app/type'
import LayoutCard from '@/layout/components/header/components/settings/components/LayoutCard.vue'
import useAppStore from '@/store/modules/app'

const layoutModeList: LayoutModeOption[] = [
  {
    value: 'side',
    label: '侧边菜单模式',
  },
  {
    value: 'mix-side',
    label: '侧边菜单混合模式',
  },
  {
    value: 'top',
    label: '顶部菜单模式',
  },
]
const appStore = useAppStore()
</script>

<template>
  <n-divider>
    布局模式
  </n-divider>
  <div class="layoutMode">
    <LayoutCard
      v-for="item in layoutModeList"
      :key="item.value"
      :active="item.value === appStore.layoutMode"
      :popover-content="item.label"
      @click="appStore.layoutMode = item.value"
    >
      <div v-if="item.value === 'side'" class="vertical">
        <div class="side" />
        <div class="container">
          <div class="header" />
          <div class="main" />
        </div>
      </div>
      <div v-if="item.value === 'mix-side'" class="vertical">
        <div class="mixSide">
          <div />
          <div />
        </div>
        <div class="container">
          <div class="header" />
          <div class="main" />
        </div>
      </div>
      <div v-if="item.value === 'top'" class="horizontal">
        <div class="header primary" />
        <div class="main" />
      </div>
    </LayoutCard>
  </div>
</template>

<style lang="scss" scoped>
.layoutMode {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: space-between;
  justify-items: center;
  gap: 20px 0;

  .vertical {
    display: flex;
    height: 100%;
    gap: 3px;
  }

  .horizontal {
    display: flex;
    height: 100%;
    flex-direction: column;
    gap: 3px;
  }

  .header,
  .side,
  .mixSide,
  .main {
    border-radius: 2px;
    background:  var(--primary-shallow);
  }

  .header {
    height: 10px;
    background: var(--primary-shallow);
  }

  .primary {
    background: var(--primary-main);
  }

  .side {
    width: 13px;
    height: 100%;
    background: var(--primary-main);
  }

  .mixSide {
    width: 13px;
    height: 100%;
    display: flex;

    div:first-of-type {
      width: 6px;
      height: 100%;
      background: var(--primary-main);
      border-radius: 3px;
    }

    div:last-of-type {
      background: var(--primary-shallow);
      width: 10px;
      height: 100%;
    }
  }

  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .main {
    flex: 1;
  }
}
</style>
