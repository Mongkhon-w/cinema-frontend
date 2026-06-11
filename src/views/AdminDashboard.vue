<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <header class="border-b border-slate-800 bg-slate-900 py-4 px-6">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-3">
          <span class="text-3xl">👑</span>
          <div>
            <h1 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Admin Dashboard
            </h1>
            <p class="text-xs text-slate-400">Cinema Management System</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span v-if="stats" class="text-xs text-slate-500">
            {{ stats.total_bookings }} bookings · {{ stats.total_audit_logs }} logs
          </span>
          <span class="text-sm text-slate-400">👤 {{ authStore.user?.email || authStore.user?.id }} (ADMIN)</span>
          <button @click="logout" class="text-sm bg-red-600/20 text-red-500 hover:bg-red-600/40 px-4 py-2 rounded transition">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-6">
      <div class="flex gap-2 mb-8 border-b border-slate-800">
        <button
          @click="activeTab = 'bookings'"
          :class="['px-6 py-3 font-bold transition border-b-2', activeTab === 'bookings' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-300']"
        >
          📋 Bookings
        </button>
        <button
          @click="activeTab = 'logs'"
          :class="['px-6 py-3 font-bold transition border-b-2', activeTab === 'logs' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-300']"
        >
          📝 Audit Logs
        </button>
      </div>

      <section v-if="activeTab === 'bookings'" class="space-y-6">
        <div class="flex flex-wrap gap-4 items-end">
          <div>
            <label class="text-xs font-bold text-slate-400 uppercase block mb-2">Filter by User</label>
            <input
              v-model="filters.userId"
              type="text"
              placeholder="user_id"
              class="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label class="text-xs font-bold text-slate-400 uppercase block mb-2">Filter by Status</label>
            <select
              v-model="filters.status"
              class="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">All Statuses</option>
              <option value="LOCKED">LOCKED</option>
              <option value="BOOKED">BOOKED</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-slate-400 uppercase block mb-2">Filter by Show</label>
            <input
              v-model="filters.showId"
              type="text"
              placeholder="show_id"
              class="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            @click="fetchBookings"
            class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition"
          >
            🔄 Refresh
          </button>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div v-if="loading" class="p-6 text-center text-slate-400">Loading...</div>
          <div v-else-if="bookings.length === 0" class="p-6 text-center text-slate-400">
            No bookings found
          </div>
          <table v-else class="w-full">
            <thead class="bg-slate-800 border-b border-slate-700">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-bold">User ID</th>
                <th class="px-6 py-3 text-left text-sm font-bold">User Name</th>
                <th class="px-6 py-3 text-left text-sm font-bold">Show</th>
                <th class="px-6 py-3 text-left text-sm font-bold">Seat</th>
                <th class="px-6 py-3 text-left text-sm font-bold">Status</th>
                <th class="px-6 py-3 text-left text-sm font-bold">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(booking, idx) in bookings"
                :key="idx"
                class="border-b border-slate-800 hover:bg-slate-800/50 transition"
              >
                <td class="px-6 py-4 text-sm">{{ booking.user_id }}</td>
                <td class="px-6 py-4 text-sm">{{ booking.user_email ? maskEmail(booking.user_email) : '-' }}</td>
                <td class="px-6 py-4 text-sm text-slate-400">{{ booking.show_id || '-' }}</td>
                <td class="px-6 py-4 text-sm">
                  <span class="px-3 py-1 bg-slate-700 rounded-full text-xs font-bold">{{ booking.seat_no }}</span>
                </td>
                <td class="px-6 py-4 text-sm">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-bold',
                      booking.status === 'BOOKED'
                        ? 'bg-emerald-600/30 text-emerald-400'
                        : 'bg-amber-600/30 text-amber-400'
                    ]"
                  >
                    {{ booking.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-slate-400">{{ formatTimestamp(booking.updated_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-sm text-slate-400">Total: {{ bookings.length }} bookings</div>
      </section>

      <section v-if="activeTab === 'logs'" class="space-y-6">
        <div class="flex gap-4 items-end">
          <div>
            <label class="text-xs font-bold text-slate-400 uppercase block mb-2">Filter by Event</label>
            <select
              v-model="logFilters.event"
              class="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">All Events</option>
              <option value="BOOKING_SUCCESS">Booking Success</option>
              <option value="BOOKING_TIMEOUT">Booking Timeout</option>
              <option value="SEAT_RELEASED">Seat Released</option>
              <option value="LOCK_FAIL">Lock Fail</option>
            </select>
          </div>
          <button
            @click="fetchAuditLogs"
            class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition"
          >
            🔄 Refresh Logs
          </button>
        </div>

        <div class="space-y-3">
          <div v-if="loading" class="p-6 text-center text-slate-400">Loading...</div>
          <div v-else-if="auditLogs.length === 0" class="p-6 text-center text-slate-400">
            No audit logs found
          </div>
          <div
            v-for="(log, idx) in auditLogs"
            :key="idx"
            class="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition"
          >
            <div class="flex items-start gap-4">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                  log.event === 'BOOKING_SUCCESS'
                    ? 'bg-emerald-600/20 text-emerald-400'
                    : log.event === 'BOOKING_TIMEOUT'
                      ? 'bg-orange-600/20 text-orange-400'
                      : log.event === 'SEAT_RELEASED'
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'bg-red-600/20 text-red-400'
                ]"
              >
                {{ getEventIcon(log.event) }}
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-bold text-white">{{ formatEvent(log.event) }}</h4>
                    <p class="text-xs text-slate-400 mt-1">
                      User: {{ log.user_id ? maskEmail(log.user_id) : '-' }} | Seat: {{ log.seat_no || extractSeat(log.details) }}
                    </p>
                    <p class="text-xs text-slate-500 mt-2">{{ log.details }}</p>
                  </div>
                  <span class="text-xs text-slate-500 whitespace-nowrap ml-4">{{ formatTimestamp(log.timestamp) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-sm text-slate-400">Total: {{ auditLogs.length }} events</div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { apiClient } from '../api/client'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref<'bookings' | 'logs'>('bookings')
const loading = ref(false)
const bookings = ref<any[]>([])
const auditLogs = ref<any[]>([])
const stats = ref<{ total_bookings: number; total_audit_logs: number } | null>(null)

const filters = ref({ userId: '', status: '', showId: '' })
const logFilters = ref({ event: '' })

const fetchDashboard = async () => {
  try {
    const res = await apiClient.get('/admin/dashboard')
    stats.value = res.data
  } catch {
    // non-critical
  }
}

const fetchBookings = async () => {
  loading.value = true
  try {
    const params: Record<string, string> = {}
    if (filters.value.userId) params.user_id = filters.value.userId
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.showId) params.show_id = filters.value.showId

    const res = await apiClient.get('/admin/bookings', { params })
    bookings.value = res.data.bookings || []
  } catch (error: any) {
    alert('Failed to fetch bookings: ' + (error.response?.data?.error || error.message))
  } finally {
    loading.value = false
  }
}

const fetchAuditLogs = async () => {
  loading.value = true
  try {
    const params: Record<string, string> = {}
    if (logFilters.value.event) params.event = logFilters.value.event

    const res = await apiClient.get('/admin/audit-logs', { params })
    auditLogs.value = res.data.logs || []
  } catch (error: any) {
    alert('Failed to fetch audit logs: ' + (error.response?.data?.error || error.message))
  } finally {
    loading.value = false
  }
}

const formatTimestamp = (ts: any): string => {
  if (!ts) return '-'
  if (typeof ts === 'string') return ts
  if (ts.$date) return new Date(ts.$date).toLocaleString()
  return new Date(ts).toLocaleString()
}

const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email
  const parts = email.split('@')
  const name = parts[0] || ''
  const domain = parts[1] || ''
  if (name.length <= 3) return `${name[0] || ''}***@${domain}`
  return `${name.substring(0, 3)}***@${domain}`
}

const extractSeat = (details: string): string => {
  const match = details?.match(/seat\s+(\w+)/i)
  return match?.[1] ?? '-'
}

const getEventIcon = (event: string): string => {
  switch (event) {
    case 'BOOKING_SUCCESS': return '✅'
    case 'BOOKING_TIMEOUT': return '⏱️'
    case 'SEAT_RELEASED': return '🔓'
    default: return '❌'
  }
}

const formatEvent = (event: string): string => {
  return event.replace(/_/g, ' ').toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  if (!authStore.isAdmin) {
    alert('ไม่มีสิทธิ์เข้าถึง: เฉพาะ Admin email ที่กำหนดในระบบเท่านั้น')
    router.push('/')
    return
  }
  fetchDashboard()
  fetchBookings()
  fetchAuditLogs()
})
</script>
