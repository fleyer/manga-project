import { acceptHMRUpdate, defineStore } from 'pinia'
import { Ref } from 'vue'
import { Manga, MangaHistory } from '~/types'
import { useMangaStore } from './manga'

export const useHistoryStore = defineStore('history', () => {
  const historyRecords : Ref<Record<string,MangaHistory>>= ref(useStorage('history',{}))
  const { mangas } = useMangaStore()

  const newEpisodes = computed(() =>
    mangas.filter( manga => !!historyRecords.value?.[manga.manga_title])
    .filter(manga =>  calculateHasNew(historyRecords.value,manga))
    .reduce( (acc,curr) => ({
      ...acc,
      [curr.manga_title]: curr
    }), {} as Record<string,Manga>)
  )


  function pushHistory(newHistory : MangaHistory) {
    historyRecords.value[newHistory.manga_title] = newHistory
  }

  return {
    newEpisodes,
    history: historyRecords,
    pushHistory
  }
})

function calculateHasNew(
  historyRecords : Record<string,MangaHistory>,
  current_episode: Manga
) : boolean {
  return historyRecords?.[current_episode.manga_title]?.episode < current_episode.episode
}

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
