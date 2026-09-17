<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import MusicPlayer from './MusicPlayer.vue'

/**
 * 音乐幕帘：从顶部滑下的全屏遮罩，内部承载播放器。
 * 原站用 iframe 承载独立子应用，这里直接挂载组件，视觉与动效一致。
 */
const props = defineProps({
  active: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const curtainEl = ref(null)
let mounted = ref(false)

/* 原站在打开/窗口尺寸变化时把幕帘高度显式设为 innerHeight */
function syncHeight() {
  if (curtainEl.value) curtainEl.value.style.height = `${window.innerHeight}px`
}

watch(
  () => props.active,
  (v) => {
    if (v) {
      mounted.value = true
      syncHeight()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

function onKey(e) {
  if (e.key === 'Escape' && props.active) emit('close')
}

onMounted(() => {
  window.addEventListener('resize', syncHeight)
  window.addEventListener('keydown', onKey)
  if (props.active) syncHeight()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncHeight)
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <div ref="curtainEl" class="music-curtain" :class="{ active }">
    <MusicPlayer v-if="mounted" @close="emit('close')" />
  </div>
</template>
