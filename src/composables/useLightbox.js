import { ref } from 'vue'

/**
 * 图片灯箱状态（原站的 .tc 组件）
 * 原站虽然实现了 pop()，但页面上没有任何触发点。这里做成全局单例，
 * 任何组件都可以调用 openLightbox(src) 放大图片。
 */
export const lightboxSrc = ref('')
export const lightboxActive = ref(false)

export function openLightbox(src) {
  if (!src) return
  lightboxSrc.value = src
  lightboxActive.value = true
  document.body.style.overflow = 'hidden'
}

export function closeLightbox() {
  lightboxActive.value = false
  document.body.style.overflow = ''
}

export function useLightbox() {
  return { lightboxSrc, lightboxActive, openLightbox, closeLightbox }
}
