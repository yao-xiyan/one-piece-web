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
          path: '/search', // 默认子路由
          component: () => import('@/views/search')
        }
      ]
    }
  ]
})

export default router
