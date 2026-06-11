import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue' 
import BookingView from '../views/BookingView.vue'
import PaymentView from '../views/PaymentView.vue'   
import AdminDashboard from '../views/AdminDashboard.vue'
import AuthCallbackView from '../views/AuthCallbackView.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/auth/callback', name: 'auth-callback', component: AuthCallbackView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView }, 
  { path: '/', name: 'booking', component: BookingView, meta: { requiresAuth: true } },
  { path: '/payment', name: 'payment', component: PaymentView, meta: { requiresAuth: true } },
  { path: '/admin', name: 'admin', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } } 
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check auth requirement
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login')
    return
  }
  
  // เฉพาะ email ADMIN เท่านั้นที่เข้าถึงได้
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    alert('ไม่มีสิทธิ์เข้าถึง: เฉพาะ Admin email ที่กำหนดในระบบเท่านั้น')
    next('/')
    return
  }
  
  next()
})

export default router