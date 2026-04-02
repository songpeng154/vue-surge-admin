<script lang="ts" setup>
import useAppStore from '@/store/modules/app'

const appStore = useAppStore()
</script>

<template>
  <n-layout-footer
    v-if="appStore.footerVisible"
    bordered
    :style="{ height: `${appStore.footerHeight}px` }"
    class="layoutFooter"
  >
    Copyright ©2022 Surge Admin
  </n-layout-footer>
</template>

<style lang="scss" scoped>
.layoutFooter {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: height .2s ease-in-out;
  background:  var(--background-color-container);
  width: 100%;
  flex-shrink: 0;
}
</style>
