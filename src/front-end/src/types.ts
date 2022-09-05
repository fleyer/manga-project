import { type ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export type Manga = {
  title: string,
  source: string,
  imageLink: string
}
