# 🌾 Smart Irrigation & Water Level Monitoring System

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql)
![MQTT](https://img.shields.io/badge/MQTT-HiveMQ-660099?style=for-the-badge&logo=hivemq)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs)

Sistem Monitoring Irigasi Cerdas dan Pengontrol Ketinggian Air berbasis **Internet of Things (IoT)** dan **Web Application**. Proyek ini dirancang untuk memantau volume air tangki secara realtime, mengontrol pompa irigasi otomatis maupun manual, serta memberikan analitik konsumsi air.

---

## ✨ Fitur Utama (Key Features)

### 📊 1. Real-time Dashboard & Telemetri Air
- **Visualisasi Tangki Air Interaktif**: Animasi persentase ketinggian air tangki secara realtime.
- **Ringkasan Indikator Status**: Menampilkan status aktif pompa, total konsumsi air harian, tingkat kedalaman air, dan konektivitas alat IoT.

### 🌊 2. Monitoring & Grafik Analitik
- **Grafik Ketinggian Air (Water Level Chart)**: Grafik riwayat fluktuasi ketinggian air per jam/hari.
- **Analitik Konsumsi Air**: Perhitungan estimasi penggunaan air untuk efisiensi irigasi pertanian.

### 🚰 3. Kontrol Penyiraman (Smart Watering)
- **Mode Penyiraman Manual & Otomatis**: Kemampuan mengaktifkan atau mematikan pompa air dari jarak jauh melalui web.
- **Integrasi Protokol MQTT (HiveMQ)**: Komunikasi dua arah berkecepatan tinggi (*low latency*) antara web dashboard dengan mikrokontroler IoT (ESP32 / Arduino).

### 📜 4. Riwayat & Log Aktivitas (Activity History)
- Pencatatan log historis durasi penyiraman, waktu aktivasi pompa, dan perubahan volume air.
- Fitur pencarian dan pemfilteran data riwayat irigasi.

### 🔐 5. Autentikasi & Manajemen Pengguna
- Halaman login terproteksi untuk administrator/petani.
- Manajemen perangkat sensor IoT dan lokasi lahan (*farms*).

---

## 🛠️ Teknologi & Arsitektur (Tech Stack)

- **Frontend Framework**: Next.js 15 (App Router), React 19
- **Styling & Icons**: Tailwind CSS, Lucide React Icons
- **State Management & Realtime**: React Context API, MQTT WebSocket Client (`mqtt`)
- **Backend & Serverless API**: Next.js API Routes
- **Database**: MySQL (Connection Pooling via `mysql2`)
- **IoT Protocol**: MQTT Broker (HiveMQ Cloud / Local Broker)

---

## 📁 Struktur Direktori Project

```text
smart-irrigation/
├── public/                 # Assets statis & gambar
├── src/
│   ├── app/                # Next.js App Router (Halaman & API Routes)
│   │   ├── api/            # Serverless API endpoints (devices, history, login, pump, water-level)
│   │   ├── dashboard/      # Halaman Utama Dashboard
│   │   ├── history/        # Halaman Riwayat & Log Aktivitas
│   │   ├── login/          # Halaman Authentikasi
│   │   ├── monitoring/     # Halaman Monitoring Telemetri Realtime
│   │   └── watering/       # Halaman Kontrol Penyiraman & Pompa
│   ├── components/         # Komponen UI Reusable
│   │   ├── auth/           # Komponen Form Login
│   │   ├── charts/         # Komponen Grafik Ketinggian & Konsumsi Air
│   │   ├── dashboard/      # Sidebar, Navbar, Stat cards
│   │   ├── monitoring/     # Telemetry widgets & live charts
│   │   ├── tank/           # Visualisasi Tangki Air Interaktif
│   │   └── watering/       # Kontrol status pompa & jadwal
│   ├── context/            # React Context (WateringContext)
│   └── lib/                # Database pool connection & helper MQTT
```

---

## 🚀 Panduan Instalasi & Memulai (Getting Started)

### 1. Prasyarat
- Node.js versi 18.x atau lebih baru
- Database Server MySQL
- Broker MQTT (misal HiveMQ Cloud atau MQTT broker lokal)

### 2. Clone Repositori
```bash
git clone https://github.com/H-Nafi/smart-irrigation.git
cd smart-irrigation
```

### 3. Install Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variable
Duplikat file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Sesuaikan kredensial di dalam file `.env.local`:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_mysql_anda
DB_NAME=waterlevel_monitoring

# MQTT Broker Configuration
NEXT_PUBLIC_MQTT_BROKER_URL=wss://your-hivemq-instance.cloud:8884/mqtt
NEXT_PUBLIC_MQTT_USERNAME=username_mqtt_anda
NEXT_PUBLIC_MQTT_PASSWORD=password_mqtt_anda
```

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 👨‍💻 Penulis (Author)
- **H-Nafi** - *Fullstack IoT & Web Developer* - [GitHub Profile](https://github.com/H-Nafi)
