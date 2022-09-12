<template>
  <section>
    <div class="manga-detail">
        <div class="manga-presentation">
          <h1 class="manga-title">{{detail.title}}</h1>
          <img class="manga-detail-image" :src="detail.image_link"/>
          <div class="manga-description"></div>
        </div>
        <iframe class="manga-player" v-if="detail.current_episode" allowfullscreen="true" width="800" height="500" :src="detail.current_episode.player_link"/>
    </div>
  </section>

  <section class="manga-episode-navigator">
    <ul class="manga-episode-list">
      <li v-for="episode in detail.episodes">
        <router-link :to="`/detail/${episode.id}`" custom v-slot="{ navigate }">
          <div :class="episode.active ? 'manga-episode-active' : ''" @click="navigate">
            <span>{{episode.episode}}</span>
          </div>
        </router-link>
      </li>

      <li>
        <router-link :to="`/detail/${nextEpisode.id}`">
          {{nextEpisode.episode}} next >>
        </router-link>

      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
  import { watchEffect, ref, Ref } from 'vue'
  import { MangaDetail, Episode } from '~/types';

  const props = defineProps<{ id: string }>()
  const detail : Ref<MangaDetail> = ref({})
  const nextEpisode : Ref<Episode> = ref({})

  watchEffect(async () => {
    const currentEpisode = parseInt(props.id.split('-').slice(-2)[0])

    console.log(currentEpisode)

    detail.value = await fetch(`/api/mangas/${props.id}`).then( r => r.json())

    if(detail.value.episodes){
      detail.value = {
        ...detail.value,
        episodes: [ ...detail.value.episodes.map( e => trackActiveEpisode(currentEpisode,e))]
      }

      nextEpisode.value = next(props.id)
    }
  })

  function next(current_episode_id : string ) : Episode {
    const split = current_episode_id.split('-')
    const nextId = parseInt(split[split.length - 2]) + 1

    return {
      episode: nextId,
      id: [ ...split.slice(0,split.length-2),nextId,split.slice(-1)].join('-')
    }
  }

  function trackActiveEpisode(currentEpisodeNumber : number ,episode : Object) : Void {
    episode.active = currentEpisodeNumber === episode.episode

    return episode
  }

</script>

<style lang="css">

  .manga-detail {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
  }

  .manga-title {
    line-height: 20px;
  }

  .manga-detail-image {
    max-width: 300px;
  }

  .manga-player {
    margin-top: 20px;
  }

  .manga-presentation {
    min-width: 300px;
    max-width: 500px;
    padding-right: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .manga-episode-list {
    display: flex;
  }

  .manga-episode-navigator {
    overflow-x: scroll;
  }

  .manga-episode-list > li > div {
    min-width: 300px;
    height: 150px;
    background: #212121;
    border-radius: 4px;
    cursor: pointer;
  }

  .manga-episode-list li + li {
    margin-left: 10px;
  }

  .manga-episode-list li.manga-episode-active {
    background: lightseagreen;
  }
</style>
