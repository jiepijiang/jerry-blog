<script setup>
import { footer } from '@/data/site'
</script>

<template>
  <footer>{{ footer.icp }} | {{ footer.copyright }}</footer>
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
