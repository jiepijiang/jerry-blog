<script setup>
import { computed } from 'vue'
import { footer } from '@/data/site'

/* icp 允许留空（本站托管在 GitHub Pages，不需要备案）。
   留空时只显示版权，不要渲染出「 | Jerry © 2026」这种多余的分隔符。 */
const parts = computed(() => [footer.icp, footer.copyright].filter(Boolean))
</script>

<template>
  <footer>{{ parts.join(' | ') }}</footer>
</template>

<style scoped>
footer {
  backdrop-filter: blur(var(--card_filter));
  -webkit-backdrop-filter: blur(var(--card_filter));
  background: var(--item_bg_color);
  bottom: 0;
  color: var(--footer_text_color);
  font-size: 13px;
  padding: 10px;
  position: absolute;
  text-align: center;
  width: 100%;
}
</style>
