const providerSourceMap = {
    'MAVANIMES': 1,
    'GUMGUM': 2,
    'NEKO': 3
}

export default {
    transformSource: (model) => {
        const { source,id } = model
        const transformedSource = providerSourceMap[source]

        return { 
            ...model,
            source: transformedSource,
            detail_link: `/api/mangas/${transformedSource}/${id}`
        }
    }
}