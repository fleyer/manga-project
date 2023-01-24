<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import { defineProps } from 'vue'
import nProgress from 'nprogress'
import type { MangaDetail, MangaHistory } from '~/types'

const props = defineProps<{ autoPlay?: { type: boolean, default: false} }>()

const mangaStore = useMangaStore()
const historyStore = useHistoryStore()
const { loadMangaPlayer } = mangaStore

const { activeLink } = storeToRefs(mangaStore)
const { detail } = storeToRefs(mangaStore)
const { history } = storeToRefs(historyStore)
const { pushHistory } = historyStore
// const activeEpisodeElement = ref<HTMLDivElement[]>([])
const videoPlayer = ref<HTMLVideoElement>()
const visible = ref<boolean>(false)
const isPlaying = ref<boolean>(!!props.autoPlay)
let tryNumber = 0

watchEffect((onInvalidate) => {
  const interval = setInterval(() => updateProgress(detail.value!, videoPlayer.value!), 1000)
  props.autoPlay && videoPlayer.value?.setAttribute('autoplay', '')

  onInvalidate(() => {
    clearInterval(interval)
  })
})

function updateProgress(detail: MangaDetail, videoPlayer: HTMLVideoElement) {
  isPlaying.value && pushHistory({
    id: detail.id,
    title: detail.title,
    manga_title: detail.manga_title,
    manga_id: detail.manga_id,
    image_link: detail.image_link,
    progress: calculateProgress(videoPlayer),
    episode: detail!.current_episode.number,
    source: detail.source,
    subtitle: detail.subtitle,
  })
}

function onLoad(e: any) {
  nProgress.start()

  if (tryNumber < 1) {
    detail && loadMangaPlayer(tryNumber)
    tryNumber++
  }
}

function onPlay() {
  isPlaying.value = true
}

function onPause() {
  isPlaying.value = false
}

function onLoadMetaData(e: any) {
  nProgress.done()

  visible.value = true

  continueWatching(detail, history.value, videoPlayer.value)
}

function onError(e: any) {
  if (e.target.error.code === 4) {
    if (tryNumber < 2) {
      detail && loadMangaPlayer(tryNumber)
      tryNumber++
    }
  }
}

function continueWatching(
  detail: Ref<MangaDetail | undefined>,
  history: Record<string, MangaHistory>,
  videoPlayer?: HTMLVideoElement,
) {
  const mangaHistory = detail!.value!.manga_title ? history[detail!.value!.manga_title] : null

  if (
    mangaHistory
      && mangaHistory.episode === detail.value?.current_episode.number
      && videoPlayer
  )
    videoPlayer.currentTime = videoPlayer.duration * mangaHistory.progress / 100
}

function calculateProgress(videoPlayer: HTMLVideoElement): number {
  return videoPlayer ? Math.round((videoPlayer.currentTime / videoPlayer.duration) * 100) : 0
}

function play(player : HTMLVideoElement){
  (player.paused ? player.play : player.pause).bind(player)()
}
</script>

<template>
  <div class="manga-detail-title absolute px-4 py-2 w-full flex items-start">
    <div class="flex items-center z-50">
      <button class="btn bg-transparent hover:bg-transparent" @click="$router.back()">
        <div class="text-xl font-semibold" i-carbon:chevron-left></div>
      </button>
      <h1>{{ detail?.title }}</h1>
    </div>
  </div>
  <video
    ref="videoPlayer"
    class="video-player" :class="{ visible }"
    no-controls
    :src="activeLink"
    type="video/mp4"
    @play="onPlay"
    @pause="onPause"
    @loadstart="onLoad"
    @loadedmetadata="onLoadMetaData"
    @error="onError"
  />
  <div class="controls absolute bottom-0 py-4 px-6 text-lg w-full flex items-end">
    <button class="btn bg-transparent hover:bg-transparent" ><div class="i-carbon:skip-back-filled"></div></button>
    <button class="btn bg-transparent hover:bg-transparent" @click="play(videoPlayer!)">
      <div :class="isPlaying ? 'i-carbon:pause-filled' : 'i-carbon:play-filled-alt'"></div>
    </button>
    <button class="btn bg-transparent hover:bg-transparent" ><div class="i-carbon:skip-forward-filled"></div></button>
  </div>
</template>

<style>
  .manga-detail-title {
    height: 200px;
    text-align: start;
    background: rgb(0,0,0);
    background: linear-gradient(180deg, rgba(0,0,0,.8) 0%, rgba(255,255,255,0) 100%);
  }

  .controls{
    height: 200px;
    text-align: start;
    background: rgb(0,0,0);
    background: linear-gradient(0deg, rgba(0,0,0,.8) 0%, rgba(255,255,255,0) 100%)
  }

  .controls > * {
    /* background: white; */
  }

  video.video-player {
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
