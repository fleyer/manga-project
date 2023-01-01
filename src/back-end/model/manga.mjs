function createDocument (
    title,
    manga_title,
    manga_id,
    subtitle,
    episode,
    source,
    image_link,
    optionalId
) {
    const id = optionalId || title.replace(':','').replaceAll(' –', '').replaceAll(' ', '-').toLowerCase()

    return {
        id,
        title,
        manga_title,
        manga_id,
        subtitle,
        episode: isNaN(episode) ? 'movie' : episode,
        source,
        image_link,
        detail_link: `/api/mangas/${source}/${id}`
    }
}

function createMangaDetail(
    id,
    current_episode,
    episodes,
    title,
    manga_title,
    manga_id,
    image_link,
    source,
    subtitle
){
    return {
        id,
        current_episode,
        episodes,
        title,
        manga_title,
        manga_id,
        image_link,
        source,
        subtitle
    }
}

function createModel(rawTitle){
    const split = rawTitle.split(' ')

    function getMangaTitle(){    
        return split.slice(0, split.length - 2).join(' ').replace(/–$/, '').trim()
    }
    
    function getMangaId(){
        return getMangaTitle(rawTitle).replaceAll(' ','-').toLowerCase()
    }

    function getEpisodeNumber(){
        return split[split.length - 2]
    }

    function getSubtitle(){
        return split[split.length - 1]
    }

    return {
        getMangaTitle,
        getMangaId,
        getEpisodeNumber,
        getSubtitle
    }

}


export {
    createDocument,
    createMangaDetail,
    createModel
}