/**
 * to be refactored as external provider as video link cannot be extracted from iframe
 * Possible solution : implement navigator extension to change Referer header
 */
import { createDocument, createModel } from "../../model/manga.mjs"
import { createImageLink } from "../../model/image.mjs"
import { JSDOM } from 'jsdom'

export default {
    getAllMangas: async () => {

        return await fetch('https://neko-sama.fr')
            .then(async (r) => r.text())
            .then(html => (new JSDOM(html)).window.document)
            .then( document => document.querySelector('#main script').textContent)
            .then( text => text.match(/\{(.*?)\}/g).map(JSON.parse))
            .then( mangaItems => mangaItems.map(handleException(buildMangaDocument)))
            .catch( e => {
                console.log(e.manga)
                console.log(e.manga.innerHTLM)
                console.log(e)

                return []
            })
    }
}

function buildMangaDocument(item){
  const { title,episode, lang, url } = item
  const episodeTitle = `${title.replace(" (VF)","")} ${episode.replace('Ep. ','')} ${lang.toUpperCase()}`
  const model = createModel(episodeTitle)
  const externalLink = `https://neko-sama.fr${url}`
  const id = url.split('/').slice(-1).shift()

  return  createDocument(
        episodeTitle,
        model.getMangaTitle(),
        model.getMangaId(),
        model.getSubtitle(),
        model.getEpisodeNumber(),
        'NEKO',
        externalLink,
        createImageLink(item.url_bg),
        id
    )

    // console.log(item.innerHTLM)

    // const link = item.querySelector('.text a.title')
    // const externalLink = link.href
    // const id = externalLink.split('/').slice(-2).shift()
    // const title = link.querySelector('.limit')
    // const episode = link.querySelector('.episode')
    // const subtitle = title.includes("(VF)") ? "VF" : "VOSTFR"
    // const model = createModel(`${title.replace(" (VF)","")} ${episode.replace("Ep. ","")} ${subtitle}`)

    // console.log(externalLink)

    // return createDocument(
    //     title,
    //     model.getMangaTitle(),
    //     model.getMangaId(),
    //     model.getSubtitle,
    //     model.getEpisodeNumber(),
    //     'GUMGUM',
    //     externalLink,
    //     createImageLink(item.querySelector('noscript img')?.src),
    //     id
    // )
}

function handleException(fn){
    return (item) => {
        try {

            return fn(item)
        }catch(e){
            e.manga = item
            console.log(e)
            throw e
        }
    }

}