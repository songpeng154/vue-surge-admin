<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { isNumber } from 'es-toolkit/compat'
import { computed } from 'vue'

export interface IconifyIconProps {
  // 图标名称 例如：mdi:account | mdi-account
  icon?: string

  // 颜色
  color?: string

  // 大小
  size?: string | number

  // 指针
  pointer?: boolean
}

const props = defineProps<IconifyIconProps>()

const style = computed(() => ({
  cursor: props.pointer ? 'pointer' : undefined,
  color: props.color,
  width: isNumber(props.size) ? `${props.size}px` : props.size,
  height: isNumber(props.size) ? `${props.size}px` : props.size,
  stroke: 'none',
}))
</script>

<template>
  <!-- iconify 图标 -->
  <Icon
    :icon="icon as string"
    :style="style"
  />
</template>

<style lang="scss" scoped>

</style>
