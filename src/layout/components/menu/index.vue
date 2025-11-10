<script setup lang="tsx">
import type { MenuMixedOption } from 'naive-ui/es/menu/src/interface'
import type { MenuProps } from '@/layout/components/menu/type/props.ts'
import omitProps from '@/hooks/common/omit-props.ts'
import renderIcon from '@/hooks/components/render-icon.ts'
import useAppStore from '@/store/modules/app'
import RegUtils from '@/utils/reg.ts'

const props = defineProps<MenuProps>()

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const { RenderDynamicIcon } = renderIcon()
const menuProps = omitProps(props, ['routes'])

const menus = computed(() => routesToMenus(props.routes))

const label = (title: string | undefined) => (
  <n-ellipsis>
    <span>{ title }</span>
  </n-ellipsis>
)

const labelContainer = (route: AppRouteRecordRaw) => {
  if (!RegUtils.MATCH_URL.test(route.path)) return () => label(route.meta?.title)
  return () => (
    <div class="flex items-center justify-between gap-1">
      { label(route.meta?.title) }
      <icon class="shrink-0" icon="i-ic:outline-call-made" size="14px"></icon>
    </div>
  )
}

function routesToMenus(routes: AppRouteRecordRaw[]): MenuMixedOption[] {
  return routes.reduce<MenuMixedOption[]>((menuList, item) => {
    if (item.meta?.hideMenu) return menuList
    menuList.push({
      key: item.path,
      icon: item.meta?.icon ? () => RenderDynamicIcon(item.meta?.icon as string) : undefined,
      label: labelContainer(item),
      show: item.meta?.hideMenu,
      disabled: item.meta?.disabledMenu,
      children: item.children?.length ? routesToMenus(item.children) : undefined,
    })
    return menuList
  }, [])
}

function onClick(key) {
  router.push(key)
}
</script>

<template>
  <n-menu
    :value="route.path"
    :options="menus"
    :accordion="appStore.isMenuAccordion"
    v-bind="menuProps"
    class="menu w-full"
    @update:value="onClick"
  />
</template>

<style scoped lang="scss">
.menu *{
  user-select: none;
}
</style>
