import fastifyStatic from '@fastify/static'
import path from 'node:path'
import * as url from 'url';

import mangaService from './service/mangas.mjs'
import { createProxyMiddleware } from 'http-proxy-middleware'
import expressLayer from '@fastify/express'
import proxyService from './service/proxyService.mjs';
import http from 'node:http'
import https from 'node:https'

export default async function(fastify,options){

  const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

  await fastify.register(expressLayer)

  // fastify.use(createProxyMiddleware('/test',{
  //   changeOrigin: true,
  //   followRedirects: true,
  //   router: (req) => {

  //     const target = Buffer.from(url.parse(req.url,true).query.link,'base64').toString('ascii')
  //     const { host, protocol, path, query } = url.parse(target)

  //     return {
  //       host,
  //       protocol,
  //       path,
  //       query
  //     }
  //   }
  // }))

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

  fastify.get('/api/images/:imageSlug', (req,reply) => {

    const internalImage = req.params.imageSlug
    const imageLink = Buffer.from(internalImage,'base64').toString()

    const url = new URL(imageLink)
    console.log(url)
    const fn = {
      'http:': (url,callback) => http.get(url,callback),
      'https:': (url,callback) => https.get(url,callback),
    }[url.protocol]

    fn(imageLink,
    (imageReq) => {
      reply.header('Content-Type','image/jpeg')

      imageReq.pipe(reply.raw)
    }).end()
  })
}

export const options = {
  maxParamLength: 300
}
