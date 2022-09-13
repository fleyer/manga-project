<template>
  <section>
    <div v-if="detail" class="manga-detail">
        <div class="manga-presentation">
          <img class="manga-detail-image" :src="detail.image_link"/>
          <div class="manga-description"></div>
        </div>
        <!-- <iframe class="manga-player" v-if="detail.current_episode" allowfullscreen="true" width="800" height="500" :src="detail.current_episode.player_link"/> -->
    </div>
  </section>

  <section class="manga-episode-navigator">
    <ul class="manga-episode-list">
      <li v-if="detail" v-for="episode in detail.episodes">
        <router-link :to="`/detail/${episode.id}`" custom v-slot="{ navigate }">
          <div :class="episode.active ? 'manga-episode-active' : ''" @click="navigate">
            <span>{{episode.episode}}</span>
          </div>
        </router-link>
      </li>

      <li v-if="detail && nextEpisode">
        <router-link :to="`/detail/${nextEpisode.id}`">
          {{nextEpisode.episode}} next >>
        </router-link>

      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
  import { watchEffect } from 'vue'
  import { onBeforeRouteLeave } from 'vue-router';
  import { storeToRefs } from 'pinia';

  const mangaStore =  useMangaStore()
  const props = defineProps<{ id: string }>()
  const { loadMangaDetail,setMangaDetail,setManga } = mangaStore
  const { detail, nextEpisode } = storeToRefs(mangaStore)

  watchEffect(async () => {

    loadMangaDetail(props.id)

  })

  onBeforeRouteLeave(() => {
    setManga(undefined)
    setMangaDetail(undefined)
  })

</script>

<style lang="css">

  .manga-detail {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
  }

  .manga-title {
    line-height: 20px;
  }

  .manga-detail-image {
    max-width: 300px;
  }

  .manga-player {
  }

  .manga-presentation {
    min-width: 300px;
    max-width: 500px;
    padding-right: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .manga-episode-list {
    display: flex;
  }

  .manga-episode-navigator {
    overflow-x: scroll;
  }

  .manga-episode-list > li > div {
    min-width: 300px;
    height: 150px;
    background: #212121;
    border-radius: 4px;
    cursor: pointer;
  }

  .manga-episode-list li + li {
    margin-left: 10px;
  }

  .manga-episode-list li div.manga-episode-active {
    background: lightseagreen;
  }
</style>
