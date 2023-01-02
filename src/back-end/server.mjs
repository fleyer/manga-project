import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})
import mangaService from './service/mangas.mjs'

fastify.get('/api/mangas', async (request, reply) => {
  return mangaService.getAll()

})

fastify.get('/api/mangas/:source/:mangaId', async (request, reply) => {
  const { mangaId, source } = request.params

  return mangaService.getDetail(source,mangaId)

})

fastify.get('/api/player', async (request, reply) => {
  return reply.redirect(301,await mangaService.getVideoPlayer(request.query))
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

