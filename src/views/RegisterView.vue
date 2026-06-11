<template>
  <div class="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl max-w-md w-full relative">
      <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
      
      <div class="text-center mb-8">
        <div class="text-5xl mb-4">📝</div>
        <h1 class="text-2xl font-black text-white">Create Account</h1>
        <p class="text-slate-400 text-sm mt-2">สมัครสมาชิกเพื่อเข้าใช้งานระบบจองตั๋ว</p>
      </div>

      <form @submit.prevent="handleRegister" class="flex flex-col gap-5">
        <div>
          <label class="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
          <input v-model="form.name" type="text" required placeholder="John Doe" class="input-field">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
          <input v-model="form.email" type="email" required placeholder="user@example.com" class="input-field">
        </div>
        <div>
          <label class="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
          <input v-model="form.password" type="password" required placeholder="••••••••" class="input-field">
        </div>

        <button :disabled="loading" class="btn-primary mt-4">
          <span v-if="loading">Processing...</span>
          <span v-else>Register Now</span>
        </button>
      </form>

      <div class="mt-8 text-center text-sm text-slate-500">
        Already have an account? 
        <router-link to="/login" class="text-emerald-500 font-bold hover:underline">Sign In</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { API_BASE_URL } from '../api/client'

const router = useRouter()
const loading = ref(false)
const form = reactive({ name: '', email: '', password: '' })

const handleRegister = async () => {
  loading.value = true
  try {
    await axios.post(`${API_BASE_URL}/api/v1/auth/register`, form)
    alert('Registration Successful! Please login.')
    router.push('/login')
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      alert(`Registration Failed: ${error.response.data.error}`)
    } else {
      alert('Registration Failed. Please check your connection.')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition mt-1;
}
.btn-primary {
  @apply bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl transition active:scale-95 disabled:opacity-50;
}
</style>