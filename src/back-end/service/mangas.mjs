import { JSDOM } from 'jsdom'

const service = {

  getAll: async () => {
    const mangaPages = await fetch('http://mavanimes.co')
      .then(async (r) => r.text())
      .then(html => (new JSDOM(html)).window.document)
      .then(document => document.querySelectorAll('.row.grid-item'))

    const mangas = Array.from(mangaPages.values())
      .flatMap((node) => Array.from(node.querySelectorAll('.col-sm-3.col-xs-12').values()))
      .map(buildMangaDocument)

    return mangas
  },

  getDetail: async (mangaId) => {
    const detail = await fetch(`http://mavanimes.co/${mangaId}/`)
      .then(async (r) => r.text())
      .then(html => (new JSDOM(html)).window.document)
      .then(document => buildDetail(mangaId, document))

    return detail
  },

  getVideoPlayer: async ({playerId,source}) => {
    let link = Buffer.from(playerId, 'base64').toString('ascii');

    switch(source){
      case "MAVANIMES":
        const id = link.split('/v/').pop()

        return await fetch(`https://mavavid.com/api/source/${id}`, { 
            method: 'POST',
            data: { d: 'mavavid.com', r: '' } 
          })
          .then(r => r.json())
          .then(json => json.data.find(playerInfo => playerInfo.label === '720p')?.file)   

      case "STREAMTAPE":
        return await fetch(link)
          .then(r => r.text())
          .then(html => new JSDOM(html))
          .then(dom => dom.window.document.body)
          .then(body => Array.from(body.querySelectorAll('script').values()))
          .then( scripts => scripts.reverse()
            .find( scripts => (scripts.innerHTML.split('\n'))
              .find( line => line.includes(`.getElementById('robotlink')`))
            )
          )
          .then( script => script?.innerHTML.split('\n')[2])
          .then(line => {
            let [ , ,part1, part2 ] = line.split(/[ +]/).filter(part => part.length > 0)
            return [
                'https:',
                part1.replace(/\'/g,''),
                part2.match(/\(([^()]+)\)/g)[0].replace(/[())']+/g,'').substring(3),
                '&stream=1'
              ].join('')
          })
    }
  }

}

function buildDetail(mangaId, document) {
  const split = mangaId.split('-')
  const mangaTitle = split.slice(0, split.length - 2).concat([split[split.length - 1]]).join('-').replace(/[()]+/g,'')
  const episodeOptionList = Array.from(document.querySelectorAll(`.category-${mangaTitle} div select option`).values())
  const title = document.querySelector(`.category-${mangaTitle} header h1, .category-non-classe header h1`).textContent
  const playerLink = buildPlayerLink(document,mangaTitle)

  const episodes = episodeOptionList.map(option => ({
    id: option.value.split('/').slice(-2)[0],
    detail_link: `/api/mangas/${option.value.split('/').slice(-2)[0]}`,
    episode: parseInt(option.value.split('-').slice(-2)[0])
  }))
    .filter(episode => episode.id.length > 0)
    .reverse()

  return {
    current_episode: {
      number: parseInt(split.slice(-2)[0]),
      player_link: playerLink
    },
    episodes,
    id: mangaId,
    title,
    manga_title: title.split(' ').slice(0, -2).join(' '),
    image_link: document.querySelector('meta[name="twitter:image"]').getAttribute("content"),
    source: 'MAVANIMES',
    subtitle: split[split.length - 1]
  }
}

function buildPlayerLink(document, mangaTitle){
  const playerIframes = Array.from(document.querySelectorAll(`.category-${mangaTitle} div p iframe, .category-non-classe div p iframe`).values())

  return playerIframes.map( iframe => iframe.getAttribute('src'))
}

function buildMangaDocument(item) {
  const rawTitle = item.querySelector('a p')
  const split = rawTitle.textContent.split(' ')
  const title = split.slice(0, split.length - 2).join(' ').replace(/–$/, '').trim()
  const id = rawTitle.textContent.replaceAll(' –', '').replaceAll(' ', '-').toLowerCase()

  return {
    id,
    title: rawTitle.textContent,
    manga_title: title,
    subtitle: split[split.length - 1],
    episode: split[split.length - 2],
    source: 'MAVANIMES',
    image_link: item.querySelector('img')?.src,
    detail_link: `/api/mangas/${id}`
  }
}

export default service 