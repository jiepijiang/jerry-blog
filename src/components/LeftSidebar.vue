<script setup>
import AppIcon from './AppIcon.vue'
import { profile, locations, tags, timeline } from '@/data/site'

const iconOf = (key) => (key === 'china' ? 'location' : 'building')
</script>

<template>
  <div class="Miyako-left">
    <div class="logo" :style="{ backgroundImage: `url(${profile.avatar})` }" role="img" aria-label="头像" />

    <div class="left-div left-des">
      <div v-for="loc in locations" :key="loc.key" class="left-des-item">
        <AppIcon :name="iconOf(loc.key)" :size="16" />{{ loc.text }}
      </div>
    </div>

    <div class="left-div left-tag">
      <div v-for="tag in tags" :key="tag" class="left-tag-item">{{ tag }}</div>
    </div>

    <div class="left-div left-time">
      <ul id="line">
        <li v-for="(item, i) in timeline" :key="i">
          <div class="focus" />
          <div>{{ item.title }}</div>
          <div>{{ item.date }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.Miyako-left {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  left: 0;
  overflow-y: scroll;
  padding: 0 15px;
  position: sticky;
  top: 0;
  width: 230px;
}

.Miyako-left::-webkit-scrollbar {
  display: none;
}

.logo {
  aspect-ratio: 1 / 1;
  background-size: cover;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 50px;
  position: relative;
  width: 90%;
}

.left-div {
  backdrop-filter: blur(var(--card_filter));
  -webkit-backdrop-filter: blur(var(--card_filter));
  background: var(--item_bg_color);
  border-radius: 13px;
  flex-shrink: 0;
  margin-top: 15px;
  padding: 20px;
  width: 100%;
}

.left-des {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.left-des-item {
  align-items: center;
  display: flex;
  font-size: 15px;
  line-height: 20px;
  margin-bottom: 5px;
  overflow: hidden;
}

.left-des-item :deep(svg) {
  fill: var(--fill);
  font-size: 18px;
  height: 16px;
  margin-right: 10px;
  width: 16px;
}

.left-tag {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 14px;
}

.left-tag-item {
  align-items: center;
  background: var(--left_tag_item);
  border-radius: 10px;
  display: flex;
  font-size: 13px;
  height: 28px;
  justify-content: center;
  margin: 0 5px 5px 0;
  padding: 10px;
}

#line {
  font-size: 13px;
  height: 200px;
  overflow-y: scroll;
  padding-left: 8px;
  scroll-snap-type: y mandatory;
  width: 100%;
}

#line li {
  border-left: 2px solid #d5d5d5;
  border-radius: 0;
  color: var(--main_text_color);
  list-style: none;
  padding: 15px 0 0 15px;
  position: relative;
  scroll-snap-align: end;
}

.focus {
  background-color: #fff;
  border: 2px solid #fff;
  border-radius: 22px;
  height: 8px;
  left: -5px;
  position: absolute;
  top: 50%;
  width: 8px;
}

/* 原站写了 animation: focus 1.8s ease infinite 但没定义 @keyframes focus，
   实际是静态绿点。这里补上明显的脉冲意图（唯一一处主动补齐，如需完全一致
   可删掉下面的 @keyframes 声明）。 */
#line li:first-child .focus:first-child {
  animation: focus 1.8s ease infinite;
  background-color: #aaffcd;
}

@keyframes focus {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(170, 255, 205, 0.65);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(170, 255, 205, 0);
  }
}

#line::-webkit-scrollbar {
  display: none;
}

@media (max-width: 800px) {
  .Miyako-left {
    display: none;
  }
}
</style>
