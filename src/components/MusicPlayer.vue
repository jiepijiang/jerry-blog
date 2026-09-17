<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { playlist as defaultPlaylist } from '@/data/site'

/**
 * 音乐播放器（对应原站 music-player 子应用）
 * 尺寸 / 字号 / 颜色均按原站实测值还原（1440×1000 基准）：
 *   头部 40,32；封面区 420 宽、封面 320×320；歌词区 flex-1 居中；
 *   底部控制条居中 800 宽、距底 24px、进度条 768×4。
 * 原站歌单来自远程接口，这里改为本地配置，在 data/site.js 里替换即可。
 */
const props = defineProps({
  tracks: { type: Array, default: () => defaultPlaylist },
})

const emit = defineEmits(['close'])

const audio = ref(null)
const current = ref(0)
const playing = ref(false)
const progress = ref(0)
const duration = ref(0)
const volume = ref(0.8)
const muted = ref(false)
const mode = ref('list')
const showList = ref(false)

const MODE_TEXT = { list: '顺序播放', single: '单曲循环', shuffle: '随机播放' }
const MODE_ICON = {
  list: 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z',
  single: 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zM13 15V9l-3 2v2l2-1v3z',
  shuffle: 'M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z',
}

const track = computed(() => props.tracks[current.value] || {})

const lyricLines = computed(() => {
  const l = track.value.lyric
  const title = track.value.title ? `《${track.value.title}》` : ''
  const lines = !l ? [] : Array.isArray(l) ? l : Object.entries(l).map(([k, v]) => `${k}：${v}`)
  // 原站歌词列表首行就是歌名
  return title ? [title, ...lines] : lines
})

const activeLyric = ref(0)
const lyricsEl = ref(null)
const lineEls = ref([])
const lyricOffset = ref(0)

/** 让当前歌词行垂直居中 */
function centerActiveLine() {
  const list = lyricsEl.value
  const el = lineEls.value[activeLyric.value]
  if (!list || !el) return
  const lineCenter = el.offsetTop + el.offsetHeight / 2
  lyricOffset.value = list.offsetHeight / 2 - lineCenter
}

watch([activeLyric, lyricLines], () => nextTick(centerActiveLine), { immediate: true })

/* 距离当前行越远，字号越小、颜色越淡（与原站一致） */
function lineStyle(i) {
  const d = Math.abs(i - activeLyric.value)
  if (d === 0) return { fontSize: '36px', fontWeight: 700, color: '#fff' }
  if (d === 1) return { fontSize: '20px', fontWeight: 500, color: 'rgba(255,255,255,.8)' }
  if (d === 2) return { fontSize: '18px', fontWeight: 400, color: 'rgba(255,255,255,.55)' }
  return { fontSize: '16px', fontWeight: 400, color: 'rgba(255,255,255,.35)' }
}

