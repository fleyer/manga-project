import type { MangaDetail, MangaService } from '~/types'

const loadPlayer = async (detail: MangaDetail, link: string, source: string) => {
  return `/api/player?playerId=${window.btoa(link)}&source=${source}`
}

const service: MangaService = {
  loadPlayer,
}

export default service
