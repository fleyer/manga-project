import { JSDOM } from 'jsdom'

export default {
    getVideoPlayer: async (link) => {
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