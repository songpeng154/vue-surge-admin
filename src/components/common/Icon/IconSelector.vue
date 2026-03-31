<script lang="ts" setup>
import { listIcons } from '@iconify/vue'
import { useToggle } from '@vueuse/core'
import { ref } from 'vue'
import { iconSetPrefix } from '@/assets/iconify'
import { hasScrollBar } from '@/utils'

const iconValue = defineModel<string>('value')

const [visible, setVisible] = useToggle()
const scrollContainer = useTemplateRef<HTMLDivElement>('scrollContainer')
const { y, arrivedState } = useScroll(scrollContainer)

const icons = ref<string[]>(listIcons('', iconSetPrefix[0]))
const pageIcons = ref<string[]>([])
const lastScrollHeight = ref(0)
// 选择图标
function selectIcon(icon: string) {
  iconValue.value = icon
  setVisible(false)
}

function onTabsChange(key: string) {
  pageIcons.value = []
  lastScrollHeight.value = 0
  icons.value = listIcons('', key)
  fullContainer()
}

async function fullContainer() {
  await nextTick()
  if (!scrollContainer.value)
    return
  const hasScroll = hasScrollBar(scrollContainer.value)
  if (hasScroll)
    return
  loadIcon()
  await nextTick()
  await fullContainer()
}

function loadIcon() {
  if (pageIcons.value.length === icons.value.length)
    return

  pageIcons.value.push(...icons.value.slice(pageIcons.value.length, pageIcons.value.length + 100))
}

watch(() => arrivedState.bottom, () => {
  if (!arrivedState.bottom)
    return
  loadIcon()
})

watch(visible, () => {
  if (visible.value) {
    nextTick(() => {
      y.value = lastScrollHeight.value
    })
    fullContainer()
  }
  else {
    lastScrollHeight.value = y.value
  }
})
</script>

<template>
  <n-popover
    v-model:show="visible"
    width="trigger"
    :show-arrow="false"
    trigger="click"
  >
    <template #trigger>
      <n-input-group>
        <n-input
          v-model:value="iconValue"
          placeholder="请选择图标"
          readonly
          style="width: calc(100% - 52px)"
        />
        <n-button
          class="flex-1"
          :bordered="false"
          type="primary"
          tertiary
        >
          <template #icon>
            <iconify-icon size="18px" :icon="iconValue || 'ant-design:appstore-twotone'" />
          </template>
        </n-button>
      </n-input-group>
    </template>
    <template v-if="iconSetPrefix.length">
      <n-tabs animated @update:value="onTabsChange">
        <n-tab-pane
          v-for="item in iconSetPrefix"
          :key="item"
          :name="item"
          :tab="item"
        />
      </n-tabs>
      <div
        ref="scrollContainer"
        class="px-1 gap-[5px] grid grid-cols-[repeat(auto-fill,40px)] h-[300px] justify-between overflow-auto"
      >
        <div
          v-for="item in pageIcons"
          :key="item"
          class="border-base border rounded border-solid flex-center h-[40px] w-[100%] cursor-pointer hover:border-primary"
          :class="item === iconValue ? 'border-primary text-primary' : undefined"
          @click="selectIcon(item)"
        >
          <iconify-icon size="20px" :icon="item" />
        </div>
      </div>
    </template>
    <n-empty v-else description="没有图标集" />
  </n-popover>
</template>

<style lang="scss" scoped>

</style>
