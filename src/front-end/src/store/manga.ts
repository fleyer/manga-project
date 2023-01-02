import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Episode, Manga, MangaDetail, PlayerInfo } from '~/types'

export const useMangaStore = defineStore('manga', () => {
  const savedManga = ref<string>()
  const mangas: Manga[] = reactive<Manga[]>([])
  const nextEpisode = ref<Episode>()
  const detail = ref<MangaDetail>()
  const player = ref<Partial<PlayerInfo>>()
  const activeLink = ref<string>()

  /**
   * Changes the current manga
   *
   * @param name - new name to set
   */
  function setManga(name: string | undefined) {
    savedManga.value = name
  }

  function setMangaDetail(mangaDetail: MangaDetail | undefined) {
    detail.value = mangaDetail
  }

  function setMangaPlayer(playerInfo: PlayerInfo | undefined) {
    player.value = playerInfo
    activeLink.value = undefined
  }

  async function loadMangas() {
    const mangaJson: Manga[] = await fetch(`/api/mangas`).then(r => r.json())

    mangas.push(...mangaJson)

    return mangaJson
  }

  async function loadMangaDetail(id: string): Promise<MangaDetail | undefined> {
    const currentEpisode = parseInt(id.split('-').slice(-2)[0])
    const [source, ...rawId] = id.split('-')

    detail.value = await fetch(`/api/mangas/${source}/${rawId.join('-')}`)
      .then(r => r.json())
      .then(detail => ({
        ...detail,
        episodes: [...detail.episodes.map((e: Episode) => trackActiveEpisode(currentEpisode, e))],
      }))

    nextEpisode.value = next(id)

    return detail.value
  }

  function loadMangaPlayer(index?: number) {
    const i = index || 0
    const currentDetail = detail.value
    const source = extractSource(currentDetail?.current_episode.player_link[i])

    if (currentDetail)
      activeLink.value = `/api/player?playerId=${btoa(currentDetail.current_episode.player_link[i])}&source=${source}`
  }

  function next(current_episode_id: string): Episode {
    const split = current_episode_id.split('-')
    const nextId = parseInt(split[split.length - 2]) + 1

    return {
      episode: nextId,
      id: [...split.slice(0, split.length - 2), nextId, split.slice(-1)].join('-'),
    }
  }

  function trackActiveEpisode(currentEpisodeNumber: number, episode: Episode): Episode {
    episode.active = currentEpisodeNumber === episode.episode

    return episode
  }

  return {
    setManga,
    setMangaDetail,
    setMangaPlayer,
    loadMangas,
    loadMangaDetail,
    loadMangaPlayer,
    savedManga,
    mangas,
    detail,
    nextEpisode,
    player,
    activeLink,
  }
})

function extractSource(playerLink?: string) {
  return playerLink && playerLink.includes('mavavid') ? 'MAVANIMES' : 'STREAMTAPE'
}

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
