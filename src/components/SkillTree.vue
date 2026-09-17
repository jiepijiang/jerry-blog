<script setup>
import { skills } from '@/data/site'
import { openLightbox } from '@/composables/useLightbox'
</script>

<template>
  <div class="skill">
    <img
      id="skillPc"
      :src="skills.pc"
      alt="技能树桌面版"
      @click="openLightbox(skills.pc)"
    />
    <img
      id="skillWap"
      :src="skills.wap"
      alt="技能树移动版"
      @click="openLightbox(skills.wap)"
    />
  </div>
</template>

<style scoped>
.skill {
  padding: 25px;
  width: 100%;
}

.skill img {
  cursor: zoom-in;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.skill #skillWap {
  display: none;
}

@media (max-width: 800px) {
  .skill #skillWap {
    display: block;
  }

  .skill #skillPc {
    display: none;
  }
}
</style>
