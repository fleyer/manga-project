export default {
  log: (param) => {
    console.log(param)
    return param
  },

  mergeMangas: (mangaMap,currentItem) => {
    const { manga_id, episode} = currentItem
    const mergeId = [manga_id,episode].join('-')
    const mergedAttributtes = {
      externalLinks: [
        ...(mangaMap[mergeId]?.externalLinks||[]),
        currentItem.externalLink
      ].filter(e => e)
    }
    const mergedItem = { ...currentItem, ...mergedAttributtes, externalLink: undefined}

    return { ...mangaMap, [`${mergeId}`]: mergedItem}
  }
}