<script lang="ts" setup>
import Logo from '@/layout/components/logo.vue'
import Menu from '@/layout/components/menu/index.vue'

import useAppStore from '@/store/modules/app'
import useAuthStore from '@/store/modules/auth'

const appStore = useAppStore()
const authStore = useAuthStore()
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <Logo />
    <div class="flex-1 overflow-x-hidden overflow-y-auto">
      <Menu
        :inverted="appStore.isInvertedSidebar"
        :collapsed="appStore.isCollapsedSidebar"
        :collapsed-width="appStore.collapsedSidebarWidth"
        :routes="authStore.routes"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
