import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    seats: [],
    selectedSeat: '',
    logs: [],
    ws: null,
    showId: 'default-show'
  }),
  actions: {
    addLog(msg) {
      const time = new Date().toLocaleTimeString()
      this.logs.unshift(`[${time}] ${msg}`)
    },
    
    async fetchSeats() {
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/seats?show_id=${this.showId}`)
        this.seats = res.data.seats
        this.addLog('โหลดผังที่นั่งสำเร็จ')
      } catch (error) {
        this.addLog(`Error loading seats: ${error.message}`)
      }
    },
    
    connectWS() {
      this.ws = new WebSocket('ws://localhost:8080/api/v1/ws')
      this.ws.onopen = () => this.addLog('เชื่อมต่อ WebSocket สำเร็จ (Real-time Active)')
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.addLog(`WS อัปเดต: ${data.seat_no} -> ${data.status}`)
        
        // อัปเดตสถานะเก้าอี้
        const seatIndex = this.seats.findIndex(s => s.seat_no === data.seat_no)
        if (seatIndex !== -1) {
          this.seats[seatIndex].status = data.status
          // ถ้าเก้าอี้ที่เรากำลังจะกด โดนคนอื่นแย่งไปแล้ว ให้เคลียร์ค่าทิ้ง
          if (data.seat_no === this.selectedSeat && data.status !== 'AVAILABLE') {
            this.selectedSeat = ''
          }
        }
      }
      this.ws.onerror = () => this.addLog('WebSocket Error')
      this.ws.onclose = () => this.addLog('WebSocket Disconnected')
    },
    
    async lockSeat() {
      const authStore = useAuthStore()
      try {
        await axios.post('http://localhost:8080/api/v1/seats/lock', {
          show_id: this.showId,
          seat_no: this.selectedSeat
        }, { headers: { Authorization: `Bearer ${authStore.token}` } })
        
        this.addLog(`ล็อกที่นั่ง ${this.selectedSeat} สำเร็จ มีเวลาชำระเงิน 5 นาที`)
      } catch (error) {
        this.addLog(`ล็อกไม่สำเร็จ: ${error.response?.data?.error || error.message}`)
        alert(`ขออภัย ไม่สามารถล็อกที่นั่ง ${this.selectedSeat} ได้ อาจมีผู้อื่นกำลังทำรายการอยู่`)
        this.selectedSeat = ''
      }
    },
    
    async confirmSeat() {
      const authStore = useAuthStore()
      try {
        await axios.post('http://localhost:8080/api/v1/seats/confirm', {
          show_id: this.showId,
          seat_no: this.selectedSeat
        }, { headers: { Authorization: `Bearer ${authStore.token}` } })
        
        this.addLog(`ชำระเงินที่นั่ง ${this.selectedSeat} สำเร็จ!`)
        this.selectedSeat = ''
      } catch (error) {
        this.addLog(`ชำระเงินไม่สำเร็จ: ${error.response?.data?.error || error.message}`)
      }
    }
  }
})