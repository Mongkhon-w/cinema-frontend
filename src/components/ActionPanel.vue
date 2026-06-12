<template>
  <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
    <h2 class="text-lg font-bold mb-4 text-white">ทำรายการจอง</h2>
    <div class="mb-6 p-4 bg-slate-950 rounded-xl border border-slate-800">
      <span class="text-slate-400 text-sm block">ที่นั่งที่เลือก:</span>
      <span class="text-3xl font-black text-emerald-400">{{ bookingStore.selectedSeat || '--' }}</span>
      <span v-if="isMyLocked" class="block mt-2 text-amber-500 text-sm font-bold">🔒 ล็อกแล้ว</span>
      <span v-if="isMyBooked" class="block mt-2 text-emerald-500 text-sm font-bold">✅ ซื้อแล้ว</span>
    </div>
    <button 
      @click="bookingStore.lockSeat" 
      :disabled="!bookingStore.selectedSeat || isMyLocked || isMyBooked" 
      class="w-full mb-3 bg-amber-500 py-3 rounded-xl font-black disabled:opacity-50 disabled:cursor-not-allowed">
      1. ล็อกที่นั่ง
    </button>
    <button 
      @click="router.push('/payment')" 
      :disabled="!isMyLocked" 
      class="w-full bg-red-600 py-3 rounded-xl font-black text-white disabled:opacity-50 disabled:cursor-not-allowed">
      2. ไปที่หน้าชำระเงิน
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../stores/booking'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const bookingStore = useBookingStore()
const authStore = useAuthStore()

const getSelectedSeatData = computed(() => {
  return bookingStore.seats.find(s => s.seat_no === bookingStore.selectedSeat)
})

const isMyLocked = computed(() => {
  const seat = getSelectedSeatData.value
  if (!seat) return false
  return seat.status === 'LOCKED' && (seat.user_id === authStore.user?.id || bookingStore.lockedSeat === seat.seat_no)
})

const isMyBooked = computed(() => {
  const seat = getSelectedSeatData.value
  if (!seat) return false
  return (seat.status === 'BOOKED' && seat.user_id === authStore.user?.id) || bookingStore.bookedSeat === seat.seat_no
})
</script>