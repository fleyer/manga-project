import { JSDOM } from 'jsdom'
import { createDocument, createMangaDetail } from '../../model/manga.mjs'
import { createModel } from './../../model/manga.mjs'

export default {
    getAllMangas: async () => {
        const mangaPages = await fetch('http://mavanimes.co')
            .then(async (r) => r.text())
            .then(html => (new JSDOM(html)).window.document)
            .then(document => document.querySelectorAll('.row.grid-item'))

        return Array.from(mangaPages.values())
            .flatMap((node) => Array.from(node.querySelectorAll('.col-sm-3.col-xs-12').values()))
            .map(buildMangaDocument)
    },

    getDetail: async (mangaId) => {
        return await fetch(`http://mavanimes.co/${mangaId}/`)
            .then(async (r) => r.text())
            .then(html => (new JSDOM(html)).window.document)
            .then(document => buildDetail(mangaId, document))
    }
}

function buildMangaDocument(item) {
    const rawTitle = item.querySelector('a p').textContent
    const model = createModel(rawTitle)

    return createDocument(
        rawTitle,
        model.getMangaTitle(),
        model.getMangaId(),
        model.getSubtitle(),
        model.getEpisodeNumber(),
        'MAVANIMES',
        item.querySelector('img')?.src
    )
}

function buildDetail(mangaId, document) {
    const split = mangaId.split('-')
    const mangaTitle = split.slice(0, split.length - 2).concat([split[split.length - 1]]).join('-').replace(/[()]+/g, '')
    const episodeOptionList = Array.from(document.querySelectorAll(`.category-${mangaTitle} div select option`).values())
    const title = document.querySelector(`.category-${mangaTitle} header h1, .category-non-classe header h1`).textContent
    const playerLink = buildPlayerLink(document, mangaTitle)
    const model = createModel(title)

    const episodes = episodeOptionList.map(option => ({
        id: option.value.split('/').slice(-2)[0],
        detail_link: `/api/mangas/${option.value.split('/').slice(-2)[0]}`,
        episode: parseInt(option.value.split('-').slice(-2)[0])
    }))
        .filter(episode => episode.id.length > 0)
        .reverse()

    return createMangaDetail(
        mangaId,
        {
            number: parseInt(model.getEpisodeNumber()),
            player_link: playerLink
        },
        episodes,
        title,
        model.getMangaTitle(),
        model.getMangaId(),
        document.querySelector('meta[name="twitter:image"]').getAttribute("content"),
        'MAVANIMES',
        model.getSubtitle()
    )
}

function buildPlayerLink(document, mangaTitle) {
    const playerIframes = Array.from(document.querySelectorAll(`.category-${mangaTitle} div p iframe, .category-non-classe div p iframe`).values())

    return playerIframes.map(iframe => iframe.getAttribute('src'))
}