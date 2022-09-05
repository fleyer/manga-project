import mangaService from './service/mangas.mjs'

export default async function (fastify,opts) {
    fastify.get('/mangas', async (request, reply) => {
            return mangaService.getAll()

      })
}


