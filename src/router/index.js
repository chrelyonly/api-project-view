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
    {
      path: '/redis-view/index',
      component: () => import('@/views/redis-view/index.vue'),
    },
    {
      path: '/mariadb-view/index',
      component: () => import('@/views/mariadb-view/index.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    }

  ],
})

export default router
