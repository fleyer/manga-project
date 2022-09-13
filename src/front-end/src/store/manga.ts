import { acceptHMRUpdate, defineStore } from 'pinia'
import { Manga } from '~/types'

export const useMangaStore = defineStore('manga', () => {
  const savedManga = ref('')
  const mangas : Manga[] = reactive([])


  /**
   * Changes the current manga
   *
   * @param name - new name to set
   */
  function setManga(name: string) {


    savedManga.value = name
  }

  async function loadMangas() {
    const mangaJson : Manga[] = await fetch('api/mangas').then( r => r.json())

    mangas.push(...mangaJson)

    return mangaJson
  }

  return {
    setManga,
    loadMangas,
    savedManga,
    mangas
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
