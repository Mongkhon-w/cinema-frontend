import { defineStore } from 'pinia'
import { apiClient, API_BASE_URL } from '../api/client'

export interface Seat {
  id?: string;
  show_id: string;
  seat_no: string;
  status: 'AVAILABLE' | 'LOCKED' | 'BOOKED';
}

export const useBookingStore = defineStore('booking', {
  state: () => ({
    seats: [] as Seat[],
    selectedSeat: '',
    lockedSeat: '', 
    bookedSeat: '', 
    logs: [] as string[],
    ws: null as WebSocket | null,
    showId: 'default-show'
  }),
  actions: {
    addLog(msg: string) {
      this.logs.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`)
    },
    async fetchSeats() {
      try {
        const res = await apiClient.get(`/seats?show_id=${this.showId}`)
        this.seats = res.data.seats || []
        this.addLog('โหลดผังที่นั่งล่าสุดสำเร็จ')
      } catch (error: any) {
        this.addLog(`Load Error: ${error.message}`)
      }
    },
    connectWS() {
      if (this.ws) return
      const wsBase = API_BASE_URL.replace(/^http/, 'ws')
      this.ws = new WebSocket(`${wsBase}/api/v1/ws`)
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.addLog(`WS อัปเดต: ${data.seat_no} -> ${data.status}`)
        this.seats = this.seats.map(s => s.seat_no === data.seat_no ? { ...s, status: data.status } : s)
      }
      this.ws.onclose = () => {
        this.ws = null
        setTimeout(() => this.connectWS(), 3000)
      }
    },
    async lockSeat() {
      if (!this.selectedSeat) return
      
      try {
        await apiClient.post('/seats/lock', {
          show_id: this.showId,
          seat_no: this.selectedSeat
        })
        
        this.lockedSeat = this.selectedSeat 
        this.addLog(`ล็อกที่นั่ง ${this.selectedSeat} สำเร็จ`)
        await this.fetchSeats() 
        
      } catch (error: any) {
        // ดักจับ Error 
        const errorMsg = error.response?.data?.message || error.response?.data?.error || "ที่นั่งนี้มีคนจองแล้ว!"
        this.addLog(`ล็อกไม่สำเร็จ: ${errorMsg}`)
        alert(errorMsg) // แจ้งเตือน Popup 
        
        // บังคับรีเฟรชข้อมูลทันที
        await this.fetchSeats() 
        this.selectedSeat = '' 
        this.lockedSeat = '' 
      }
    },
    async confirmSeat(): Promise<boolean> {
      try {
        await apiClient.post('/seats/confirm', {
          show_id: this.showId,
          seat_no: this.selectedSeat
        })
        
        // เก็บสถานะที่นั่งที่ซื้อแล้ว
        this.bookedSeat = this.selectedSeat
        this.lockedSeat = '' // เคลียร์ล็อก เปลี่ยนเป็น BOOKED 
        this.addLog(`ชำระเงินที่นั่ง ${this.selectedSeat} สำเร็จ!`)
            
        await this.fetchSeats()
        return true // ชำระเงินสำเร็จ
      } catch (error: any) {
        const errorMsg = error.response?.data?.error || error.message || "ชำระเงินไม่สำเร็จ"
        this.addLog(`ชำระเงินไม่สำเร็จ: ${errorMsg}`)
        alert("การชำระเงินไม่สำเร็จ: " + errorMsg)
        return false // ชำระเงินล้มเหลว
      }
    }
  }
})