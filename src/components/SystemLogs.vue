<template>
  <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex-1 flex flex-col min-h-[200px]">
    <h3 class="text-xs font-bold text-slate-400 mb-2">System Status</h3>
    <div class="bg-slate-950 rounded border border-slate-800 p-2 flex-1 overflow-y-auto font-mono text-[10px] text-emerald-500 flex flex-col-reverse">
      <div v-for="(log, idx) in bookingStore.logs" :key="idx" class="mb-1 border-b border-slate-800 pb-1">
        {{ log }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBookingStore } from '../stores/booking'
const bookingStore = useBookingStore()
</script>