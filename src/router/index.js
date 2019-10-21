import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: [
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    },
    {
      path: '',
      redirect: 'login'
    },
    {
      name: 'user',
      path: '/user', // 用户信息路由
      component: () => import('@/views/user')
    },
    {
      path: '/tabbar',
      component: () => import('@/views/tabbar'),
      children: [
        {
          name: 'home',
          path: '', // 默认子路由
          component: () => import('@/views/home')
        },
        {
          name: 'search',
          path: '/search', // 搜索路由
          component: () => import('@/views/search')
        },
        {
          name: 'search-result',
          path: '/search/:q', // 搜索结果路由
          component: () => import('@/views/search-result')
        }
      ]
    }
  ]
})

export default router
