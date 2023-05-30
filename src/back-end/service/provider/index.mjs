import mavanimes from './mavnimes.mjs'
import gumgum from './gumgum.mjs'
import neko from './neko.mjs'

const providerArray = [mavanimes,gumgum,neko]


export default {
    getAllMangas: () => {

        return Promise.all([
          mavanimes,
          gumgum,
          neko
        ].map( provider => provider.getAllMangas()))
        .then( mangas => mangas.flatMap( m => m ))
    },

    getProvider: (number) => providerArray[number-1]
}

function handleError(fn) {
  try{
    return fn()
  }catch(e){
    return []
  }
}

export const providers = {
    mavanimes,
    gumgum,
    neko
}