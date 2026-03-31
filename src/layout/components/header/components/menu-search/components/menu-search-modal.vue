<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { menuSearchCache } from '@/store/caches'
import useAuthStore from '@/store/modules/auth'

export interface MenuSearchOption {
  labels: string[]

  path: string

  icon?: string
}

const visible = defineModel<boolean>('visible')

const authStore = useAuthStore()
const router = useRouter()

const menus = ref<MenuSearchOption[]>([])
const searchText = ref('')
const searchResult = ref<MenuSearchOption[]>(menuSearchCache.get() || [])
const active = ref(0)

const isNotFound = computed(() => searchText.value.length && !searchResult.value.length)

// 扁平化菜单
function flattenMenu(menus: AppRouteRecordRaw[]): MenuSearchOption[] {
  const menuList: MenuSearchOption[] = []
  const handle = (menus: AppRouteRecordRaw[], iconName?: string | undefined, menuNameList?: string[]) => {
    menus.forEach((menu) => {
      const icon = iconName || menu.meta?.icon
      const menuNames = menuNameList || []
      if (!menu.children?.length) {
        menuList.push({
          icon,
          labels: [...menuNames, menu.meta?.title as string],
          path: menu.path,
        })
      }

      else {
        menuNames.push(menu.meta?.title as string)
        handle(menu.children, icon, menuNames)
      }
    })
  }
  handle(menus)
  return menuList
}

// 处理键盘事件
function handleKeyboardEvents(event: KeyboardEvent) {
  if (!visible.value)
    return
  const length = searchResult.value.length
  const menu = searchResult.value[active.value]
  if (!length)
    return
  switch (event.code) {
    case 'ArrowUp':
      active.value === 0 ? (active.value = length - 1) : (active.value -= 1)
      break
    case 'ArrowDown':
      active.value === length - 1 ? (active.value = 0) : (active.value += 1)
      break
    case 'Enter':
      handleMenuClick(menu)
      break
  }
}

function handleMenuClick(menu: MenuSearchOption) {
  router.push(menu.path)
  visible.value = false
  const menuSearch = menuSearchCache.get() || []
  const isExists = menuSearch.some(item => menu.path === item.path)
  if (!isExists) {
    menuSearch.unshift(menu)
    menuSearchCache.set(menuSearch)
  }
}

function onSearch() {
  const value = searchText.value
  if (value.length === 0)
    searchResult.value = menuSearchCache.get() || []

  else
    searchResult.value = menus.value.filter(item => item.labels.some(name => value && name.includes(value)))
}

onMounted(() => {
  menus.value = flattenMenu(authStore.routes)
})

useEventListener(window, 'keyup', handleKeyboardEvents)

watch(visible, () => {
  if (!visible.value) {
    searchText.value = ''
    searchResult.value = menuSearchCache.get() || []
  }
})
</script>

<template>
  <n-modal
    v-model:show="visible"
    title="搜索菜单"
    style="width: 680px;margin-top: 100px"
    :closable="false"
    :bordered="false"
    preset="card"
  >
    <n-flex vertical>
      <n-input
        v-model:value="searchText"
        autofocus
        placeholder="请输入你想搜索的菜单"
        size="large"
        @input="onSearch"
      >
        <template #suffix>
          <icon icon="i-ant-design:search-outlined" />
        </template>
      </n-input>
      <div class="menuSearchModal">
        <div
          v-for="(item, i) in searchResult"
          :key="item.path"
          :class="{ active: active === i }"
          class="menuSearchModal-card"
          size="small"
          @click="handleMenuClick(item)"
        >
          <div class="menuSearchModal-card-name">
            <iconify-icon :icon="item.icon" />
            <span v-for="(label, index) in item.labels" :key="label">{{ label }}
              <icon
                v-if="index !== item.labels.length - 1"
                icon="i-tabler:arrow-narrow-right"
                class="text-xs"
              />
            </span>
          </div>
          <icon icon="i-tabler:arrow-back" />
        </div>
        <n-empty v-show="isNotFound" description="没有搜索到" />
      </div>
    </n-flex>
    <template #footer>
      <div class="menuSearchModal-footer">
        <div class="menuSearchModal-footer-keys">
          <div>
            <icon icon="i-tabler:arrow-back" />
          </div>
          <span>选择</span>
        </div>
        <div class="menuSearchModal-footer-keys">
          <div>
            <icon icon="i-tabler:arrow-narrow-up" />
            <icon icon="i-tabler:arrow-narrow-down" />
          </div>
          <span>切换</span>
        </div>
        <div class="menuSearchModal-footer-keys">
          <div>
            <i>esc</i>
          </div>
          <span>切换</span>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<style lang="scss" scoped>
.menuSearchModal {
  max-height: 500px;
  overflow: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &-card {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    gap: 15px;
    padding: 15px;
    border-radius: theme('borderRadius.md');
    border: 1px solid theme('borderColor.secondary');

    &.active {
      background: theme('colors.primaryShallow');
      color: theme('colors.primary');
      box-shadow: 5px 5px 5px theme('colors.primaryShallow');
    }

    svg {
      flex-shrink: 0;
    }

    &-name {
      display: flex;
      align-items: center;
      gap: 15px;

      span {
        display: flex;
        align-items: center;
        gap: 15px;
      }
    }
  }

  &-footer {
    display: flex;
    align-items: center;
    gap: 10px;

    &-keys {
      color: theme('textColor.tertiary');
      display: flex;
      align-items: center;
      gap: 5px;

      div {
        display: flex;
        align-items: center;
        background: theme('colors.fill.secondary');
        width: 30px;
        height: 20px;
        justify-content: center;
      }
    }
  }
}
</style>
