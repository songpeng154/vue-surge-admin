<script lang="ts" setup>
import type { LayoutStyleOption } from '@/store/modules/app/type'
import LayoutCard from '@/layout/components/header/components/settings/components/LayoutCard.vue'
import useAppStore from '@/store/modules/app'
import { temporaryClearTransition } from '@/utils'

const layoutStyleList: LayoutStyleOption[] = [
  {
    value: 'side-dark',
    label: '侧边暗色风格',
  },
  {
    value: 'side-top-dark',
    label: '侧边+顶部暗色风格',
  },
  {
    value: 'side-top-light',
    label: '侧边+顶部明亮风格',
  },
]
const appStore = useAppStore()
function switchStyle(option: LayoutStyleOption) {
  temporaryClearTransition(() => {
    appStore.layoutStyle = option.value
  })
}
</script>

<template>
  <n-divider>
    布局风格
  </n-divider>
  <div class="layoutStyle">
    <LayoutCard
      v-for="item in layoutStyleList"
      :key="item.value"
      :active="item.value === appStore.layoutStyle"
      :popover-content="item.label"
      @click="switchStyle(item)"
    >
      <div v-if="item.value === 'side-dark'" class="vertical">
        <div class="side dark" />
        <div class="container">
          <div class="header" />
          <div class="main" />
        </div>
      </div>
      <div v-if="item.value === 'side-top-dark'" class="vertical">
        <div class="side dark" />
        <div class="container">
          <div class="header dark" />
          <div class="main" />
        </div>
      </div>
      <div v-if="item.value === 'side-top-light'" class="vertical">
        <div class="side light" />
        <div class="container">
          <div class="header light" />
          <div class="main" />
        </div>
      </div>
    </LayoutCard>
  </div>
</template>

<style lang="scss" scoped>
$darkColor: #464e62;
$lightColor: #eaeaea;
.layoutStyle {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: space-between;
  justify-items: center;

  .vertical {
    display: flex;
    height: 100%;
    gap: 3px;
  }

  .header,
  .side,
  .main {
    border-radius: 2px;
    background: var(--primary-shallow);
  }

  .header {
    height: 10px;
  }

  .side {
    width: 13px;
    height: 100%;
  }

  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .dark {
    background: $darkColor;
  }

  .light {
    background: $lightColor;
  }

  .main {
    flex: 1;
  }
}
</style>
