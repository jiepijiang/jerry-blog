<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  text: { type: String, required: true },
  icon: { type: String, default: 'section' },
})
</script>

<template>
  <div class="title">
    <AppIcon :name="icon" :size="26" />{{ text }}
  </div>
</template>

<style scoped>
.title {
  align-items: center;
  display: flex;
  font-size: 26px;
  font-weight: 800;
  margin: 20px 0;
  transition: transform 0.4s ease;
}

.title :deep(svg) {
  fill: var(--fill);
  height: 26px;
  margin-right: 8px;
  width: 26px;
}

.title:hover {
  transform: translateY(-5px);
}
</style>
