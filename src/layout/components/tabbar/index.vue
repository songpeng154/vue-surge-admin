<script lang="ts" setup>
import type { Tab } from '@/store/modules/tab-bar/type'
import { useDebounceFn, useEventListener, useToggle } from '@vueuse/core'
import { nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ContextMenu from '@/layout/components/tabbar/components/context-menu.vue'
import useAppStore from '@/store/modules/app'
import useTabBarStore from '@/store/modules/tab-bar'
import { scrollToElement } from '@/utils'

defineOptions({ name: 'TabBar' })

const appStore = useAppStore()
const tabBarStore = useTabBarStore()
const route = useRoute()
const router = useRouter()
// 滚动按钮是否可见
const [scrollBtnVisible, toggleScrollBtnVisible] = useToggle()
const [contextMenuVisible, setContextMenuVisible] = useToggle()

const tabBarContainer = ref<HTMLElement>()
const x = ref(0)
const y = ref(0)
const currentTab = ref<Tab>()

// 处理滚动按钮是否显示
async function handleScrollBtnVisible() {
  await nextTick()
  if (!tabBarContainer.value)
    return
  toggleScrollBtnVisible(tabBarContainer.value.scrollWidth > tabBarContainer.value.clientWidth)
}

function toScroll(direction: 'left' | 'right') {
  const container = tabBarContainer.value
  if (!container)
    return
  container.scrollTo({
    left: direction === 'right'
      ? container.clientWidth + container.scrollLeft
      : container.scrollLeft - container.clientWidth,
    behavior: 'smooth',
  })
}

// 滚动到激活的位置
const scrollToActive = useDebounceFn(async () => {
  if (!tabBarContainer.value)
    return
  await nextTick()
  const container = tabBarContainer.value
  const child = container.children[tabBarStore.getIndex(route.path)] as HTMLElement
  scrollToElement(child)
}, 300)

function handleContextMenu(e: MouseEvent, tab: Tab) {
  x.value = e.x
  y.value = e.y
  currentTab.value = tab
  setContextMenuVisible(true)
}

useEventListener('resize', () => {
  handleScrollBtnVisible()
})

// 监听路由变化
watch(() => route.fullPath, () => {
  scrollToActive()
}, { immediate: true })

watch(tabBarStore.tabs, () => {
  handleScrollBtnVisible()
}, { immediate: true })
</script>

<template>
  <div
    v-if="appStore.tabBarVisible"
    :style="{ height: `${appStore.tabBarHeight}px` }"
    class="tabBar"
  >
    <div
      v-if="scrollBtnVisible"
      class="tabBar-item action"
      @click="toScroll('left')"
    >
      <icon icon="i-ic:baseline-chevron-left" />
    </div>
    <div ref="tabBarContainer" class="tabBar-container">
      <div
        v-for="item in tabBarStore.tabs"
        :key="item.path"
        :class="route.path === item.path ? 'active' : undefined"
        class="tabBar-item"
        @click="router.push(item.fullPath)"
        @contextmenu.prevent="handleContextMenu($event, item)"
      >
        {{ item.meta?.title }}
        <icon
          v-if="!item.meta?.affixTab && tabBarStore.tabs.length > 1"
          icon="i-ic:round-close"
          class="tabBar-item-clear text-xs"
          @click.stop="tabBarStore.closeTab(item)"
        />
      </div>
    </div>
    <div
      v-if="scrollBtnVisible"
      class="tabBar-item action"
      @click="toScroll('right')"
    >
      <icon icon="i-ic:baseline-chevron-right" />
    </div>
    <div class="tabBar-item action" @click="tabBarStore.refresh()">
      <icon
        :style="{ animationDuration: `${tabBarStore.refreshWaitDuration}ms` }"
        :class="{ 'animate-spin': !tabBarStore.refreshFlag }"
        icon="i-ic:baseline-refresh"
      />
    </div>
    <ContextMenu trigger="click">
      <div class="tabBar-item action">
        <icon icon="i-ic:baseline-keyboard-arrow-down" />
      </div>
    </ContextMenu>
  </div>
  <ContextMenu
    v-model:visible="contextMenuVisible"
    trigger="manual"
    :x="x"
    :y="y"
    :tab="currentTab"
  />
</template>

<style lang="scss" scoped>
.tabBar {
  width: 100%;
  background: var(--background-color-layout);
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  transition: height .2s ease-in-out;

  &-item {
    padding: 0 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--background-color-container);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--border-color-tertiary);
    user-select: none;
    cursor: pointer;
    height: 30px;
    flex-shrink: 0;
    color: var(--text-color-main);
    gap: 5px;
    font-size: 14px;
    white-space: nowrap;

    &.action {
      width: 30px;
      padding: 0;
    }

    &.active {
      color: white;
      background: var(--primary-main);

      .tabBar-item-clear {
        color: white !important;
      }
    }

    &-clear {
      transition: 0.1s;
      margin-right: -5px;
      color: var(--text-color-tertiary);

      &:hover {
        color: var(--text-color-main);
      }
    }
  }

  & .loading {
    animation: loading 1s ease;
  }

  &-container {
    flex: 1;
    display: flex;
    gap: 6px;
    overflow: hidden;
    height: 100%;
    align-items: center;
  }
}
</style>
