/**
 * to be refactored as external provider as video link cannot be extracted from iframe
 * Possible solution : implement navigator extension to change Referer header
 */
import { createDocument } from "../../model/manga.mjs"
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
    const id = item.querySelector('h1 a, h2 a, h3 a, h4 a, h5 a, h6 a').href.split('/').slice(-2).shift()
    const title = item.querySelector('h1 a, h2 a, h3 a, h4 a, h5 a, h6 a').title
    const split = title.split(' ')
    const mangaTitle = split.slice(0, split.length - 2).join(' ').replace(/–$/, '').trim()

    return createDocument(
        title,
        mangaTitle,
        split[split.length - 1],
        split[split.length - 2],
        'GUMGUM',
        item.querySelector('noscript img')?.src,
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