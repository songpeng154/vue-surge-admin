<script lang="ts" setup>
import { getMetaEnv } from '@/utils/env'
import DynamicBackground from '@/views/auth/components/DynamicBackground.vue'

const { VITE_APP_TITLE } = getMetaEnv()
</script>

<template>
  <div class="relative w-h-full flex-center bg-black">
    <DynamicBackground />
    <div
      v-motion-slide-left
      class="absolute left-[10px] top-[10px] flex-y-center gap-[5px]"
    >
      <img width="50" src="/logo.svg" alt="">
      <h3 class="text-6">
        {{ VITE_APP_TITLE }}
      </h3>
    </div>
    <div
      v-motion-slide-right
      class="absolute right-[10px] top-[10px] flex gap-[5px] rounded-sm p-[5px] bg-layer"
    >
      <theme-palette />
      <theme-switch />
    </div>
    <n-card
      bordered
      size="large"
      class="auth-card w-[500px] max-xs:w-[90%]"
      content-class="h-full"
    >
      <div class="w-h-full flex overflow-hidden">
        <div class="w-h-full flex-1 flex-shrink-0 p-[10px]">
          <router-view v-slot="{ Component, route }">
            <component
              :is="Component"
              :key="route.fullPath"
              v-motion-slide-right
            />
          </router-view>
        </div>
      </div>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.auth-card {
    box-shadow: 0 0 50px -30px theme("colors.primary");
    transition: 0.5s ease-in-out;

    &:hover {
        box-shadow: 0 0 50px -10px theme("colors.primary");
    }
}
</style>
