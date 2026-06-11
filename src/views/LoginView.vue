<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
      <div class="text-6xl mb-6">🍿</div>
      <h1 class="text-2xl font-black text-white mb-2">Cinema Booking System</h1>
      <p class="text-slate-400 text-sm mb-8">กรุณาเลือกล็อกอินเพื่อจำลองการแย่งจองที่นั่ง</p>
      
      <div class="flex flex-col gap-4">
        <button 
          @click="handleLogin('USER', 'john-doe')" 
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition active:scale-95">
          👤 ล็อกอินเป็น USER 1 (John Doe)
        </button>
        <button 
          @click="handleLogin('USER', 'jane-smith')" 
          class="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition active:scale-95">
          👤 ล็อกอินเป็น USER 2 (Jane Smith)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async (role, userId) => {
  const success = await authStore.mockLogin(role, userId)
  if (success) {
    router.push('/') // กลับไปหน้าหลักหลังล็อกอินเสร็จ
  } else {
    alert("การเข้าสู่ระบบล้มเหลว โปรดตรวจสอบว่า Backend รันอยู่หรือไม่")
  }
}
</script>