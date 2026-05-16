<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="placeholder-page">
    <div class="placeholder-content">
      <icon icon="i-carbon:construction" size="80px" class="placeholder-icon" />
      <h2 class="placeholder-title">页面开发中</h2>
      <p class="placeholder-desc">
        路径: <code>{{ route.path }}</code>
      </p>
      <p class="placeholder-hint">
        请在 <code>src/views{{ route.path }}/index.vue</code> 创建页面组件
      </p>
    </div>
  </div>
</template>

<style scoped>
.placeholder-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
}

.placeholder-content {
  text-align: center;
  max-width: 500px;
}

.placeholder-icon {
  color: var(--primary-color);
  margin-bottom: 20px;
  opacity: 0.6;
}

.placeholder-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-color-1);
}

.placeholder-desc {
  font-size: 14px;
  color: var(--text-color-3);
  margin-bottom: 8px;
}

.placeholder-hint {
  font-size: 13px;
  color: var(--text-color-3);
  margin-top: 16px;
  padding: 12px;
  background: var(--color-target-bg);
  border-radius: 6px;
}

code {
  padding: 2px 6px;
  background: var(--code-bg-color);
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9em;
}
</style>
