<script setup lang="ts"></script>

<template>
  <div class="dynamicBackground" />
</template>

<style scoped lang="scss">
.dynamicBackground {
    height: 100%;
    width: 100%;
    background: theme("colors.primary");
    -webkit-mask: url("@/assets/svg/bg.svg") no-repeat bottom;
    mask: url("@/assets/svg/bg.svg") no-repeat bottom;
    mask-size: 100%;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}
</style>
