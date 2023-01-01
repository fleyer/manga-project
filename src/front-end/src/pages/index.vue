<script setup lang="ts">

import { storeToRefs } from 'pinia';
import { useMangaStore } from '~/store/manga'

const mangaStore = useMangaStore()
const { mangas } = storeToRefs(mangaStore)
const { loadMangas } = mangaStore

onMounted(() => {
  if(mangas.value.length === 0 ){
    loadMangas()
  }
})

</script>

<template>


  <NewEpisode/>

  <History/>

  <section>
    <header class="manga-home-header">
      <h1>New episodes :</h1>
    </header>
    <div class="manga-list">
      <div class="manga-item" v-for="manga in mangas">
        <router-link :to="`detail/${manga.source}-${manga.id}`" custom v-slot="{ navigate }">
          <div @click="navigate" @keypress.enter="navigate" role="link">
            <img :src="manga.image_link" loading="lazy"/>
            <div class="manga-episode"><span class="badge">{{manga.episode}}</span></div>
            <div class="manga-subtitle"><span class="badge">{{manga.subtitle}}</span></div>

            <router-link :to="`detail/${manga.source}-${manga.id}?autoPlay=true`" custom v-slot="{ navigate: autoPlayNavigate }">
              <div class="manga-play-button" role="link">
                <span i-carbon-play-filled @click="autoPlayNavigate" ></span>
              </div>
            </router-link>


            <div class="manga-content">
              <span class="manga-title">{{manga.manga_title}}</span>
            </div>
          </div>

        </router-link>
      </div>
    </div>
  </section>


</template>

<style>
  .manga-home-header {
    text-align: start;
  }

  div.manga-play-button {
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: white;
    text-shadow: -1px -1px 1px rgba(255,255,255,.1), 1px 1px 1px rgba(0,0,0,.5);
    z-index: 10;
  }

  div.manga-play-button {
    z-index: 1;
  }

  div.manga-play-button span {
    visibility: hidden;
  }

  div.manga-play-button:hover span {
    visibility: visible;
  }

  div.manga-play-button:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  div.manga-play-button span {
    font-size: 3em;
  }

  div.manga-play-button span:hover {
    scale: 1.1;
  }

  .manga-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .manga-item {
    background: lightseagreen;
    margin: 4px;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  }

  .manga-item > div {
    position: relative;
    display: flex;
    width: 300px;
    height: 200px;
    cursor: pointer;
    z-index: 10;
  }

  .manga-item:hover .manga-subtitle {
    visibility: visible;
  }

  .manga-content {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    z-index: 10;
  }

  .manga-content .manga-title {
    padding: 4px;
    text-align: start;
    color: rgb(242, 241, 241);
    text-shadow: -1px -1px 1px rgba(158, 156, 156, 0.023), 1px 1px 1px rgba(0, 0, 0, 0.691);
    display:none
  }

  .manga-item:hover .manga-title {
    display: block;
  }
  .manga-subtitle {
    position: absolute;
    top: 0;
    right: 0;
    visibility: hidden;
    z-index: 10;
  }

  .manga-episode {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 10;
  }

  .manga-episode .badge {
    background: lightseagreen;
    color: whitesmoke;
  }

  .badge {
    text-align: end;
    border-radius: 4px;
    padding: 3px 4px;
    background: lightsalmon;
    color: whitesmoke;
  }
</style>

<route lang="yaml">
meta:
  layout: home
</route>
