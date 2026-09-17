import { onMounted, onBeforeUnmount, ref } from 'vue'

/**
 * 打字机效果 —— 对应原站 script.js 中作用于第二个 .description 的逻辑。
 * 细节保持一致：先锁住行高避免抖动、逐字输出、结束后保留光标 10 秒。
 */
export function useTyping(elRef, text, { speed = 120, holdAfter = 10000 } = {}) {
  const display = ref('')
  const isTyping = ref(false)
  const isMask = ref(false)

  let charTimer = null
  let holdTimer = null

  function start() {
    const el = elRef.value
    if (!el) return

    const full = String(text ?? '')
    if (!full) return

    const h = el.offsetHeight
    if (h > 0) el.style.minHeight = `${h}px`

    isTyping.value = true
    isMask.value = true
    display.value = ''

    let i = 0
    const tick = () => {
      if (i <= full.length) {
        display.value = full.slice(0, i)
        i++
        charTimer = setTimeout(tick, speed)
      } else {
        isMask.value = false
        holdTimer = setTimeout(() => {
          isTyping.value = false
        }, holdAfter)
      }
    }
    tick()
  }

  onMounted(() => {
    // 等字体就绪再打字，避免字宽变化导致换行抖动
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(start)
    } else {
      start()
    }
  })

  onBeforeUnmount(() => {
    clearTimeout(charTimer)
    clearTimeout(holdTimer)
  })

  return { display, isTyping, isMask }
}
