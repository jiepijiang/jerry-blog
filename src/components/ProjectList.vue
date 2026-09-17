<script setup>
import ProjectCard from './ProjectCard.vue'

defineProps({
  items: { type: Array, required: true },
  variant: { type: String, default: 'a' },
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="projectList">
    <ProjectCard
      v-for="item in items"
      :key="item.title + item.desc"
      :title="item.title"
      :desc="item.desc"
      :img="item.img"
      :href="item.href"
      :action="item.action"
      :variant="variant"
      @action="emit('action', $event)"
    />
  </div>
</template>

<style scoped>
.projectList {
  display: flex;
  flex-wrap: wrap;
}
</style>
