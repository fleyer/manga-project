import { type ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export interface Manga {
  id: string,
  title: string,
  manga_title: string,
  source: string,
  image_link: string,
  subtitle: string,
  episode: number,
  detail_link: string,
}

export type MangaDetail = {
  title: string,
  manga_title: string,
  image_link: string,
  episodes: Episode[],
  current_episode: PlayerInfo,
  source: string,
  subtitle: string
}

export type Episode = {
  id: string,
  link?: string,
  episode: number,
  active?: boolean
}

export interface PlayerInfo {
  number: number,
  player_link: string[],
  active_link: string
}

export interface MangaHistory extends Manga {
  progress: number
}
