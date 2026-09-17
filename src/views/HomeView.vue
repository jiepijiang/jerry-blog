<script setup>
import { inject } from 'vue'
import LeftSidebar from '@/components/LeftSidebar.vue'
import ProfileHeader from '@/components/ProfileHeader.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import ProjectList from '@/components/ProjectList.vue'
import SkillTree from '@/components/SkillTree.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import { siteProjects, toolProjects } from '@/data/site'

const loaderDone = inject('loaderDone')
const openMusic = inject('openMusic')

function onAction(action) {
  if (action === 'music') openMusic?.()
}
</script>

<template>
  <div>
    <div class="Miyako-filter" />

    <div class="Miyako-main" :class="{ revealed: loaderDone }">
      <LeftSidebar />

      <div class="Miyako-right">
        <ProfileHeader @open-music="openMusic" />

        <div class="content">
          <SectionTitle text="site" />
          <ProjectList :items="siteProjects" variant="a" @action="onAction" />

          <SectionTitle text="project" />
          <ProjectList :items="toolProjects" variant="b" @action="onAction" />

          <SectionTitle text="skills" icon="skills" />
          <SkillTree />
        </div>
      </div>
    </div>

    <SiteFooter />
  </div>
</template>

<style scoped>
.Miyako-filter {
  backdrop-filter: blur(var(--back_filter));
  -webkit-backdrop-filter: blur(var(--back_filter));
  background: var(--back_filter_color);
  height: 100%;
  position: fixed;
  width: 100%;
  z-index: -99999999;
}

.Miyako-main {
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  max-width: 1150px;
  position: relative;
  transition: transform 0.5s ease;
  width: 100%;
}

.Miyako-main.revealed {
  animation: fadeIn 0.5s ease-out forwards;
}

.Miyako-right {
  display: flex;
  flex-direction: column;
  padding: 20px 20px 50px;
  position: relative;
  width: calc(100% - 230px);
}

@media (max-width: 800px) {
  .Miyako-right {
    width: 100%;
  }
}
</style>
