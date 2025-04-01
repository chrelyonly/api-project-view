import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/doc/api-detail',
      component: () => import('@/views/doc/api-detail.vue'),
    },
      {
      path: '/server/view',
      component: () => import('@/views/server/view.vue'),
    },
  ],
})

export default router
