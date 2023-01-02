import { type ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export interface Manga {
  id: string
  title: string
  manga_title: string
  manga_id: string
  source: string
  image_link: string
  subtitle: string
  episode: number
  detail_link: string
}

export interface MangaDetail {
  id: string
  title: string
  manga_title: string
  manga_id: string
  image_link: string
  episodes: Episode[]
  current_episode: PlayerInfo
  source: string
  subtitle: string
}

export interface Episode {
  id: string
  link?: string
  episode: number
  active?: boolean
}

export interface PlayerInfo {
  number: number
  player_link: string[]
  active_link: string
}

export interface _MangaHistory extends Manga {
  progress: number
}

export type MangaHistory = Omit<_MangaHistory, 'detail_link'>