function fmt(sec) {
  if (!Number.isFinite(sec)) return '00:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const totalText = computed(() => fmt(duration.value || track.value.duration || 0))
const currentText = computed(() => fmt(progress.value))
const ratio = computed(() => (duration.value ? (progress.value / duration.value) * 100 : 0))

function toggle() {
  const el = audio.value
  if (!el) return
  if (el.paused) el.play().catch(() => {})
  else el.pause()
}

function step(delta) {
  if (mode.value === 'shuffle') current.value = Math.floor(Math.random() * props.tracks.length)
  else current.value = (current.value + delta + props.tracks.length) % props.tracks.length
  activeLyric.value = 0
  requestAnimationFrame(() => {
    if (playing.value) audio.value?.play().catch(() => {})
  })
}

function onTimeUpdate() {
  const el = audio.value
  if (!el) return
  progress.value = el.currentTime
  const total = el.duration || track.value.duration || 0
  if (lyricLines.value.length && total) {
    activeLyric.value = Math.min(
      lyricLines.value.length - 1,
      Math.floor((el.currentTime / total) * lyricLines.value.length),
    )
  }
}

function onLoaded() {
  const el = audio.value
  if (!el) return
  duration.value = el.duration || track.value.duration || 0
  el.volume = volume.value
}

function onEnded() {
  if (mode.value === 'single') {
    audio.value.currentTime = 0
    audio.value.play().catch(() => {})
  } else step(1)
}

function seek(e) {
  const el = audio.value
  if (!el || !duration.value) return
  const rect = e.currentTarget.getBoundingClientRect()
  const r = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
  el.currentTime = r * duration.value
  progress.value = el.currentTime
}

function onVolume(e) {
  const v = Number(e.target.value)
  volume.value = v
  muted.value = v === 0
  if (audio.value) audio.value.volume = v
}

function toggleMute() {
  muted.value = !muted.value
  if (audio.value) audio.value.muted = muted.value
}

function cycleMode() {
  const order = ['list', 'single', 'shuffle']
  mode.value = order[(order.indexOf(mode.value) + 1) % order.length]
}

function pick(i) {
  current.value = i
  showList.value = false
  activeLyric.value = 0
  requestAnimationFrame(() => audio.value?.play().catch(() => {}))
}

function onKey(e) {
  if (e.key === 'Escape') {
    if (showList.value) showList.value = false
    else emit('close')
  }
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault()
    toggle()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  nextTick(centerActiveLine)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="player">
    <div class="page">
      <header class="head">
        <div class="brand" @click="emit('close')">BackHome</div>
        <h1 class="title" @click="emit('close')">Jerry 的歌单</h1>
      </header>

      <main class="stage">
        <section class="cover-col">
          <div class="cover">
            <img v-if="track.cover" :src="track.cover" :alt="track.title" />
            <div v-else class="cover-fallback" />
          </div>
          <div class="cover-meta">
            <h2 class="now-title">{{ track.title || '等待播放' }}</h2>
            <p class="now-artist">{{ track.artist || '未知艺术家' }}</p>
            <div class="now-status">{{ playing ? '正在播放' : '已暂停' }}</div>
          </div>
        </section>

        <section class="lyric-col">
          <div class="lyric-viewport">
            <div ref="lyricsEl" class="lyrics" :style="{ transform: `translateY(${lyricOffset}px)` }">
              <p
                v-for="(line, i) in lyricLines"
                :key="i"
                :ref="(el) => (lineEls[i] = el)"
                class="lyric-line"
                :style="lineStyle(i)"
              >
                {{ line }}
              </p>
              <p v-if="!lyricLines.length" class="lyric-line" :style="lineStyle(0)">暂无歌词</p>
            </div>
          </div>
        </section>
      </main>
    </div>

    <div class="bar">
      <div class="progress" @click="seek">
        <div class="progress-fill" :style="{ width: `${ratio}%` }">
          <span class="progress-thumb" />
        </div>
      </div>

      <div class="controls">
        <div class="time-info">
          <span class="time">{{ currentText }}</span>
          <span class="time">{{ totalText }}</span>
        </div>

        <div class="main-controls">
          <button class="btn" aria-label="上一首" @click="step(-1)">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill="currentColor" />
            </svg>
          </button>
          <button class="btn play" aria-label="播放/暂停" @click="toggle">
            <svg v-if="!playing" viewBox="0 0 24 24" width="24" height="24">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="24" height="24">
              <path d="M6 5h4v14H6zm8 0h4v14h-4z" fill="currentColor" />
            </svg>
          </button>
          <button class="btn" aria-label="下一首" @click="step(1)">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <div class="secondary-controls">
          <div class="volume-control">
            <button class="btn small" :aria-label="muted ? '取消静音' : '静音'" @click="toggleMute">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  :d="muted
                    ? 'M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zM3 4.27l3.28 3.28H3v9h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73 4.27 3 3 4.27z'
                    : 'M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05A4.47 4.47 0 0 0 16.5 12zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z'"
                  fill="currentColor"
                />
              </svg>
            </button>
            <div class="volume-slider">
              <input
                class="volume-track"
                type="range"
                min="0"
                max="1"
                step="0.01"
                :value="muted ? 0 : volume"
                aria-label="音量"
                @input="onVolume"
              />
            </div>
          </div>

          <button class="btn small" :aria-label="MODE_TEXT[mode]" @click="cycleMode">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path :d="MODE_ICON[mode]" fill="currentColor" />
            </svg>
          </button>
          <button class="btn small" aria-label="播放列表" @click="showList = !showList">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M3 6h13v2H3zm0 5h13v2H3zm0 5h9v2H3zm15-8v9.18A3 3 0 1 0 20 20V8h-2z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <aside class="list-panel" :class="{ open: showList }">
      <div class="list-head">
        <h3>播放列表（共 {{ tracks.length }} 首）</h3>
        <button class="list-close" aria-label="关闭" @click="showList = false">✕</button>
      </div>
      <ul>
        <li v-for="(t, i) in tracks" :key="i" :class="{ active: i === current }" @click="pick(i)">
          <span class="idx">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="meta">
            <span class="name">{{ t.title }}</span>
            <span class="artist">{{ t.artist }}</span>
          </span>
          <span class="dur">{{ fmt(t.duration) }}</span>
        </li>
      </ul>
    </aside>

    <audio
      ref="audio"
      :src="track.src"
      preload="metadata"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoaded"
      @play="playing = true"
      @pause="playing = false"
      @ended="onEnded"
    />
  </div>
</template>

<style scoped>
/* ===================== 基础 ===================== */
.player {
  background-color: #0f172a;
  color: #f1f5f9;
  font-family: Inter, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px 40px 128px;
  position: relative;
  z-index: 10;
}

/* ===================== 头部 ===================== */
.head {
  flex-direction: column;
  margin-bottom: 32px;
}

.brand {
  color: rgba(203, 213, 225, 0.7);
  cursor: pointer;
  font-size: 12px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

.brand:hover {
  color: #fff;
}

.title {
  cursor: pointer;
  font-size: 36px;
  font-weight: 700;
  margin-top: 14px;
  transition: color 0.3s ease;
}

.title:hover {
  color: #cbd5e1;
}

/* ===================== 主体 ===================== */
.stage {
  display: flex;
  flex: 1;
  gap: 40px;
  min-height: 0;
}

.cover-col {
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: center;
  padding-top: 24px;
  /* 对应原站 lg:translate-x-32 lg:translate-y-4 */
  transform: translate(128px, 16px);
  width: 420px;
}

.cover {
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  height: 320px;
  overflow: hidden;
  width: 320px;
}

.cover img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.cover-fallback {
  background: linear-gradient(135deg, #1d4ed8, #0ea5e9);
  height: 100%;
  width: 100%;
}

.cover-meta {
  text-align: center;
}

.now-title {
  font-size: 30px;
  font-weight: 600;
  margin-top: 24px;
}

.now-artist {
  color: #cbd5e1;
  font-size: 14px;
  margin-top: 8px;
}

.now-status {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 24px;
  min-height: 1.25rem;
}

/* ===================== 歌词 ===================== */
.lyric-col {
  flex: 1;
  min-width: 0;
  position: relative;
}

.lyric-viewport {
  align-items: center;
  display: flex;
  height: 100%;
  overflow: hidden;
  padding: 0 48px;
}

.lyrics {
  display: flex;
  flex-direction: column;
  gap: 28px;
  text-align: center;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.lyric-line {
  line-height: 1.35;
  transition:
    font-size 0.3s ease,
    color 0.3s ease,
    font-weight 0.3s ease;
  will-change: transform;
}

/* 说明：原站歌词区上还挂了一个 bg-gradient-to-b 的渐隐遮罩，但 Tailwind v4
   已把该类改名为 bg-linear-to-b，所以实际渲染为 none（无遮罩）。
   为保持一致，这里不加遮罩。 */

/* ===================== 底部控制条 ===================== */
.bar {
  bottom: 24px;
  left: 50%;
  padding: 16px;
  position: absolute;
  transform: translateX(-50%);
  width: 800px;
  z-index: 20;
}

.progress {
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  height: 4px;
  position: relative;
  width: 100%;
}

.progress-fill {
  background: #fff;
  height: 100%;
  position: relative;
}

.progress-thumb {
  background: #fff;
  border-radius: 50%;
  height: 12px;
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
}

.controls {
  align-items: center;
  display: flex;
  height: 48px;
  justify-content: space-between;
  margin-top: 16px;
}

.time-info {
  align-items: center;
  display: flex;
  gap: 15px;
}

.time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.main-controls {
  align-items: center;
  display: flex;
  gap: 8px;
}

.secondary-controls {
  align-items: center;
  display: flex;
  gap: 8px;
}

.btn {
  align-items: center;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  height: 40px;
  justify-content: center;
  padding: 0;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
  width: 40px;
}

.btn:hover {
  color: #fff;
  transform: scale(1.08);
}

.btn.play {
  height: 48px;
  width: 48px;
}

.btn.small {
  color: rgba(255, 255, 255, 0.7);
  height: 32px;
  width: 32px;
}

/* 音量：悬停展开竖向滑杆 */
.volume-control {
  position: relative;
}

.volume-slider {
  bottom: 100%;
  height: 76px;
  left: 50%;
  opacity: 0;
  padding-bottom: 8px;
  pointer-events: none;
  position: absolute;
  transform: translateX(-50%);
  transition: opacity 0.2s ease;
  width: 23px;
}

.volume-control:hover .volume-slider {
  opacity: 1;
  pointer-events: auto;
}

.volume-track {
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 2px;
  height: 100%;
  outline: none;
  width: 4px;
  writing-mode: vertical-lr;
  direction: rtl;
}

.volume-track::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  height: 12px;
  width: 12px;
}

/* ===================== 播放列表 ===================== */
.list-panel {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  background: rgba(2, 6, 23, 0.8);
  border-radius: 24px 24px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  bottom: 0;
  left: 0;
  max-height: 75vh;
  padding: 21px 24px 24px;
  position: fixed;
  right: 0;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 40;
}

.list-panel.open {
  transform: translateY(0);
}

.list-head {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.list-head h3 {
  font-size: 18px;
  font-weight: 600;
}

.list-close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  transition: color 0.2s ease;
}

.list-close:hover {
  color: #fff;
}

.list-panel ul {
  list-style: none;
  max-height: 60vh;
  overflow-y: auto;
  padding-left: 4px;
}

.list-panel li {
  align-items: center;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  text-align: left;
  transition: background-color 0.2s ease;
}

.list-panel li + li {
  margin-top: 12px;
}

.list-panel li:hover {
  background: rgba(255, 255, 255, 0.05);
}

.list-panel li.active {
  background: rgba(255, 255, 255, 0.1);
}

.list-panel .idx {
  color: #94a3b8;
  font-size: 14px;
  width: 24px;
}

.list-panel .meta {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.list-panel .name {
  font-size: 16px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-panel .artist {
  color: #94a3b8;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-panel .dur {
  color: #94a3b8;
  font-size: 12px;
}

/* ===================== 响应式 ===================== */
@media (max-width: 1200px) {
  .cover-col {
    transform: none;
    width: 320px;
  }

  .cover {
    height: 256px;
    width: 256px;
  }

  .bar {
    width: 640px;
  }
}

@media (max-width: 900px) {
  .page {
    padding: 24px 20px 168px;
  }

  .stage {
    flex-direction: column;
    gap: 24px;
  }

  .cover-col {
    width: 100%;
  }

  .cover {
    height: 192px;
    width: 192px;
  }

  .now-title {
    font-size: 22px;
  }

  .lyric-viewport {
    padding: 0 12px;
  }

  .lyric-line {
    line-height: 1.3;
  }

  .bar {
    width: calc(100% - 24px);
  }

  .secondary-controls {
    gap: 0;
  }
}
</style>
