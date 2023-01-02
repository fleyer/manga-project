import type { Manga } from '~/types'

const getDetailLink = (manga: Manga) => {
  const id = `${manga.source}-${manga.id}`

  return `/detail/${id}`
}

export {
  getDetailLink,
}
