export default {
    getVideoPlayer: async (link) => {
        const id = link.split('/v/').pop()

        return await fetch(`https://mavavid.com/api/source/${id}`, { 
            method: 'POST',
            data: { d: 'mavavid.com', r: '' } 
          })
          .then(r => r.json())
          .then(json => json.data.find(playerInfo => playerInfo.label === '720p')?.file)
    }
}