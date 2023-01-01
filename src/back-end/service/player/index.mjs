import mavanimes from "./mavanimes.mjs"
import streamtape from "./streamtape.mjs"

const playerServiceMap = {
    "MAVANIMES": mavanimes,
    "STREAMTAPE": streamtape
}

export default {
    getPlayerProvider: (source) => {
        const service = playerServiceMap[source]

        if(service){
            return service
        } else {
            throw new Error(`No player for source ${source}`)
        }
    }
}