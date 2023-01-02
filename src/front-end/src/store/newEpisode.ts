import { acceptHMRUpdate, defineStore } from 'pinia'
import { useMangaStore } from './manga'
import { useHistoryStore } from './history'
import type { Manga, MangaHistory } from '~/types'

export const useNewEpisodeStore = defineStore('newEpisode', () => {
  const { history } = useHistoryStore()
  const { mangas } = useMangaStore()

  const newEpisodes = computed(() =>
    mangas.filter(manga => !!history?.[manga.manga_id])
      .filter(manga => calculateHasNew(history, manga))
      .reduce((acc, curr) => ({
        ...acc,
        [curr.manga_id]: curr,
      }), {} as Record<string, Manga>),
  )

  return {
    newEpisodes,
  }
})

function calculateHasNew(
  historyRecords: Record<string, MangaHistory>,
  current_episode: Manga,
): boolean {
  return historyRecords?.[current_episode.manga_id]?.episode < current_episode.episode
}

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
