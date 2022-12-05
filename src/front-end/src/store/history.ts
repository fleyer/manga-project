import { acceptHMRUpdate, defineStore } from 'pinia'
import { Ref } from 'vue'
import { MangaHistory } from '~/types'

export const useHistoryStore = defineStore('history', () => {
  const history : Ref<Record<string,MangaHistory>>= ref(useStorage('history',{}))

  function pushHistory(newHistory : MangaHistory) {

    history.value[newHistory.manga_title] = newHistory
  }

  return {
    history,
    pushHistory
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
