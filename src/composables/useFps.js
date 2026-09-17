import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * FPS 计数器 —— 对应原站 script.js 里驱动 .switch .slider 的那段 rAF 循环。
 * 每秒统计一次帧数并四舍五入。
 */
export function useFps() {
  const fps = ref(null)
  let rafId = null
  let frames = 0
  let last = 0

  function loop(now) {
    const t = now || performance.now()
    frames++
    if (t >= last + 1000) {
      fps.value = Math.round((1000 * frames) / (t - last))
      last = t
      frames = 0
    }
    rafId = requestAnimationFrame(loop)
  }

  onMounted(() => {
    last = performance.now()
    rafId = requestAnimationFrame(loop)
  })

  onBeforeUnmount(() => {
    if (rafId) cancelAnimationFrame(rafId)
  })

  return { fps }
}
