import mangaService from './service/mangas.mjs'

export default async function (fastify, opts) {

  fastify.get('/api/mangas', async (request, reply) => {
    return mangaService.getAll()

  })

  fastify.get('/api/mangas/:mangaId', async (request, reply) => {
    const { mangaId } = request.params
    return mangaService.getDetail(mangaId)

  })

  fastify.get('/api/player', async (request, reply) => {
    return reply.redirect(301,await mangaService.getVideoPlayer(request.query))
  })
}


