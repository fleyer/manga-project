import { type ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export type Manga = {
  id: string,
  title: string,
  manga_title: string,
  source: string,
  image_link: string,
  subtitle: string,
  episode: number,
  detail_link: string
}

export type MangaDetail = {
  title: string,
  image_link: string,
  episodes: Episode[],
  current_episode: Object
}

export type Episode = {
  id: string,
  link?: string,
  episode: number
}
