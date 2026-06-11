<template>
  <div class="grid grid-cols-8 gap-2">
    <div v-for="seat in seats" :key="seat.seat_no" @click="selectSeat(seat)"
      :class="['p-4 rounded-lg cursor-pointer transition', getSeatClass(seat)]">
      {{ seat.seat_no }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBookingStore } from '../stores/booking'

const bookingStore = useBookingStore()
const seats = computed(() => bookingStore.seats)

const getSeatClass = (seat: any) => {
  // แสดงสถานะที่นั่งที่ล็อกของผู้ใช้ปัจจุบัน
  if (bookingStore.lockedSeat === seat.seat_no) return 'bg-amber-500 cursor-not-allowed font-bold'
  
  // แสดงสถานะที่นั่งที่ซื้อของผู้ใช้ปัจจุบัน
  if (bookingStore.bookedSeat === seat.seat_no) return 'bg-emerald-600 cursor-not-allowed font-bold'
  
  // สถานะจากเซิร์ฟเวอร์
  if (seat.status === 'BOOKED') return 'bg-red-600 cursor-not-allowed'
  if (seat.status === 'LOCKED') return 'bg-amber-500 cursor-not-allowed'
  
  // เลือกปกติ
  return bookingStore.selectedSeat === seat.seat_no ? 'bg-white text-slate-900 scale-105' : 'bg-slate-700 hover:bg-slate-600'
}

const selectSeat = (seat: any) => {
  if (seat.status === 'AVAILABLE') bookingStore.selectedSeat = seat.seat_no
}
</script>