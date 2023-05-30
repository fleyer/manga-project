/**
 * to be refactored as external provider as video link cannot be extracted from iframe
 * Possible solution : implement navigator extension to change Referer header
 */
import { createDocument, createModel } from "../../model/manga.mjs"
import { createImageLink } from "../../model/image.mjs"
import { JSDOM } from 'jsdom'

export default {
    getAllMangas: async () => {
        return await fetch('https://gum-gum-streaming.com/nouveautes/')
            .then(async (r) => r.text())
            .then(html => (new JSDOM(html)).window.document)
            .then( document => document.querySelectorAll('div.entry-content div.menublocks'))
            .then( divs => Array.from(divs.values()))
            .then( mangaItems => mangaItems.map(handleException(buildMangaDocument)))
            .catch( e => {
                console.log(e.manga)
                console.log(e.manga.innerHTLM)
                console.log(e)
            })
    }
}

function buildMangaDocument(item){
    const externalLink = item.querySelector('h1 a, h2 a, h3 a, h4 a, h5 a, h6 a').href
    const id = externalLink.split('/').slice(-2).shift()
    const title = item.querySelector('h1 a, h2 a, h3 a, h4 a, h5 a, h6 a').title
    const model = createModel(title)

    return createDocument(
        title,
        model.getMangaTitle(),
        model.getMangaId(),
        model.getSubtitle(),
        model.getEpisodeNumber(),
        'GUMGUM',
        externalLink,
        createImageLink(item.querySelector('noscript img')?.src),
        id
    )
}

function handleException(fn){
    return (item) => {
        try {

            return fn(item)
        }catch(e){
            e.manga = item

            throw e
        }
    }

}