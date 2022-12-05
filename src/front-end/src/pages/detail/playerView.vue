<template>
  <div v-show="!isPlaying" class="manga-detail-title absolute px-4 py-2">
    <h1>{{detail?.title}}</h1>
  </div>
  <video ref="videoPlayer"
    :class="{visible: visible}"
    controls
    :src="activeLink"
    type="video/mp4"
    @play="onPlay"
    @pause="onPause"
    @loadstart="onError"
    @loadedmetadata="onLoadMetaData"></video>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ComponentPublicInstance, Ref } from 'vue'
  import { MangaDetail, MangaHistory } from '~/types';
  import { defineProps } from 'vue';

  const props = defineProps<{ autoPlay: boolean }>()

  const mangaStore =  useMangaStore()
  const historyStore =  useHistoryStore()
  const { loadMangaPlayer } = mangaStore

  const { detail, activeLink } = storeToRefs(mangaStore)
  const { history } = storeToRefs(historyStore)
  const { pushHistory } = historyStore
  const activeEpisodeElement = ref<HTMLDivElement[]>([])
  const videoPlayer = ref<HTMLVideoElement>()
  const visible = ref<boolean>(false)
  const isPlaying = ref<boolean>(false)
  let tryNumber : number = 0

  watchEffect((onInvalidate) => {
    const interval = setInterval(() => updateProgress(detail.value!,videoPlayer.value!),1000)
    videoPlayer.value?.setAttribute("autoplay",`${props.autoPlay}`)

    onInvalidate(() => {
      clearInterval(interval)
    })
  })

  function updateProgress(detail : MangaDetail, videoPlayer : HTMLVideoElement){
    isPlaying.value && pushHistory({
      id: detail.title,
      title: detail!.title,
      manga_title: detail!.manga_title,
      image_link: detail!.image_link,
      progress: calculateProgress(videoPlayer),
      episode: detail!.current_episode.number,
      detail_link: ``,
      source: detail!.source,
      subtitle: detail!.subtitle
    })
  }

  function onError(e: any) {

    if (tryNumber < 1) {
      tryNumber++
      detail && loadMangaPlayer(tryNumber)
    }
  }

  function onPlay() {
    isPlaying.value = true
  }

  function onPause() {
    isPlaying.value = false
  }

  function onLoadMetaData(e: any) {
    visible.value = true

    continueWatching(detail, history.value, videoPlayer.value)
  }

  function continueWatching(
    detail: Ref<MangaDetail|undefined>,
    history: Record<string, MangaHistory>,
    videoPlayer?: HTMLVideoElement
  ) {
    const mangaHistory = detail!.value!.manga_title ? history[detail!.value!.manga_title] : null

    if (mangaHistory && videoPlayer) {
      videoPlayer.currentTime = videoPlayer.duration * mangaHistory.progress / 100
    }
  }

  function calculateProgress(videoPlayer : HTMLVideoElement) : number {
    return videoPlayer ? Math.round((videoPlayer.currentTime / videoPlayer.duration) * 100) : 0
  }

  function setRef(elem : ComponentPublicInstance<HTMLDivElement>) {
    elem?.classList.contains('manga-episode-active') && activeEpisodeElement.value.push(elem)

    return elem
  }
</script>

<style>

  video {
    object-fit: cover;
    opacity: 0;
    -webkit-transition: opacity 0.3s ease-in-out;
    -moz-transition: opacity 0.3s ease-in-out;
    transition: opacity 0.3s ease-in-out;
    height: 100%;
    width: 100%;
    background-color: black;
  }

  video.visible {
    opacity: 1;
  }
</style>
