import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import BookingView from '../views/BookingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/login', 
      name: 'login', 
      component: LoginView 
    },
    { 
      path: '/', 
      name: 'booking', 
      component: BookingView, 
      meta: { requiresAuth: true } // ต้องล็อกอินก่อนถึงจะเข้าได้
    }
  ]
})

// ป้องกันคนแอบเข้าหน้าจอง
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router