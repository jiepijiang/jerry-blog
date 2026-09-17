<script setup>
import { lightboxActive, lightboxSrc, closeLightbox } from '@/composables/useLightbox'
</script>

<template>
  <div class="tc" :class="{ active: lightboxActive }" @click="closeLightbox">
    <div class="tc-main" :class="{ active: lightboxActive }" @click.stop>
      <img class="tc-img" :src="lightboxSrc" alt="" />
    </div>
  </div>
</template>

<style scoped>
.tc {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: hsla(0, 0%, 8%, 0.5);
  flex-direction: column;
  height: 100vh;
  position: fixed;
  top: 0;
  visibility: hidden;
  width: 100vw;
  z-index: 99999;
}

.tc,
.tc-main {
  align-items: center;
  display: flex;
  justify-content: center;
}

.tc-main {
  background-color: #fff;
  border-radius: 15px;
  max-width: 300px;
  min-height: 200px;
  overflow: hidden;
  transform: translateY(30%) scale(0.5);
  transition: transform 0.2s linear;
  width: 80%;
  z-index: 100000;
}

.tc-img {
  height: 100%;
  width: 100%;
}

.tc.active {
  visibility: visible;
}

.tc-main.active {
  transform: translateY(0) scale(1);
}
</style>
