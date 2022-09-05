import { JSDOM } from 'jsdom'

const service = {

    getAll: async () => {
        const mangaPages = await fetch('http://mavanimes.co')
            .then(async (r) => r.text() )
            .then( html => (new JSDOM(html)).window.document )
            .then( document => document.querySelectorAll('.row.grid-item'))

        const mangas = Array.from(mangaPages.values())
            .flatMap( (node) => Array.from(node.querySelectorAll('.col-sm-3.col-xs-12').values()) )
            .map( item => ({
                title: item.querySelector('a p').textContent,
                source: 'MAVANIMES',
                imageLink: item.querySelector('a img').src
            }))

        return mangas
    }
}

export default service 