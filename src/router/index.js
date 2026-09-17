import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  {
    path: '/chat',
    name: 'guestbook',
    component: () => import('@/views/GuestbookView.vue'),
  },
  // 原站用 chat.html，这里做个兼容跳转
  { path: '/chat.html', redirect: '/chat' },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
