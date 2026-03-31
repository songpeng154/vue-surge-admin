<script setup lang="ts">
import AccessCount from '@/views/home/access-count.vue'
import Chart from '@/views/home/chart.vue'
import Statistics from '@/views/home/statistics.vue'

console.log(location)
</script>

<template>
  <div class="flex flex-col gap-10px h-full">
    <Statistics />
    <AccessCount />
    <Chart />
  </div>
</template>

<style scoped lang="scss"></style>
