<script lang="ts" setup>
defineOptions({ name: 'ConfigMenu' })

defineProps<Props>()

interface Props {
  label: string
}
</script>

<template>
  <div class="configMenu">
    <span class="configMenu-title">{{ label }}</span>
    <div class="configMenu-content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.configMenu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  &-title {
    color: var(--text-color-main);
  }

  &-content {
    width: 120px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
