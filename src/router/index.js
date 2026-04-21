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
      path: '/link/index',
      component: () => import('@/views/link/index.vue'),
    },
    {
      path: '/userInfo/index',
      component: () => import('@/views/userInfo/index.vue'),
    },
    {
      path: '/oauthCallback/index',
      component: () => import('@/views/oauthCallback/index.vue'),
    },
    {
      path: '/downloadCenter/index',
      component: () => import('@/views/downloadCenter/index.vue'),
    },
    {
      path: '/draggableCard/index',
      component: () => import('@/views/draggable-card/index.vue'),
    },
    {
      path: '/code-template/index',
      component: () => import('@/views/code-template/index.vue'),
    },
    {
      path: '/message/index',
      component: () => import('@/views/message/index.vue'),
    },







    //   保留404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    }

  ],
})

export default router
