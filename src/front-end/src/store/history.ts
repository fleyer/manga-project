import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Ref } from 'vue'
import type { MangaHistory } from '~/types'

export const useHistoryStore = defineStore('history', () => {
  const historyRecords: Ref<Record<string, MangaHistory>> = ref(useStorage('history', {}))

  function pushHistory(newHistory: MangaHistory) {
    historyRecords.value[newHistory.manga_id] = newHistory
  }

  function deleteHistory(item: MangaHistory) {
    delete historyRecords.value[item.manga_id]
  }

  return {
    history: historyRecords,
    pushHistory,
    deleteHistory,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
