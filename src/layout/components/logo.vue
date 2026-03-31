<script setup lang="ts">
import { computed } from 'vue'
import useAppStore from '@/store/modules/app'
import { getMetaEnv } from '@/utils/env'

const { VITE_APP_TITLE } = getMetaEnv()
const appStore = useAppStore()
const isHide = computed(() => (appStore.isCollapsedSidebar || appStore.layoutMode === 'mix-side') && !appStore.isSmallScreen)
</script>

<template>
  <div class="logo" :style="{ height: `${appStore.headerHeight}px` }">
    <img
      height="35"
      width="35"
      src="/logo.svg"
      :alt="VITE_APP_TITLE"
    >
    <span v-if="!isHide" class="logo-text">{{ VITE_APP_TITLE }}</span>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: height .2s ease-in-out;
  padding: 10px;
  gap: 5px;

  &-text {
    font-weight: bold;
    font-size: 18px;
    white-space: nowrap;
  }
}
</style>
