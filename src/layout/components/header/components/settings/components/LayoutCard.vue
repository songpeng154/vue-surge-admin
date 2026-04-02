<script lang="ts" setup>
interface Props {
  // 是否激活
  active?: boolean

  // 弹框文字内容
  popoverContent?: string
}

interface Emits {
  (e: 'click'): void
}

defineOptions({ name: 'LayoutCard' })
defineProps<Props>()
const emits = defineEmits<Emits>()
</script>

<template>
  <n-popover trigger="hover">
    <template #trigger>
      <div
        :class="active ? 'active' : undefined"
        class="layoutCard"
        @click="emits('click')"
      >
        <slot />
      </div>
    </template>
    <span>{{ popoverContent }}</span>
  </n-popover>
</template>

<style lang="scss" scoped>
.layoutCard {
  background: var(--background-color-container);
  width: 105px;
  height: 85px;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  border: 3px solid var(--primary-shallow);
  padding: 3px;
  gap: 4px;

  &.active {
    box-shadow: 5px 5px 5px var(--primary-shallow);
    border-color: var(--primary-main);
  }
}
</style>
