import streamtape from './streamtape'
import mavanimes from './mavanimes'
import type { MangaService } from '~/types'

const services: Record<string, MangaService> = {
  STREAMTAPE: streamtape,
  MAVANIMES: mavanimes,
}

const getService = (source: string): MangaService => services[source]

export default {
  getService,
}
