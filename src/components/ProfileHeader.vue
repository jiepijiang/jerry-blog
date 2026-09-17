<script setup>
import { computed, onMounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { useTyping } from '@/composables/useTyping'
import { useFps } from '@/composables/useFps'
import { theme } from '@/composables/useTheme'
import { profile, socials, snake } from '@/data/site'

const emit = defineEmits(['open-music'])

const typingEl = ref(null)
const { display, isTyping, isMask } = useTyping(typingEl, profile.motto)

const { fps } = useFps()

/* 原站用第一个 .iconItem 的宽度算出 FPS 字号（0.35 × 49px） */
const firstIcon = ref(null)
const sliderStyle = ref({})
onMounted(() => {
  const w = firstIcon.value?.offsetWidth || 49
  sliderStyle.value = {
    fontSize: `${0.35 * w}px`,
    fontWeight: 'bold',
    fontFamily: '"b", sans-serif',
    color: '#fff',
    minWidth: '80px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }
})

/* 原站首页恒用 snake-Light.svg（snake-Dark.svg 是死资源，原因见 site.js 注释）。
   打开 snake.followTheme 才会跟随 data-theme 换图。 */
const snakeSrc = computed(() => (snake.followTheme ? snake[theme.value] : snake.Light) || snake.Light)

function onSocialClick(item) {
  if (item.action === 'music') emit('open-music')
}
</script>

<template>
  <header>
    <div
      class="index-logo"
      :style="{ backgroundImage: `url(${profile.avatar})` }"
      role="img"
      aria-label="头像"
    />

    <div class="welcome">{{ profile.hello }} <span class="gradientText">{{ profile.name }}</span></div>

    <div class="description">
      {{ profile.role.icon }} <span class="purpleText">{{ profile.role.highlight }}</span>{{ profile.role.rest }}
    </div>

    <div
      ref="typingEl"
      class="description"
      :class="{ typing: isTyping, 'typing-mask': isMask }"
    >{{ display }}</div>

    <div class="iconContainer">
      <template v-for="(item, i) in socials" :key="item.key">
        <router-link
          v-if="item.href && item.href.startsWith('/')"
          :ref="(el) => { if (i === 0) firstIcon = el?.$el ?? el }"
          class="iconItem"
          :to="item.href"
          :aria-label="item.tip"
        >
          <AppIcon :name="item.key" :size="22" />
          <div class="iconTip">{{ item.tip }}</div>
        </router-link>

        <a
          v-else
          :ref="(el) => { if (i === 0) firstIcon = el }"
          class="iconItem"
          :href="item.href || '#'"
          :target="item.href && item.href.startsWith('http') ? '_blank' : undefined"
          :rel="item.href && item.href.startsWith('http') ? 'noopener noreferrer' : undefined"
          :aria-label="item.tip"
          @click="onSocialClick(item)"
        >
          <AppIcon :name="item.key" :size="22" />
          <div class="iconTip">{{ item.tip }}</div>
        </a>
      </template>

      <a class="switch">
        <span class="slider round" :style="sliderStyle">FPS: {{ fps ?? '--' }}</span>
      </a>
    </div>

    <div class="tanChiShe">
      <img :src="snakeSrc" alt="贪吃蛇游戏图标" />
    </div>
  </header>
</template>

<style scoped>
.index-logo {
  aspect-ratio: 1 / 1;
  background-size: cover;
  border: 0.5px solid #fff;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 30px;
  max-width: 200px;
  position: relative;
  width: 40%;
}

.welcome {
  font-size: 65px;
  font-weight: 800;
  margin: 20px 0;
}

.gradientText {
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: backgroundSizeAnimation 10s ease-in-out infinite;
  background-image: var(--gradient);
  background-position: 0;
  background-size: 200%;
  font-family: title;
}

.purpleText {
  color: var(--purple_text_color);
  font-weight: 800;
}

.description {
  font-size: 20px;
  line-height: 1.6;
  margin-top: 7px;
}

.iconContainer {
  align-items: center;
  display: flex;
  height: 60px;
  margin-top: 20px;
  overflow-x: scroll;
  width: 100%;
}

.iconContainer::-webkit-scrollbar {
  display: none;
}

.iconItem {
  align-items: center;
  backdrop-filter: blur(var(--card_filter));
  -webkit-backdrop-filter: blur(var(--card_filter));
  background: var(--item_bg_color);
  border-radius: 7px;
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  height: 43px;
  justify-content: center;
  margin-left: 10px;
  transition:
    width 0.3s ease,
    opacity 0.3s ease,
    transform 0.3s ease;
  width: 49px;
}

.iconItem :deep(svg) {
  fill: var(--fill);
  font-size: 22px;
  height: 22px;
  margin-right: 3px;
  width: 22px;
}

.iconTip {
  display: none;
  white-space: nowrap;
}

.iconItem:hover {
  background: var(--item_hover_color);
  transform: translateY(-2px);
  width: 95px;
}

.iconItem:hover .iconTip {
  display: block;
}

.switch {
  align-items: center;
  backdrop-filter: blur(var(--card_filter));
  -webkit-backdrop-filter: blur(var(--card_filter));
  background: var(--item_bg_color);
  border-radius: 7px;
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  height: 43px;
  justify-content: center;
  margin-left: 10px;
  transition:
    width 1s ease,
    opacity 1s ease,
    transform 1s ease;
  width: 80px;
}

.switch .slider {
  font-variant-numeric: tabular-nums;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
}

.switch:hover {
  background: var(--item_hover_color);
  width: 80px;
}

.tanChiShe {
  width: 85%;
}

.tanChiShe img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

@media (min-width: 800px) {
  .index-logo {
    display: none;
  }
}

@media (max-width: 800px) {
  .tanChiShe {
    width: 100%;
  }

  .description {
    font-size: 4vw;
  }

  .welcome {
    font-size: 10vw;
    margin: 2vw 0;
  }

  .iconContainer {
    margin-top: 4vw;
  }
}
</style>
