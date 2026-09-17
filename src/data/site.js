/**
 * 站点内容配置
 * ---------------------------------------------------------------------------
 * 页面里所有文案、卡片、标签、时间轴都在这里改，组件本身不需要动。
 * 布局结构（卡片数量、栏位数）保持与原站一致，因此增删条目不会破坏版式。
 */

export const profile = {
  name: 'Jerry',
  avatar: '/static/img/logo.jpg',
  /** 首屏大标题前缀 */
  hello: "Hello I'm",
  /** 第一行简介 */
  role: { icon: '💻', highlight: 'Full Stack', rest: ' Developer' },
  /** 第二行简介：会以打字机效果逐字出现 */
  motto: '🍃 春风若有怜花意, 可否许我再少年？',
}

/** 左侧信息卡 */
export const locations = [
  { key: 'china', text: 'China' },
  { key: 'city', text: 'SiChuan' },
]

/** 左侧标签 */
export const tags = ['电子', '计算机', 'Linux', '物理', '天文', '电影', '深度学习', '网络']

/** 左侧时间轴（第一条会高亮脉冲） */
export const timeline = [
  { title: '未完待续', date: '2024.5' },
  { title: '购置域名', date: '2022.8' },
  { title: '购买服务器', date: '2021.3' },
  { title: '继续折腾', date: '2020.2' },
  { title: '...', date: '...' },
  { title: '开始折腾', date: '2016.7' },
]

/** 社交 / 功能入口（iconTip 为悬停展开后显示的文案） */
export const socials = [
  { key: 'github', tip: 'Github', href: 'https://github.com/jiepijiang' },
  { key: 'mail', tip: 'Mail', href: 'mailto:hello@example.com' },
  { key: 'message', tip: '留言', href: '/chat' },
  { key: 'music', tip: '音乐', action: 'music' },
]

/** site 区卡片（第一组：图片在右，悬停时收起） */
export const siteProjects = [
  { title: '沧海拾遗', desc: '童年游戏平台', img: '/static/img/i6.png', href: 'https://example.com' },
  { title: '博客', desc: '记录摆烂日常', img: '/static/img/i1.png', href: 'https://example.com' },
  { title: '串口助手', desc: '优雅的在线串口助手', img: '/static/img/i2.png', href: 'https://example.com' },
  { title: '音乐站', desc: '来点音乐吧', img: '/static/img/i4.png', action: 'music' },
]

/** project 区卡片（第二组：宽高更大） */
export const toolProjects = [
  { title: '2FA', desc: '双重身份验证工具', img: '/static/img/i1.png', href: 'https://example.com' },
  { title: '串口助手', desc: '优雅的在线串口助手', img: '/static/img/i2.png', href: 'https://example.com' },
  { title: '画板', desc: 'Powered by Excalidraw', img: '/static/img/i3.png', href: 'https://example.com' },
  { title: '流程图', desc: 'Powered by Draw.io', img: '/static/img/i4.png', href: 'https://example.com' },
]

/**
 * 贪吃蛇：由 GitHub 贡献图生成（https://github.com/Platane/snk）
 *
 * 原站首页的贪吃蛇恒为 Light 版：唯一会换图的 static/js/script.js 读的是
 * cookie('themeState')，而能改写这个 cookie 的 `#myonoffswitch` 在 DOM 里并不存在
 * → snake-Dark.svg 实际是死资源。
 * 想让配色跟随主题就把 followTheme 打开 —— 这是本项目的一处主动增强。
 */
export const snake = {
  followTheme: false,
  Light: '/static/svg/snake-Light.svg',
  Dark: '/static/svg/snake-Dark.svg',
}

/** 技能树 */
export const skills = {
  pc: '/static/svg/skillPc.svg',
  wap: '/static/svg/skillWap.svg',
}

export const footer = {
  icp: '蜀ICP备2023008720号-2',
  copyright: 'Jerry © 2026',
}

/**
 * 留言板
 * endpoint 留空时，提交会走本地成功流程（方便直接预览）；填上你的接口地址即可真正发送。
 * 原站填的是 `https://bit.inthesea.top/api/submit-comment`（站长自己的服务，不适用本项目）。
 * 提交成功后统一等 3 秒跳回首页 —— 与原站一致。
 */
export const guestbook = {
  endpoint: '',
}

/** 音乐幕帘中的播放列表 */
export const playlist = [
  {
    title: '故人泪',
    artist: '冷鸢yousa / KBShinya',
    album: '翻唱作品集 2019',
    cover: '',
    lyric: {
      '作词/作曲': '景子谦',
      编曲: '高都邦',
      原唱: '音小尧 / Kent王健',
      翻唱: '冷鸢yousa / KBShinya',
    },
    duration: 209,
    src: '',
  },
]
