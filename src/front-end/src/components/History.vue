<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ComputedRef } from 'vue';
  import { MangaHistory } from '~/types';
  import Progress from './Progress.vue'

  const historyStore = useHistoryStore()
  const { history } = storeToRefs(historyStore)

  const historyList : ComputedRef<MangaHistory[]> = computed(() => {
    return Object.keys(history.value || []).map(key => (history.value[key]))
  })

</script>

<template>
  <ul class="manga-history">
    <li class="manga-history-item" v-for="historyItem in historyList">
      <router-link :to="`/detail/${historyItem.id}`">
        <div class="manga-history-title">
          <h1>{{historyItem.title}}</h1>
        </div>
        <div class="manga-history-progress"><Progress :progress="historyItem.progress"></Progress></div>
      </router-link>
    </li>
  </ul>
</template>

<style>

  .manga-history-title {
    display: flex;
  }

  .manga-history-progress {
    position: absolute;
    bottom: 0;
    padding: 4px;
    width: 100%;
  }

  .manga-history {
    display: flex;
    overflow-x: auto;
  }

  .manga-history-item {
    border: 1px solid #212121;
    border-radius: 4px;
    width: 300px;
    margin: 4px;
    position: relative;
  }

  .manga-history-item h1 {
    margin-bottom: 15px;
  }
</style>
