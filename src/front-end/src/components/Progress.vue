<script setup lang="ts">
  const props = defineProps<{ progress: number }>()
  const computedPercentage = computed( () => {
    return props.progress > 5 ? props.progress : 5
  })
</script>

<template>
  <div class="progress">
    <div class="progress-bar" :style="{ width: `${computedPercentage}%`}"></div>
  </div>
</template>

<style>
  .progress {
    width: 100%;
    padding: 2px;
  }

  .progress-bar {
    background: red;
    height: 4px;
  }
</style>
