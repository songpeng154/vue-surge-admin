<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <iframe :src="route.meta.iframeSrc" class="size-full" />
</template>

<style scoped lang="scss">

</style>
