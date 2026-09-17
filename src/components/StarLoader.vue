<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'

/**
 * 首屏加载动画：星云圆盘 + 闪烁星点 + 流星 + 行星 + 陨石坑
 * 逻辑与原站 loader.js 完全一致（数量、随机范围、时序）。
 */
const emit = defineEmits(['finish'])

const STAR = { count: 30, minSize: 0.5, maxSize: 2.5, minOpacity: 0.6, maxOpacity: 1 }
const CRATER = { count: 6, minSize: 3, maxSize: 10, minDistance: 20, maxDistance: 35 }
const METEOR = { minInterval: 2000, maxInterval: 5000, animDuration: 4000 }
const FADE_DELAY = 800

const visible = ref(true)
const fading = ref(false)

/* 原站首页与留言板的加载层背景规则不同：首页恒为浅灰，
   留言板跟随主题（浅色浅灰 / 深色深蓝）。这里按路由区分。 */
const route = useRoute()
const isChatVariant = computed(() => route.path.startsWith('/chat'))

const stars = ref([])
const craters = ref([])

const sceneEl = ref(null)
let meteorTimer = null
let fallbackTimer = null
let loadedHandler = null

const rand = (min, max) => min + Math.random() * (max - min)

function buildStars() {
  const count = Math.min(STAR.count, Math.floor(window.innerWidth / 40))
  const list = []
  for (let i = 0; i < count; i++) {
    const size = rand(STAR.minSize, STAR.maxSize)
    list.push({
      left: `${rand(0, 100)}%`,
      top: `${rand(0, 100)}%`,
      width: `${size}px`,
      height: `${size}px`,
      '--delay': `${rand(0, 3)}s`,
      '--duration': `${rand(1.5, 4.5)}s`,
      '--opacity': rand(STAR.minOpacity, STAR.maxOpacity),
    })
  }
  stars.value = list
}

function buildCraters() {
  const list = []
  for (let i = 0; i < CRATER.count; i++) {
    const angle = (i / CRATER.count) * Math.PI * 2
    const dist = rand(CRATER.minDistance, CRATER.maxDistance)
    const size = rand(CRATER.minSize, CRATER.maxSize)
    list.push({
      left: `${50 + Math.cos(angle) * dist}%`,
      top: `${50 + Math.sin(angle) * dist}%`,
      width: `${size}px`,
      height: `${size}px`,
    })
  }
  craters.value = list
}

/** 流星：用原生 DOM 追加/移除，动画结束即回收 */
function spawnMeteor() {
  const scene = sceneEl.value
  if (!scene) return
  const el = document.createElement('div')
  el.className = 'meteor'
  el.style.setProperty('--delay', `${rand(0, 2)}s`)
  scene.appendChild(el)
  setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el)
  }, METEOR.animDuration)
  meteorTimer = setTimeout(spawnMeteor, rand(METEOR.minInterval, METEOR.maxInterval))
}

function finish() {
  if (!visible.value) return
  visible.value = false
  emit('finish')
}

/** transitionend 会从子元素冒泡上来，只认容器自身的 opacity 过渡 */
function onTransitionEnd(e) {
  if (e.target === e.currentTarget && e.propertyName === 'opacity') finish()
}

onMounted(() => {
  buildStars()
  buildCraters()
  spawnMeteor()

  loadedHandler = () => {
    setTimeout(() => {
      fading.value = true
      // 兜底：transitionend 在极端情况下可能不触发
      fallbackTimer = setTimeout(finish, 1300)
    }, FADE_DELAY)
  }

  if (document.readyState === 'complete') {
    loadedHandler()
  } else {
    window.addEventListener('load', loadedHandler)
  }
})

onBeforeUnmount(() => {
  if (loadedHandler) window.removeEventListener('load', loadedHandler)
  clearTimeout(meteorTimer)
  clearTimeout(fallbackTimer)
})
</script>

<template>
  <div
    v-if="visible"
    class="loader-container"
    :class="{ 'chat-variant': isChatVariant }"
    :style="{ opacity: fading ? 0 : 1 }"
    aria-label="内容正在加载"
    role="status"
    @transitionend="onTransitionEnd"
  >
    <div class="starry-wrapper">
      <div class="starry-bubble" />
      <div ref="sceneEl" class="starry-scene">
        <div class="scene-glow" />
        <div class="orbit orbit-1" />
        <div class="orbit orbit-2" />
        <div class="planet">
          <div class="planet-texture" />
          <div class="planet-ring" />
          <div v-for="(c, i) in craters" :key="`c${i}`" class="planet-crater" :style="c" />
        </div>
        <div v-for="(s, i) in stars" :key="`s${i}`" class="star" :style="s" />
      </div>
    </div>
  </div>
</template>
