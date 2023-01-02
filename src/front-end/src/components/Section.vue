<script setup lang="ts">
const { items, customCssClasses } = defineProps<{
  items: any
  customCssClasses?: string[]
}>()

const computedCssClasses = computed(() => {
  return customCssClasses || []
})
</script>

<template>
  <section>
    <div class="section-title">
      <slot v-if="(items.length > 0)" name="title" />
    </div>
    <ul class="section" :class="[... computedCssClasses]">
      <li v-for="item in items" :key="item.id" class="section-item">
        <slot name="item" :item="item">
          {{ JSON.stringify(item) }}
        </slot>
      </li>
    </ul>
  </section>
</template>

<style>
  .section {
    display: flex;
    overflow-x: auto;
  }

  .section-title {
    text-align: start;
  }

  .section-item {
    border: 1px solid #212121;
    border-radius: 4px;
    width: 300px;
    min-width: 300px;
    margin: 4px;
    position: relative;
    overflow: hidden;
  }
</style>
