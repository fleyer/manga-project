<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Manga',
  meta: [
    { name: 'description', content: 'rework mavanimes' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'),
    },
  ],
})
</script>

<template>
  <header>
    <nav>
      <router-link to="/"><h1>Home</h1></router-link>
    </nav>
  </header>
  <RouterView />
</template>

<style>
  nav {
    padding-left: 16px;
  }
</style>
