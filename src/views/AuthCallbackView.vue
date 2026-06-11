<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center">
    <div class="text-center">
      <div class="text-5xl mb-4 animate-bounce">🍿</div>
      <p class="text-white font-bold text-lg">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const message = ref('กำลังเข้าสู่ระบบ...')

onMounted(() => {
  const error = route.query.error as string
  if (error) {
    message.value = 'เข้าสู่ระบบไม่สำเร็จ: ' + error
    setTimeout(() => router.replace('/login'), 2000)
    return
  }

  const accessToken = route.query.access_token as string
  const userId = route.query.user_id as string
  const email = route.query.email as string
  const role = route.query.role as string

  if (!accessToken || !userId || !role) {
    message.value = 'ข้อมูล login ไม่ครบ กรุณาลองใหม่'
    setTimeout(() => router.replace('/login'), 2000)
    return
  }

  authStore.setSession(accessToken, userId, email || userId, role)
  message.value = 'เข้าสู่ระบบสำเร็จ!'

  setTimeout(() => {
    router.replace(role === 'ADMIN' ? '/admin' : '/')
  }, 500)
})
</script>
