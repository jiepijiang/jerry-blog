<script setup>
import { ref } from 'vue'

/**
 * 项目卡片
 * - variant "a"：第一组（4 列，悬停时右侧图标收起、标题放大）
 * - variant "b"：第二组（同为 4 列，窄屏时变整行卡片）
 * 原站用 mousedown/touchstart 加 .pressed 做按下反馈，这里保持一致。
 */
const props = defineProps({
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  img: { type: String, default: '' },
  href: { type: String, default: '' },
  action: { type: String, default: '' },
  variant: { type: String, default: 'a' },
})

const emit = defineEmits(['action'])

const pressed = ref(false)

const press = () => {
  pressed.value = true
}
const release = () => {
  pressed.value = false
}

function onClick(e) {
  if (props.action) {
    e.preventDefault()
    emit('action', props.action)
  }
}
</script>

<template>
  <a
    class="projectItem"
    :class="[variant, { pressed }]"
    :href="href || '#'"
    :target="href && href.startsWith('http') ? '_blank' : undefined"
    :rel="href && href.startsWith('http') ? 'noopener noreferrer' : undefined"
    @mousedown="press"
    @mouseup="release"
    @mouseleave="release"
    @touchstart="press"
    @touchend="release"
    @touchcancel="release"
    @click="onClick"
  >
    <div class="projectItemLeft">
      <h1>{{ title }}</h1>
      <p>{{ desc }}</p>
    </div>
    <div class="projectItemRight">
      <img :src="img" :alt="title" />
    </div>
  </a>
</template>

<style scoped>
.projectItem {
  backdrop-filter: blur(var(--card_filter));
  -webkit-backdrop-filter: blur(var(--card_filter));
  background-color: var(--item_bg_color);
  border-radius: 8px;
  display: flex;
  height: 100px;
  margin: 7px;
  padding: 15px;
  transition:
    opacity 0.5s ease,
    background-color 0.2s ease,
    border 0.2s ease,
    transform 0.3s ease;
  width: calc(25% - 15px);
}

.projectItem:hover {
  box-shadow: 0 8px 16px -4px #2c2d300c;
  transform: translateY(-2px);
}

.projectItem.pressed {
  background-color: var(--item_hover_color);
  transform: scale(0.9);
}

.projectItem:hover .projectItemLeft {
  width: 100%;
}

.projectItem:hover .projectItemRight {
  width: 0;
}

.projectItem:hover .projectItemRight img {
  transform: rotate(40deg);
}

.projectItem:hover h1 {
  font-size: 18px;
}

.projectItemLeft {
  width: 80%;
}

.projectItemLeft,
.projectItemRight {
  height: 100%;
  transition: width 0.4s ease;
}

.projectItemLeft p {
  color: var(--item_left_text_color);
  font-size: 12px;
  margin-top: 15px;
}

.projectItemLeft h1 {
  color: var(--item_left_title_color);
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  transition: font-size 0.4s ease;
}

.projectItemRight {
  align-items: center;
  display: flex;
  justify-content: center;
  overflow: hidden;
  width: 20%;
}

.projectItemRight img {
  height: 39px;
  width: 39px;
}

@media (max-width: 1150px) {
  .projectItem {
    margin: 10px;
  }

  .projectItem.a,
  .projectItem.b {
    width: calc(50% - 20px);
  }
}

@media (max-width: 800px) {
  .projectItem.a {
    margin: 9px;
    width: calc(50% - 18px);
  }

  .projectItem.b {
    height: 110px;
    margin: 8px 15px;
    width: calc(100% - 30px);
  }

  .projectItem {
    padding: 10px;
  }

  .projectItem.a .projectItemRight,
  .projectItem.a .projectItemRight img {
    display: none;
  }

  .projectItem.a .projectItemLeft {
    width: 100%;
  }

  .projectItemLeft p {
    font-size: 13px;
  }

  .projectItemLeft h1 {
    font-size: 18px;
  }

  .projectItem:hover h1 {
    font-size: 20px;
  }
}
</style>
