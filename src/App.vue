<script setup>
import { onMounted, provide, ref } from 'vue'
import StarLoader from './components/StarLoader.vue'
import MusicCurtain from './components/MusicCurtain.vue'
import ImageLightbox from './components/ImageLightbox.vue'
import { initTheme } from './composables/useTheme'

/* 主题需在首帧前就写到 <html>，否则加载动画的场景配色会闪一下 */
initTheme()

const loaderDone = ref(false)
const musicOpen = ref(false)

provide('loaderDone', loaderDone)
provide('openMusic', () => {
  musicOpen.value = true
})

onMounted(() => {
  // 原站全局禁用了右键菜单
  document.addEventListener('contextmenu', (e) => e.preventDefault())
})
</script>

<template>
  <StarLoader @finish="loaderDone = true" />
  <router-view />
  <MusicCurtain :active="musicOpen" @close="musicOpen = false" />
  <ImageLightbox />
</template>
