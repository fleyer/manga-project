import fastifyStatic from '@fastify/static'
import mangaService from './service/mangas.mjs'
import path from 'node:path'
import * as url from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware'
import expressLayer from '@fastify/express'
import proxyService from './service/proxyService.mjs';

export default async function(fastify,options){

  const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

  await fastify.register(expressLayer)

  fastify.use(createProxyMiddleware('/proxy/video',{
    changeOrigin: true,
    followRedirects: true,

    router: (req) => {
      const target = Buffer.from(url.parse(req.url,true).query.link,'base64').toString('ascii')
      const { host, protocol, path, query } = url.parse(target)

      return {
        host,
        protocol,
        path,
        query
      }
    }
  }))

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
    // return reply.redirect(301,await mangaService.getVideoPlayer(request.query))
    return reply.redirect(
      301,
      await mangaService.getVideoPlayer(request.query)
        .then(proxyService.proxyVideoRequest)
    )
  })

  fastify.post('/api/player', async (request, reply) => {
    return await mangaService.extractVideoLink(request.body,request.query)
  })

}

