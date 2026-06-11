<template>
  <div class="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center relative overflow-hidden">

      <div v-if="!isDone">
        <div class="text-6xl mb-6">💳</div>
        <h1 class="text-2xl font-black text-white mb-2">ยืนยันการชำระเงิน</h1>
        <p class="text-slate-400 mb-8">กำลังชำระเงินสำหรับที่นั่ง <span class="text-amber-500 font-bold text-xl">{{ bookingStore.selectedSeat }}</span></p>

        <button @click="processPayment" class="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl transition active:scale-95 shadow-lg shadow-red-900/50">
          กดยืนยันการจ่ายเงิน
        </button>
      </div>

      <div v-else class="py-10">
        <div class="text-7xl mb-6 text-emerald-500">✅</div>
        <h1 class="text-3xl font-black text-white mb-2">Payment Success!</h1>
        <p class="text-slate-400 mb-8">ที่นั่งของคุณถูกยืนยันเรียบร้อยแล้ว</p>
        <button @click="goHome" class="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-10 rounded-xl transition active:scale-95">
          กลับหน้าหลัก
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../stores/booking'

const router = useRouter()
const bookingStore = useBookingStore()
const isDone = ref(false)

onMounted(() => {
  // ถ้าเข้ามาหน้านี้แต่ไม่ได้เลือกที่นั่ง ให้เด้งกลับไปหน้าแรก
  if (!bookingStore.selectedSeat) {
    router.push('/')
  }
})

const processPayment = async () => {
  // 1. เรียก API ตัดเงิน และ ยืนยันการจองที่นั่ง
  const success = await bookingStore.confirmSeat()
  
  // 2. เปลี่ยนสถานะเป็นหน้า Success สีเขียวเฉพาะเมื่อสำเร็จ
  if (success) {
    isDone.value = true
  } else {
    // ล้มเหลว เด้งกลับไปหน้าจอง
    router.push('/')
  }
}

const goHome = () => {
  router.push('/')
}
</script>