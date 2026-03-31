<script lang="ts" setup>
import { dateZhCN, zhCN } from 'naive-ui'
import AppConstant from '@/constant/app.ts'
import { useGlobalInitialize } from '@/hooks/effect/global-init.ts'
import { globalSubscribe } from '@/hooks/effect/global-subscribe.ts'
import useAppStore from '@/store/modules/app'

const appStore = useAppStore()
// 全局初始化
useGlobalInitialize()
// 全局订阅
globalSubscribe()
</script>

<template>
  <n-config-provider
    class="w-h-full"
    inline-theme-disabled
    :theme="appStore.naiveTheme"
    :theme-overrides="appStore.themeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :breakpoints="AppConstant.SCREEN_BREAKPOINTS"
  >
    <app-provider>
      <router-view />
    </app-provider>
  </n-config-provider>
</template>
