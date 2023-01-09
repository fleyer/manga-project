import fastifyStatic from '@fastify/static'
import mangaService from './service/mangas.mjs'
import path from 'node:path'
import * as url from 'url';

export default function(fastify,options,next){

  const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

  fastify.setNotFoundHandler((request, reply) => {
    reply.sendFile('index.html');
  });

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../front-end/dist')
  })

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

  fastify.post('/api/player', async (request, reply) => {
    return await mangaService.extractVideoLink(request.body,request.query)
  })

  next()
}

