<template>
  <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
    <h2 class="text-lg font-bold mb-4 text-white">ทำรายการจอง</h2>
    
    <div class="mb-6 p-4 bg-slate-950 rounded-xl border border-slate-800">
      <span class="text-slate-400 text-sm block mb-1">ที่นั่งที่เลือก:</span>
      <span class="text-3xl font-black text-emerald-400">{{ bookingStore.selectedSeat || '--' }}</span>
    </div>

    <button 
      @click="bookingStore.lockSeat" 
      :disabled="!bookingStore.selectedSeat"
      class="w-full mb-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-3 px-4 rounded-xl transition">
      1. ล็อกที่นั่ง (5 นาที)
    </button>
    
    <button 
      @click="bookingStore.confirmSeat" 
      :disabled="!bookingStore.selectedSeat"
      class="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3 px-4 rounded-xl transition">
      2. ยืนยันชำระเงิน
    </button>
  </div>
</template>

<script setup>
import { useBookingStore } from '../stores/booking'
const bookingStore = useBookingStore()
</script>