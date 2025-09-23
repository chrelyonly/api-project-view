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
      path: '/sql-server-view/index',
      component: () => import('@/views/sql-server-view/index.vue'),
    },
    {
      path: '/mongodb-view/index',
      component: () => import('@/views/mongodb-view/index.vue'),
    },
    {
      path: '/link/index',
      component: () => import('@/views/link/index.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    }

  ],
})

export default router
