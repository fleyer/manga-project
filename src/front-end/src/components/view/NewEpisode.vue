<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useNewEpisodeStore } from '~/store/newEpisode'
import { getDetailLink } from '~/model/manga'

const historyStore = useNewEpisodeStore()
const { newEpisodes } = storeToRefs(historyStore)

const newEpisodelist = computed(() => {
  return Object.keys(newEpisodes.value || [])
    .map(key => (newEpisodes.value[key]))
})
</script>

<template>
  <Section class="content" :items="newEpisodelist" :custom-css-classes="['overflow-x-auto']">
    <template #title>
      New episodes
    </template>
    <template #item="{ item }">
      <router-link :to="getDetailLink(item)">
        <div class="manga-history-title">
          <h1>{{ item.title }}</h1>
        </div>
      </router-link>
    </template>
  </Section>
</template>
