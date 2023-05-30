import { MangaDetail } from "~/types";

const incEpisodeId = (detail : MangaDetail, inc : number) : string => {
  return `${detail.source}-${detail.manga_id}-${String(detail.current_episode.number+inc).padStart(2,'0')}-${detail.subtitle.toLowerCase()}`
}

const debounce = (fn : Function,timeout: number,resetfn: Function) => {
  let timer : ReturnType<typeof setTimeout> | undefined = undefined

  return () => {
    if(timer){
      clearTimeout(timer)
      resetfn()
    }

    timer = setTimeout(() => {
      fn()

      timer = undefined
    }, timeout)
  }
}

export {
  debounce,
  incEpisodeId
}
