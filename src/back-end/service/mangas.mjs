import provider from './provider/index.mjs'
import providerModel from '../model/provider.mjs'
import playerService from './player/index.mjs'

const service = {

  getAll: async () => {

    return await Promise.all(provider.getAllMangas())
      .then( requests => requests.flatMap( r => r))
      .then( mangas => mangas.reduce( (acc,curr) => ({ ...acc, [curr['id']]: curr}),{}))
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
  }

}

export default service 