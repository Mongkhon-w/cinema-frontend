<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
    <header class="border-b border-slate-800 bg-slate-900 py-4 px-6 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <span class="text-3xl">🍿</span>
        <h1 class="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
          Cinema Booking
        </h1>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-sm">
          <span class="text-slate-400">ผู้ใช้งาน: </span>
          <span class="font-bold text-emerald-400">{{ authStore.user?.id }}</span>
          <span class="ml-2 px-2 py-0.5 rounded bg-slate-800 text-xs border border-slate-700">
            {{ authStore.user?.role }}
          </span>
        </div>
        <button @click="logout" class="text-sm bg-red-600/20 text-red-500 hover:bg-red-600/40 px-3 py-1.5 rounded transition">
          ออกจากระบบ
        </button>
      </div>
    </header>

    <main class="flex-1 max-w-5xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <section class="md:col-span-2">
        <SeatMap />
      </section>

      <section class="flex flex-col gap-4">
        <ActionPanel />
        <SystemLogs />
      </section>

    </main>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'

// Import Components
import SeatMap from '../components/SeatMap.vue'
import ActionPanel from '../components/ActionPanel.vue'
import SystemLogs from '../components/SystemLogs.vue'

const router = useRouter()
const authStore = useAuthStore()
const bookingStore = useBookingStore()

const logout = () => {
  authStore.logout()
  router.push('/login')
}

// โหลดข้อมูล + เปิด WebSockets 
onMounted(() => {
  bookingStore.fetchSeats()
  bookingStore.connectWS()
})

// ปิด WebSockets 
onUnmounted(() => {
  if (bookingStore.ws) {
    bookingStore.ws.close()
  }
})
</script>