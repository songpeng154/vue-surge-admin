<script setup lang="ts">
interface HoverContainerProps {
  inverted?: boolean

  tooltip?: string
}

interface HoverContainerEmits {
  (e: 'click', event: MouseEvent): void
}

defineProps<HoverContainerProps>()

defineEmits<HoverContainerEmits>()
</script>

<template>
  <n-tooltip v-if="tooltip" trigger="hover">
    <template #trigger>
      <div
        class="iconHoverContainer"
        :class="{ inverted }"
        @click="$emit('click', $event)"
      >
        <slot />
      </div>
    </template>
    {{ tooltip }}
  </n-tooltip>
  <div
    v-else
    class="iconHoverContainer"
    :class="{ inverted }"
    @click="$emit('click', $event)"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.iconHoverContainer {
  border-radius: var(--border-radius-md);
  padding: 7px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: .1s;
  font-size: 16px;
  flex-shrink: 0;

  &:hover {
    background: var(--fill-color-secondary);
  }

  &.inverted:hover {
    background: var(--fill-color-inverted);
  }
}
</style>
