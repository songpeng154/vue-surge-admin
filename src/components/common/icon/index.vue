<script setup lang="ts">
import type { StyleValue } from 'vue'
import { isNumber } from 'es-toolkit/compat'
import { computed } from 'vue'

export interface IconProps {
  // 图标名称 例如：i-mdi:account | i-local:login
  icon: 'i-' | 'i-local:' | string

  // 颜色
  color?: string

  // 大小
  size?: string | number

  // 指针
  pointer?: boolean
}

const props = defineProps<IconProps>()

const style = computed<Partial<StyleValue>>(() => {
  return {
    width: isNumber(props.size) ? `${props.size}px` : props.size,
    height: isNumber(props.size) ? `${props.size}px` : props.size,
    color: props.color,
    cursor: props.pointer ? 'pointer' : undefined,
  }
})
</script>

<template>
  <i :class="icon" :style="style" />
</template>

<style scoped lang="scss">

</style>
