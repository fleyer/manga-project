<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ComputedRef } from 'vue';
  import { MangaHistory } from '~/types';
  import Progress from '../Progress.vue'

  const historyStore = useHistoryStore()
  const { history } = storeToRefs(historyStore)

  const historyList : ComputedRef<MangaHistory[]> = computed(() => {
    return Object.keys(history.value || []).map(key => (history.value[key]))
  })

</script>

<template>
  <Section :items="historyList" :custom-css-classes="['overflow-x-auto']">
    <template #title>Continue watching</template>
    <template #item="{item}"><router-link :to="`/detail/${item.id}`">
        <div class="manga-history-title">
          <h1>{{item.title}}</h1>
        </div>
        <div class="manga-history-progress"><Progress :progress="item.progress"></Progress></div>
      </router-link></template>
  </Section>
</template>

<style>

  .manga-history-progress {
    position: absolute;
    bottom: 0;
    padding: 4px;
    width: 100%;
  }

  .manga-history-item {
    border: 1px solid #212121;
    border-radius: 4px;
    width: 300px;
    min-width: 300px;
    margin: 4px;
    position: relative;
  }

  .manga-history-item h1 {
    margin-bottom: 15px;
  }
</style>
