<script setup lang="ts">
  import { reactive, onMounted } from 'vue'
  import type { Manga } from './../types'

  let mangas : Manga[] = reactive([])

  onMounted(async() => {
    const mangaJson : Manga[] = await fetch('/mangas').then( r => r.json())

    mangas.push(... mangaJson)
  })

  function getImage(manga : Manga) : string {
    return manga.imageLink
  }

</script>

<template>
  <h1>Mangas</h1>

  <div class="manga-list">
    <div class="manga-item" v-for="manga in mangas">
      <img :src="getImage(manga)" />
      <span class="manga-title">{{manga.title}}</span>
    </div>
  </div>

</template>

<style>
  .manga-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .manga-item {
    width: 300px;
    height: 200px;
    background: lightseagreen;
    margin: 4px;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  }

  .manga-title {
    position: absolute;
    bottom: 0;
    left: 0;
    text-align: start;
  }
</style>

<route lang="yaml">
meta:
  layout: home
</route>
