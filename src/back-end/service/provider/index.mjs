import mavanimes from './mavnimes.mjs'
import gumgum from './gumgum.mjs'

const providerArray = [mavanimes,gumgum]


export default {
    getAllMangas: () => {
        return [
            mavanimes,
            // gumgum
        ].map( provider => provider.getAllMangas())
    },

    getProvider: (number) => providerArray[number-1]
}

export const providers = {
    mavanimes,
    gumgum
}