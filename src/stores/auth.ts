import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE_URL } from '../api/client'

export interface User {
  id: string
  email: string
  role: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
  }),
  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },
  actions: {
    setSession(token: string, userId: string, email: string, role: string) {
      this.token = token
      this.user = { id: userId, email, role }
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    loginWithGoogle() {
      window.location.href = `${API_BASE_URL}/api/v1/auth/google`
    },

    async mockLogin(email: string, password?: string): Promise<{success: boolean, error?: string}> {
      try {
        const pwdQuery = password ? `&password=${encodeURIComponent(password)}` : ''
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/auth/mock?email=${encodeURIComponent(email)}${pwdQuery}`
        )
        this.setSession(
          response.data.access_token,
          response.data.user_id,
          response.data.email,
          response.data.role
        )
        return { success: true }
      } catch (error: any) {
        console.error('Login failed:', error)
        if (error.response && error.response.data && error.response.data.error) {
          return { success: false, error: error.response.data.error }
        }
        return { success: false, error: 'Connection failed' }
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
