<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ComputedRef } from 'vue';
  import { MangaHistory } from '~/types';
  import Progress from '../Progress.vue'
  import { getDetailLink } from '~/model/manga'

  const historyStore = useHistoryStore()
  const { history } = storeToRefs(historyStore)

  const historyList : ComputedRef<MangaHistory[]> = computed(() => {
    return Object.keys(history.value || []).map(key => (history.value[key]))
  })

  const deleteHistoryItem = (event : Event, item: MangaHistory) => {
    event.preventDefault()

    historyStore.deleteHistory(item)
  }

</script>

<template>
  <Section :items="historyList" :custom-css-classes="['overflow-x-auto']">
    <template #title>Continue watching</template>
    <template #item="{item}"><router-link :to="getDetailLink(item)">
      <div class="manga-history w-full h-full">
        <div class="manga-history-title mb-3">
          <h1>{{item.title}}</h1>
        </div>
        <div class="manga-history-progress"><Progress :progress="item.progress"></Progress></div>
        <div class="manga-history-menu items-center" @click="(event) => deleteHistoryItem(event,item)">
          <div i-carbon-trash-can></div>
        </div>
      </div>

      </router-link></template>
  </Section>
</template>

<style>

  .manga-history-menu {
    position: absolute;
    top: 0;
    right: 0;
    padding: 4px;
    display: none;
    height: 100%;
    background-color: lightseagreen;
  }

  .manga-history:hover .manga-history-menu {
    display: flex;
  }

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
