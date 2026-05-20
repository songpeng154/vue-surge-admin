<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="p-40px flex min-h-400px items-center justify-center">
    <div class="text-center max-w-400px">
      <icon icon="i-carbon:construction" size="80px" class="mb-20px op-[0.6] text-main" />
      <h2 class="font-bold-600 text-[24px] mb-12px text-secondary">
        页面开发中
      </h2>
      <p class="text-[14px] mb-8px text-tertiary">
        路径: <code>{{ route.path }}</code>
      </p>
      <p class="text-[13px] mt-[16] p-[12px] rounded-[6px] text-tertiary">
        请在 <code class="bg-fill-secondary">src/views{{ route.path }}/index.vue</code> 创建页面组件
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>
