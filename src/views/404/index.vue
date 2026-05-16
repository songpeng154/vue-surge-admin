<script lang="ts" setup>
import { useRouter } from 'vue-router'
import useAuthStore from '@/store/modules/auth'

defineOptions({ name: 'NotFound' })
const router = useRouter()
function goHome() {
  const authStore = useAuthStore()
  router.push(authStore.homePath)
}
</script>

<template>
  <div class="notFound">
    <icon icon="i-local-404" size="50%" />
    <n-button
      size="large"
      type="primary"
      @click="goHome"
    >
      返回首页
    </n-button>
  </div>
</template>

<style lang="scss" scoped>
.notFound {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: 20px;
}
</style>
