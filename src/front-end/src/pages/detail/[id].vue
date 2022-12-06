<template>
  <div class="manga-detail-container">
    <section class="manga-player">

      <player-view :auto-play="parsedAutoPlay"></player-view>
    </section>

    <!-- <section class="manga-episode-navigator">
      <div v-if="detail" class="manga-detail">
        <div class="manga-presentation">
          <img class="manga-detail-image" :src="detail.image_link"/>
          <div class="manga-description"></div>
        </div>
      </div>
      <ul ref="episodeCarroussel" class="manga-episode-list">
        <li :ref="setRef" v-if="detail" v-for="episode in detail.episodes" :class="episode.active ? 'manga-episode-active' : ''">
          <router-link :to="`/detail/${episode.id}`" custom v-slot="{ navigate }">
            <div @click="navigate">
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
    </section> -->
  </div>


</template>

<script setup lang="ts">
  import { watchEffect, computed } from 'vue'
  import { onBeforeRouteLeave } from 'vue-router';
  import PlayerView from './playerView.vue';
  import { useRoute } from 'vue-router';

  const mangaStore =  useMangaStore()
  const props = defineProps<{ id: string }>()
  const { loadMangaDetail, loadMangaPlayer, setMangaDetail, setMangaPlayer, setManga } = mangaStore
  const route = useRoute()
  const autoPlay = ref<boolean>(false)
  const activeEpisodeElement = ref<HTMLDivElement[]>([])
  let tryNumber : number = 0

  const parsedAutoPlay = computed(() => {
    return autoPlay.value = route.query.autoPlay === "true"
  })

  watchEffect(() =>{
    let target = activeEpisodeElement.value[0]

    target?.scrollIntoView()
  })

  watchEffect(async () => {
    await loadMangaDetail(props.id)
      .then( () => loadMangaPlayer(tryNumber))
      .catch( e => console.log('can\'t load player'))
  })

  onBeforeRouteLeave(() => {
    // if(calculateProgress(videoPlayer) > 0) updateHistory(detail.value, videoPlayer)

    setManga(undefined)
    setMangaDetail(undefined)
    setMangaPlayer(undefined)

  })

</script>

<style lang="css">

  .manga-detail-container {
    height: 100%;
  }

  .manga-player {
    width: 100%;
    height: 100%;
  }

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
    flex: 1;
    overflow-x: scroll;
  }

  .manga-episode-navigator {
    display: flex;
    flex-direction: row;
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

  .manga-episode-list li.manga-episode-active > div {
    background: lightseagreen;
  }
</style>
