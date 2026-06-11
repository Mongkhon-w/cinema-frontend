<template>
  <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center shadow-xl">
    <div class="w-full text-center mb-10">
      <div class="w-4/5 h-2 bg-gradient-to-r from-cyan-500 via-amber-500 to-red-500 mx-auto rounded-full shadow-[0_4px_30px_rgba(245,158,11,0.4)]"></div>
      <span class="text-[10px] text-slate-500 tracking-widest uppercase block mt-2 font-black">SCREEN</span>
    </div>

    <div class="grid grid-cols-8 gap-3">
      <button 
        v-for="seat in bookingStore.seats" 
        :key="seat.seat_no"
        @click="select(seat)"
        :disabled="seat.status === 'BOOKED'"
        class="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold transition-all border"
        :class="{
          'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700': seat.status === 'AVAILABLE',
          'bg-amber-500/20 border-amber-500 text-amber-500 animate-pulse': seat.status === 'LOCKED',
          'bg-red-600/20 border-red-600 text-red-500 opacity-50 cursor-not-allowed': seat.status === 'BOOKED',
          'ring-2 ring-white scale-110': bookingStore.selectedSeat === seat.seat_no
        }"
      >
        {{ seat.seat_no }}
      </button>
    </div>

    <div class="flex gap-6 mt-8 text-xs text-slate-400 border-t border-slate-800 pt-6 w-full justify-center">
      <div class="flex items-center gap-2"><span class="w-4 h-4 bg-slate-800 border border-slate-700 rounded block"></span> ว่าง</div>
      <div class="flex items-center gap-2"><span class="w-4 h-4 bg-amber-500/20 border border-amber-500 rounded block"></span> กำลังล็อก</div>
      <div class="flex items-center gap-2"><span class="w-4 h-4 bg-red-600/20 border border-red-600 rounded block"></span> ขายแล้ว</div>
    </div>
  </div>
</template>

<script setup>
import { useBookingStore } from '../stores/booking'
const bookingStore = useBookingStore()

const select = (seat) => {
  if (seat.status === 'AVAILABLE') {
    bookingStore.selectedSeat = seat.seat_no
  }
}
</script>