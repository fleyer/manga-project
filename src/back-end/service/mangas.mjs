import provider from './provider/index.mjs'
import providerModel from '../model/provider.mjs'
import playerService from './player/index.mjs'
import utils from '../utils/index.mjs'
import http from 'node:http'
import https from 'node:https'
import { URL } from 'node:url'

const service = {

  getAll: async () => {

    return await provider.getAllMangas()
      .then( mangas => mangas.reduce( (acc,curr) => utils.mergeMangas(acc,curr),{}))
      .then( mangas => Object.values(mangas))
      .then( mangas => mangas.map(providerModel.transformSource))
  },

  getDetail: async (source,mangaId) => 
    [ await provider.getProvider(source).getDetail(mangaId) ]
      .map(detail => ({ ...detail, source}))
      .shift(),

  getVideoPlayer: async ({playerId,source}) => {
    let link = Buffer.from(playerId, 'base64').toString('ascii');

    return await playerService.getPlayerProvider(source)
      .getVideoPlayer(link)
  },

  extractVideoLink: async (html,{source}) => {

    return await playerService.getPlayerProvider(source)
      .extractVideoLink(html)
  },

  // getImage: (internalImage) => {
  //   const imageLink = Buffer.from(internalImage,'base64').toString()
  //   const url = new URL(imageLink)
  //   const fn = {
  //     'http': http.get,
  //     'https': https.get,
  //   }
  //   return fn[url.protocol](imageLink)
  //     .then(async r => {
  //       // const image = Buffer.from(await r.blob().then( b => b.arrayBuffer()));
  //       console.log(r.data)
  //       return { image: r.data, contentType: r.headers.get('content-type')}
  //     })
  // }

}

export default service 