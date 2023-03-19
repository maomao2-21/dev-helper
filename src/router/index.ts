import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import loginLayouts from '../layouts/loginLayouts.vue'
const routes = [
  {
    path: '/',
    component: loginLayouts,
    redirect: '/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/index.vue')
      }, 
    ]
  },
  {
    path: '/home',  
    name: 'home',
    component: Home
 
  },
  // 其他路由
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
