<script setup lang="ts">

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
  <RouterView />
</template>

<style>
  nav {
    padding-left: 16px;
  }

  nav ul {
    display: inline-flex;
  }

  nav ul li {
    margin-right: 16px;
  }
</style>
