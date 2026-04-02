<script lang="ts" setup>
import type { DropdownOption } from 'naive-ui/es/dropdown/src/interface'
import type { RouteLocationMatched } from 'vue-router'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RouterConstant from '@/constant/router'
import useAppStore from '@/store/modules/app'

const routes = ref<DropdownOption[]>([])
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

function routeMatchedToBreadcrumb(routeMatched: RouteLocationMatched[]) {
  return routeMatched.map<DropdownOption>((item) => {
    return {
      key: item.path,
      label: item.meta?.title,
      children: item.children?.length ? routeMatchedToBreadcrumb(item.children as RouteLocationMatched[]) : undefined,
    }
  })
}

function handleSelect(key) {
  router.push(key)
}

watch(() => route.path, () => {
  routes.value = routeMatchedToBreadcrumb(route.matched).filter(item => !item.key.includes(RouterConstant.CONTAINER_SUFFIX))
}, { immediate: true })
</script>

<template>
  <n-breadcrumb class="breadcrumb" :class="{ inverted: appStore.isInvertedHeader }">
    <n-breadcrumb-item v-for="item in routes" :key="item.key">
      <n-dropdown
        :inverted="appStore.isInvertedHeader"
        :options="item.children"
        @select="handleSelect"
      >
        <span>{{ item.label }}</span>
      </n-dropdown>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;

  &.inverted {
    :deep(.n-breadcrumb-item__link), :deep(.n-breadcrumb-item__separator) {
      color:  var(--text-color-inverted);
    }
  }
}
</style>
