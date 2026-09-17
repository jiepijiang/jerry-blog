import { ref } from 'vue'

/**
 * 主题管理
 * ---------------------------------------------------------------------------
 * 原站一共写了三套主题逻辑，互相打架。实测（把 cookie / localStorage / 系统偏好
 * 各组合跑一遍）得出的真值表是：
 *
 *   页面        data-theme 的最终来源
 *   首页        localStorage('theme') || (系统深色 ? 'Dark' : 'Light')
 *   留言板      同上
 *
 * 也就是说 **最终由 loader.bundle.js 胜出**，它两页都加载、且是最后一个注册
 * DOMContentLoaded 的脚本：
 *
 *   prefersDarkMode: () => window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches
 *   const stored = localStorage.getItem('theme')
 *   html.dataset.theme = stored || (prefersDarkMode() ? 'Dark' : 'Light')
 *
 * 另外两套是死代码：
 *   - static/js/script.js（首页）：读 cookie('themeState') || 'Light'，写 cookie + 换贪吃蛇。
 *     它注册得更早，data-theme 随后被 loader.bundle.js 覆盖；而 `#myonoffswitch`
 *     在 DOM 里根本不存在，cookie 没有任何 UI 能改写 → `snake-Dark.svg` 是死资源，
 *     首页贪吃蛇恒为 Light 版。
 *   - chat.html 内联脚本：data-theme 同样被覆盖，但 `#theme-switch.checked` 只按
 *     `localStorage('theme') === 'Dark'` 算，不看系统偏好。
 *
 * 本项目按上面的真值表实现，cookie('themeState') 不再参与（原站里它是只写不读的死代码）。
 *
 * 与「一比一复刻」的主动偏差（见 README「已知差异」）：
 *   1. 原站两页各写各的存储：留言板写 localStorage、首页写 cookie，互不相通。
 *      这里统一成 localStorage 一份状态，两页同步。
 *   2. 原站在「系统深色 + 从未切换过」时，页面已经是 Dark，但开关滑块停在左侧
 *      （checked 只看 localStorage），要点两下才切到 Light。这里让 checked 反映真实
 *      主题，点一下即可切换。
 *
 * 注意：原站 CSS 里 data-theme 只影响「贪吃蛇配色」和「加载动画场景」，
 * 主体配色恒为主题5（深色毛玻璃），所以这里也不额外覆盖主体变量。
 */
const STORAGE_KEY = 'theme'
const THEMES = ['Light', 'Dark']

export const theme = ref('Light')

function prefersDark() {
  return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
}

export function applyTheme(value) {
  const next = THEMES.includes(value) ? value : 'Light'
  theme.value = next
  document.documentElement.dataset.theme = next
  return next
}

export function setTheme(value) {
  const next = applyTheme(value)
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    /* 隐私模式下 localStorage 可能不可用，忽略 */
  }
  return next
}

export function toggleTheme() {
  return setTheme(theme.value === 'Dark' ? 'Light' : 'Dark')
}

/** 首次进入时初始化：localStorage('theme') → 系统偏好 → 'Light'（= 原站 loader.bundle.js 的规则） */
export function initTheme() {
  let stored = null
  try {
    stored = localStorage.getItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
  return applyTheme(stored || (prefersDark() ? 'Dark' : 'Light'))
}

export function useTheme() {
  return { theme, setTheme, toggleTheme, initTheme }
}
