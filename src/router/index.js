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
      path: '/mysql-view/index',
      component: () => import('@/views/mysql-view/index.vue'),
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
      path: '/postgresql-view/index',
      component: () => import('@/views/postgresql-view/index.vue'),
    },
    {
      path: '/dm-view/index',
      component: () => import('@/views/dm-view/index.vue'),
    },
    {
      path: '/docker-view/index',
      component: () => import('@/views/docker-view/index.vue'),
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
