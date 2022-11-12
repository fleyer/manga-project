<template>
  <div class="manga-detail-container">
    <section class="manga-player">
      {{player}}
      <video :class="{visible: visible}" ref="videoPlayer" controls :src="activeLink" type="video/mp4" @play="onPlay"  @loadstart="onError" @loadedmetadata="onLoadMetaData"></video>
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
  import { ComponentPublicInstance, watchEffect } from 'vue'
  import type { Ref } from 'vue'
  import { onBeforeRouteLeave } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { MangaDetail, MangaHistory } from '~/types';

  const mangaStore =  useMangaStore()
  const historyStore =  useHistoryStore()
  const props = defineProps<{ id: string }>()
  const { loadMangaDetail, loadMangaPlayer, setMangaDetail, setMangaPlayer, setManga } = mangaStore
  const { pushHistory } = historyStore

  const { detail, player, activeLink } = storeToRefs(mangaStore)
  const { history } = storeToRefs(historyStore)
  // const episodeCarroussel = ref<HTMLDivElement>()
  const activeEpisodeElement = ref<HTMLDivElement[]>([])
  const videoPlayer : Ref<HTMLVideoElement | null> = ref(null)
  const visible = ref<boolean>(false)
  let tryNumber : number = 0

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
    if(calculateProgress(videoPlayer.value) > 0) updateHistory(detail.value, videoPlayer.value)

    setManga(undefined)
    setMangaDetail(undefined)
    setMangaPlayer(undefined)

    visible.value = false
  })

  function calculateProgress(videoPlayer : HTMLVideoElement | null) : number {
    return videoPlayer ? Math.round((videoPlayer.currentTime / videoPlayer.duration) * 100) : 0
  }

  function continueWatching(
    detail : MangaDetail,
    history : Record<string,MangaHistory>,
    videoPlayer? : HTMLVideoElement
  ){
    const mangaHistory = detail?.manga_title ? history[ detail?.manga_title ] : null

    if(mangaHistory && videoPlayer){
      videoPlayer.currentTime = videoPlayer.duration * mangaHistory.progress / 100
    }
  }

  function updateHistory( detail : MangaDetail | undefined, videoPlayer : HTMLVideoElement | null) {
    detail && pushHistory({
      id: props.id,
      title: detail.title,
      manga_title: detail.manga_title,
      image_link: detail.image_link,
      progress: calculateProgress(videoPlayer),
      episode: detail.current_episode.number,
      detail_link: ``,
      source: detail.source,
      subtitle: detail.subtitle
    })
  }

  function setRef(elem : ComponentPublicInstance<HTMLDivElement>) {
    elem?.classList.contains('manga-episode-active') && activeEpisodeElement.value.push(elem)

    return elem
  }

  function onError(e : any){

    if(tryNumber < 1){
      tryNumber++
      detail && loadMangaPlayer(tryNumber)
    }
  }

  function onPlay(){
    updateHistory(detail.value,videoPlayer.value)
  }

  function onLoadMetaData(e : any){
    visible.value = true

    continueWatching(detail.value,history.value,videoPlayer.value)
  }

</script>

<style lang="css">

  .manga-detail-container {
    height: 100%;
  }

  .manga-player {
    width: 100%;
    height: 100%;
    margin-bottom: 10px;
  }

  .manga-player video {
    object-fit: cover;
    opacity: 0;
    -webkit-transition: opacity 0.3s ease-in-out;
    -moz-transition: opacity 0.3s ease-in-out;
    transition: opacity 0.3s ease-in-out;
    height: 100%;
  }

  .manga-player video.visible {
    opacity: 1;
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
