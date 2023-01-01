<template>
  <section>
    <div class="section-title">
      <slot name="title" v-if="(items.length > 0)"></slot>
    </div>
    <ul :class="['section', ... computedCssClasses]">
      <li class="section-item" v-for="item in items">
        <slot name="item" :item="item">
          {{(JSON.stringify(item))}}
        </slot>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
  const { items, customCssClasses } = defineProps<{
    items: any,
    customCssClasses?: string[]
  }>()

  const computedCssClasses = computed(() => {
    return customCssClasses || []
  })
</script>

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
