# Stage 1: Build the Vue 3 application
FROM node:20-alpine AS builder 
WORKDIR /app

# คัดลอกไฟล์ตั้งค่าและติดตั้งไลบรารี
COPY package*.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมดและสั่ง Build เป็น Static Files
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx (Production Server)
FROM nginx:stable-alpine

# คัดลอกไฟล์ Static ที่ Build เสร็จแล้วจาก Stage 1 มาใส่ใน Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# คัดลอกการตั้งค่า Nginx สำหรับ SPA (Vue Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]