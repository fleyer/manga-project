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
  <header class="manga-home-header">
    <h1>New episodes :</h1>
  </header>
  <div class="manga-list">
    <div class="manga-item" v-for="manga in mangas">
      <router-link :to="`detail/${manga.id}`" custom v-slot="{ navigate }">
        <span @click="navigate" @keypress.enter="navigate" role="link">
          <img :src="manga.image_link" loading="lazy"/>
          <div class="manga-episode"><span class="badge">{{manga.episode}}</span></div>
          <div class="manga-subtitle"><span class="badge">{{manga.subtitle}}</span></div>

          <div class="manga-content">
            <span class="manga-title">{{manga.manga_title}}</span>
          </div>
        </span>

      </router-link>
    </div>
  </div>

</template>

<style>
  .manga-home-header {
    text-align: start;
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

  .manga-item > span {
    position: relative;
    display: flex;
    width: 300px;
    height: 200px;
    cursor: pointer;
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
  }

  .manga-content .manga-title {
    padding: 4px;
    text-align: start;
    color: rgb(242, 241, 241);
    text-shadow: -1px -1px 1px rgba(158, 156, 156, 0.023), 1px 1px 1px rgba(0, 0, 0, 0.691);
  }

  .manga-subtitle {
    position: absolute;
    top: 0;
    right: 0;
    visibility: hidden;
  }

  .manga-episode {
    position: absolute;
    bottom: 0;
    right: 0;
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
