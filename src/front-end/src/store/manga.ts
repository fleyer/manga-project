import { acceptHMRUpdate, defineStore } from 'pinia'

export const useMangaStore = defineStore('manga', () => {
  /**
   * Current name of the user.
   */
  const savedManga = ref('')


  /**
   * Changes the current manga
   *
   * @param name - new name to set
   */
  function setManga(name: string) {


    savedManga.value = name
  }

  return {
    setManga,
    savedManga
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
