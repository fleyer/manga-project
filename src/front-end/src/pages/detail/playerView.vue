<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ComputedRef } from 'vue'
import { withDefaults } from 'vue'
import nProgress from 'nprogress'
import type { MangaDetail, MangaHistory } from '~/types'
import { incEpisodeId, debounce } from '~/utils'

const props = withDefaults(defineProps<{ autoPlay?: boolean }>(), { autoPlay: false })

const mangaStore = useMangaStore()
const historyStore = useHistoryStore()
const { loadMangaPlayer } = mangaStore
const router = useRouter()
const { activeLink } = storeToRefs(mangaStore)
const { detail } = storeToRefs(mangaStore)
const { history } = storeToRefs(historyStore)
const { pushHistory } = historyStore
// const activeEpisodeElement = ref<HTMLDivElement[]>([])
const videoContainer = ref<HTMLDivElement>()
const videoPlayer = ref<HTMLVideoElement>()
const visible = ref<boolean>(false)
const inactive = ref<boolean>(false)
const isPlaying = ref<boolean>(!!props.autoPlay)
const currentHistory = computed(() => detail.value && history.value[detail.value.manga_id] ? history.value[detail.value.manga_id] : undefined)
const historicalProgress = computed(() => (detail.value?.manga_id && currentHistory.value?.episode === detail.value.current_episode.number ? currentHistory.value.progress : 0))
const currentTime = ref<number>(0)
const displayedTime = computed(() => `${String(Math.floor(currentTime.value / 60)).padStart(2, "0")}:${String(Math.floor(currentTime.value) % 60).padStart(2, '0')}`)
const previousEpisode = computed(() => (detail.value?.current_episode.number || 0) > 1 ? incEpisodeId(detail.value!,-1) : null)
// const nextEpisode = computed(() => detail.value?.current_episode.number ? incEpisodeId(detail.value!,1) : null)
let tryNumber = 0

onBeforeRouteUpdate(() => {
  tryNumber = 0
  currentTime.value = 0
  isPlaying.value = false
  visible.value = false
  videoPlayer.value?.pause()
})

watchEffect(( invalidate ) => {
  props.autoPlay && videoPlayer.value?.setAttribute('autoplay', '')

  videoPlayer.value?.addEventListener('timeupdate',onTimeUpdate)

  return invalidate(() => {
    videoPlayer.value?.removeEventListener('timeupdate',onTimeUpdate)
  })
})

function updateProgress(detail: MangaDetail, videoPlayer: HTMLVideoElement) {
  const savedEpisode = currentHistory.value
  const savedProgress = savedEpisode?.progress || -1
  const progress = calculateProgress(videoPlayer)
  const needUpdate =  progress > savedProgress || detail.current_episode.number !== savedEpisode?.episode
  currentTime.value = videoPlayer.currentTime

  isPlaying.value && needUpdate && pushHistory({
    id: detail.id,
    title: detail.title,
    manga_title: detail.manga_title,
    manga_id: detail.manga_id,
    image_link: detail.image_link,
    progress,
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

function togglePlay() {

  console.log('debug')

  isPlaying.value = !videoPlayer.value!.paused
}

function onLoadMetaData(e: any) {
  nProgress.done()

  visible.value = true

  continueWatching(detail.value!, currentHistory, videoPlayer.value!)
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
  detail: MangaDetail,
  mangaHistory: ComputedRef<MangaHistory | undefined>,
  videoPlayer: HTMLVideoElement,
) {

  if ( mangaHistory.value?.episode === detail.current_episode.number){
    videoPlayer.currentTime = videoPlayer.duration * mangaHistory.value.progress / 100
  }else{
    videoPlayer.currentTime = 0
  }
}

function calculateProgress(videoPlayer: HTMLVideoElement): number {

  return videoPlayer ? Math.round((videoPlayer.currentTime / videoPlayer.duration) * 100) : 0
}

function play(player: HTMLVideoElement) {
  (player.paused ? player.play : player.pause).bind(player)()

  if(player.paused){
    inactive.value = !player.paused
  }

  !player.paused && debounce(() => {
    inactive.value = true
  },3000,() => {})()
}

function onTimeUpdate(){
  isPlaying.value && updateProgress(detail.value!,videoPlayer.value!)
}

function updatePlayback(event: Event) {
  const mangaHistory = currentHistory.value!
  mangaHistory.progress = parseInt((event.target as HTMLInputElement).value)

  if(videoPlayer.value?.duration){
    videoPlayer.value.currentTime = videoPlayer.value.duration * mangaHistory.progress / 100
  }

}

function toggleFullScreen() {
  if(document.fullscreenElement){
    document.exitFullscreen()
  }else{
    videoContainer.value?.requestFullscreen()
  }
}

const onMouseStopMoving = debounce(() => {
  inactive.value = true
},3000,resetInactivity)

function resetInactivity(){
  inactive.value = false
}

</script>

<template>
  <div ref="videoContainer" class="w-full h-full">
    <div v-show="!inactive" class="manga-detail-title absolute px-4 py-2 w-full flex items-start">
      <div class="flex items-center z-50">
        <button class="btn bg-transparent hover:bg-transparent" @click="$router.push('/')">
          <div class="text-xl font-semibold" i-carbon:chevron-left></div>
        </button>
        <h1>{{ detail?.title }}</h1>
      </div>
    </div>
    <video ref="videoPlayer" class="video-player" :class="{ visible, isPlaying }" no-controls :src="activeLink" type="video/mp4"
      @keyup.space="togglePlay "
      @play="togglePlay"
      @click="play(videoPlayer!)"
      @pause="togglePlay"
      @loadstart="onLoad"
      @loadedmetadata="onLoadMetaData"
      @error="onError"
      @mousemove="onMouseStopMoving"
    />
    <div v-show="visible && !inactive" class="controls absolute bottom-0 py-4 px-6 text-lg w-full flex flex-col justify-end items-center">
      <div class="slider w-full flex">
        <input type="range" min="0" max="100" class="flex-1" :value="historicalProgress" @input="updatePlayback" />
      </div>
      <div class="toolbar flex relative w-full justify-center">
        <button class="btn bg-transparent hover:bg-transparent" v-show="previousEpisode" @click="() => router.push(`/detail/${previousEpisode}`)">
          <div class="i-carbon:skip-back-filled"></div>
        </button>
        <button class="btn bg-transparent hover:bg-transparent" @click="play(videoPlayer!)">
          <div :class="isPlaying ? 'i-carbon:pause-filled' : 'i-carbon:play-filled-alt'"></div>
        </button>
        <!-- <button class="btn bg-transparent hover:bg-transparent">
          <div class="i-carbon:skip-forward-filled"></div>
        </button> -->

        <div class="absolute top-0 right-0 flex items-center">
          <div class="w-20 flex justify-center">{{ displayedTime }}</div>
          <button claas="btn bg-transparent hover:bg-transparent" i-carbon:fit-to-screen @click="toggleFullScreen"></button>
        </div>
      </div>
    </div>
  </div>

</template>

<style>
.manga-detail-title {
  height: 200px;
  text-align: start;
  background: rgb(0, 0, 0);
  background: linear-gradient(180deg, rgba(0, 0, 0, .8) 0%, rgba(255, 255, 255, 0) 100%);
}

.controls {
  height: 200px;
  text-align: start;
  background: rgb(0, 0, 0);
  background: linear-gradient(0deg, rgba(0, 0, 0, .8) 0%, rgba(255, 255, 255, 0) 100%)
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
