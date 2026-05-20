import type { IconProps as DynamicIconProps } from '@iconify/vue'
import type { IconProps } from '@/components/common/icon/index.vue'
import { Icon as DynamicIcon } from '@iconify/vue'
import { h } from 'vue'
import Icon from '@/components/common/icon/index.vue'

function renderIcon() {
  // 渲染 uno 图标（可以离线使用，无法动态使用）
  const RenderUnoIcon = (icon: IconProps['icon'], props?: IconProps | Recordable) => h(Icon, { icon, ...props })

  // 动态图标（图标集范围在 src/assets/iconify/index.ts 中查看，可以离线使用，可以动态使用）
  const RenderDynamicIcon = (icon: string, props?: Omit<DynamicIconProps, 'icon'>) => h(DynamicIcon, { icon, ...props })

  return { RenderUnoIcon, RenderDynamicIcon }
}

export default renderIcon
