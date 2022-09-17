import { acceptHMRUpdate, defineStore } from 'pinia'
import { Episode, MangaDetail, Manga, PlayerInfo } from '~/types'
import type { Ref } from 'vue'

export const useMangaStore = defineStore('manga', () => {
  const savedManga : Ref<string | undefined> = ref(undefined)
  const mangas : Manga[] = reactive([])
  const nextEpisode : Ref<Episode|undefined> = ref(undefined)
  const detail : Ref<MangaDetail|undefined> = ref(undefined)
  const player : Ref<PlayerInfo|undefined> = ref(undefined)
  /**
   * Changes the current manga
   *
   * @param name - new name to set
   */
  function setManga(name: string | undefined ) {
    savedManga.value = name
  }

  function setMangaDetail( mangaDetail : MangaDetail | undefined){
    detail.value = mangaDetail
  }

  function setMangaPlayer( playerInfo : PlayerInfo | undefined){
    player.value = playerInfo
  }

  async function loadMangas() {
    const mangaJson : Manga[] = await fetch('api/mangas').then( r => r.json())

    mangas.push(...mangaJson)

    return mangaJson
  }

  async function loadMangaDetail(id : string) : Promise<MangaDetail|undefined> {
    const currentEpisode = parseInt(id.split('-').slice(-2)[0])
    detail.value = await fetch(`/api/mangas/${id}`)
      .then( r => r.json())
      .then( detail => ({
        ...detail,
        episodes: [ ...detail.episodes.map( e => trackActiveEpisode(currentEpisode,e))]
      }))

    nextEpisode.value = next(id)

    setManga(detail.value?.title)

    return detail.value
  }

  async function loadMangaPlayer(detail : MangaDetail) : Promise<PlayerInfo | undefined>{
    const id = detail.current_episode.player_link.split('/v/').pop()
    player.value = await fetch(`/api/player/${id}`)
      .then( r => r.json())

    return player.value
  }

  function next(current_episode_id : string ) : Episode {
    const split = current_episode_id.split('-')
    const nextId = parseInt(split[split.length - 2]) + 1

    return {
      episode: nextId,
      id: [ ...split.slice(0,split.length-2),nextId,split.slice(-1)].join('-')
    }
  }

  function trackActiveEpisode(currentEpisodeNumber : number ,episode : Episode) : Episode {
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
    player
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
