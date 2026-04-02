<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Logo from '@/layout/components/logo.vue'
import MixSidebarDrawers from '@/layout/components/sidebar/components/mix-sidebar/components/mix-sidebar-drawers.vue'
import useAppStore from '@/store/modules/app'
import useAuthStore from '@/store/modules/auth'

defineOptions({ name: 'MixSidebar' })

const appStore = useAppStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const menus = ref<AppRouteRecordRaw[]>([])
const temporaryActivePath = ref<Nullable<string>>()

const collapsedIcon = computed(() => appStore.isCollapsedMixSidebar
  ? 'i-ant-design:double-right-outlined'
  : 'i-ant-design:double-left-outlined')

// 获取路由的Root
function getPathRoot(path: string) {
  const handle = (routes: AppRouteRecordRaw[]) => {
    return routes.find((item) => {
      if (item.path === path)
        return true
      return item.children?.length ? handle(item.children) : false
    })
  }
  return handle(authStore.routes)
}

function handleMixMenuItem(submenu: AppRouteRecordRaw) {
  temporaryActivePath.value = submenu.path
  if (submenu.children?.length) {
    menus.value = submenu.children
    appStore.toggleMixSidebarDrawerVisible(true)
  }
  else {
    router.push(submenu.path)
    if (!appStore.isFixedMixSidebarDrawer)
      appStore.toggleMixSidebarDrawerVisible(false)
    menus.value = []
  }
}

function isActive(path: string) {
  if (temporaryActivePath.value)
    return temporaryActivePath.value === path ? 'active' : undefined
  return route.matched.some(item => item.path === path) ? 'active' : undefined
}

function onMouseLeave() {
  !appStore.isFixedMixSidebarDrawer && appStore.toggleMixSidebarDrawerVisible(false)
  temporaryActivePath.value = null
  menus.value = getPathRoot(route.path)?.children || []
}

watch(() => route.path, () => {
  menus.value = getPathRoot(route.path)?.children || []
}, { immediate: true })
</script>

<template>
  <div
    :style="{ width: `${appStore.dynamicMixSidebarWidth}px` }"
    class="mixSidebar"
    :class="{ inverted: appStore.isInvertedSidebar }"
    @mouseleave="onMouseLeave"
  >
    <Logo />
    <div class="mixSidebar-container">
      <div
        v-for="(item) in authStore.routes"
        :key="item.path"
        :class="isActive(item.path)"
        class="mixSidebar-container-menu"
        @click="handleMixMenuItem(item)"
      >
        <iconify-icon
          :icon="item?.meta?.icon"
          :size="appStore.isCollapsedMixSidebar ? 20 : 24"
          pointer
        />
        <n-collapse-transition class="text-center" :show="!appStore.isCollapsedMixSidebar">
          <n-ellipsis>
            {{ item?.meta?.title }}
          </n-ellipsis>
        </n-collapse-transition>
      </div>
    </div>
    <div
      :style="{ height: `${appStore.footerHeight}px` }"
      class="mixSidebar-footer"
      @click="() => appStore.toggleMixSidebarCollapsed()"
    >
      <icon :icon="collapsedIcon" />
    </div>
    <MixSidebarDrawers :menus="menus" />
  </div>
</template>

<style lang="scss" scoped>
.mixSidebar {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: width .2s ease-in-out;

  &-container {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 7px;
    padding: 7px;

    &-menu {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px 7px;
      transition: .2s;
      border-radius: var(--border-radius-md);
      cursor: pointer;
      font-size: 12px;

      :deep(svg) {
        transition: width, height .2s ease-in-out;
      }

      &:hover:not(.active) {
        background:  var(--fill-color-tertiary);
      }

      &.active {
        background: var(--primary-main);
        color: white;
      }
    }
  }

  &-footer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: var(--border-radius-md);

    &:hover {
      background: var(--fill-color-tertiary);
    }
  }

  &.inverted {
    border-right: 1px solid var(--border-color-inverted);

    .mixSidebar-container-menu {
      &:hover:not(.active) {
        background: var(--fill-color-inverted);
      }
    }
  }

}
</style>
