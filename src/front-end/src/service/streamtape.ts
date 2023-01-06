import type { MangaDetail, MangaService } from '~/types'

const loadPlayer = async (detail: MangaDetail, link: string, source: string): Promise<string> => {
  const url = `/api/player?${new URLSearchParams({ source })}`

  return await fetch(link, { referrerPolicy: 'no-referrer' })
    .then(r => r.text())
    .then(html => fetch(url, { method: 'POST', body: html, headers: { 'content-type': 'text/plain' } }))
    .then(r => r.text())
}

const service: MangaService = {
  loadPlayer,
}

export default service
