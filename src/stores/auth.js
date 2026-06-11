import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  actions: {
    // ฟังก์ชันเชื่อมต่อ Mock Login ของหลังบ้าน
    async mockLogin(role, userId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/auth/mock?role=${role}&user_id=${userId}`)
        
        // เก็บ Token และข้อมูลลง State และ LocalStorage
        this.token = response.data.access_token
        this.user = { id: response.data.user_id, role: response.data.role }
        
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        
        return true
      } catch (error) {
        console.error("Login failed:", error)
        return false
      }
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})