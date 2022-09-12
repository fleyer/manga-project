import { JSDOM } from 'jsdom'

const service = {

    getAll: async () => {
        const mangaPages = await fetch('http://mavanimes.co')
            .then(async (r) => r.text() )
            .then( html => (new JSDOM(html)).window.document )
            .then( document => document.querySelectorAll('.row.grid-item'))

        const mangas = Array.from(mangaPages.values())
            .flatMap( (node) => Array.from(node.querySelectorAll('.col-sm-3.col-xs-12').values()) )
            .map(buildMangaDocument)

        return mangas
    },

    getDetail: async (mangaId) => {
        const detail = await fetch(`http://mavanimes.co/${mangaId}/`)
            .then(async (r) => r.text() )
            .then( html => (new JSDOM(html)).window.document )
            .then(document => buildDetail(mangaId,document))

        return detail
    }

}

function buildDetail(mangaId,document){
    const split = mangaId.split('-')
    const mangaTitle = split.slice(0,split.length - 2).concat([ split[split.length - 1]]).join('-')
    const episodeOptionList = Array.from(document.querySelectorAll(`.category-${mangaTitle} div select option`).values())
    const title = document.querySelector(`.category-${mangaTitle} header h1`).textContent
    const playerLink = document.querySelector(`.category-${mangaTitle} div p iframe`).getAttribute('src')

    const episodes =  episodeOptionList.map(option => ({
        id: option.value.split('/').slice(-2)[0],
        detail_link: `/api/mangas/${option.value.split('/').slice(-2)[0]}`,
        episode: parseInt(option.value.split('-').slice(-2)[0])
    }))
        .filter(episode => episode.id.length > 0)
        .reverse()

    return {
        current_episode: {
            player_link: playerLink
        },
        episodes,
        id: mangaId,
        title,
        manga_title: title.split(' ').slice(0,-3).join(' '),
        image_link: document.querySelector('meta[name="twitter:image"]').getAttribute("content")
    }
}

function buildMangaDocument(item){
    const rawTitle = item.querySelector('a p')
    const split =  rawTitle.textContent.split(' ')
    const title =  split.slice(0,split.length-2).join(' ').replace(/–$/,'').trim()
    const id = rawTitle.textContent.replaceAll(' –','').replaceAll(' ','-').toLowerCase()

    return {
        id,
        title: rawTitle.textContent,
        manga_title: title,
        subtitle: split[split.length - 1],
        episode: split[split.length - 2],
        source: 'MAVANIMES',
        image_link: item.querySelector('a img').src,
        detail_link: `/api/mangas/${id}`
    }
}

export default service 