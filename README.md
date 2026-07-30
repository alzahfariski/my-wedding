# 💍 My Wedding - Digital Wedding Invitation & Admin Platform

> Undangan Pernikahan Digital Interaktif, Modern, & Feature-Rich dengan Integrasi Realtime Database Firebase, Interactive Camera Photobooth, Google Drive, & Dashboard Admin.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02?style=for-the-badge&logo=greensock)](https://greensock.com/gsap/)

---

## 📌 Deskripsi Proyek

**My Wedding** adalah aplikasi web undangan pernikahan digital modern dan elegan yang dirancang khusus untuk memberikan pengalaman interaktif bagi para tamu undangan. Aplikasi ini tidak hanya menyajikan informasi pernikahan secara estetis, tetapi juga dilengkapi dengan fitur interaktif seperti **Photobooth Kamera Browser dengan Frame Kustom**, **Buku Tamu (Wishes & Doa) Realtime**, **Amplop Digital (Wedding Gift) dengan Konfirmasi Otomatis**, serta **Dashboard Admin** terlindungi untuk manajemen data tamu dan template WhatsApp.

---

## ✨ Fitur Utama

### 💌 1. Personalization & Interactive Cover
- **Dynamic Guest Name Greeting**: Menyapa tamu secara personal melalui parameter URL (`?to=NamaTamu`).
- **Interactive Cover Modal**: Pengalaman pembuka undangan yang mulus dengan transisi musik & efek visual.

### 💑 2. Profil Mempelai & Story Line
- **Groom & Bride Section**: Profil lengkap kedua mempelai beserta tautan media sosial.
- **Love Story Timeline & Gallery**: Linimasa perjalanan cinta & galeri foto interaktif dengan tampilan popup modal mendetail.

### ⏳ 3. Acara, Lokasi & Countdown Timer
- **Hitung Mundur Waktu**: Countdown timer akurat secara realtime menuju hari bahagia.
- **Integrasi Maps**: Tombol penunjuk arah langsung yang terhubung ke Google Maps lokasi acara.

### 📸 4. In-Browser Interactive Photobooth
- **Kamera Interaktif**: Tangkap foto secara langsung dari kamera laptop/smartphone tamu.
- **Frame Kustom Pernikahan**: Pilihan bingkai/frame estetis berdesain eksklusif.
- **Canvas Rendering & Instant Save**: Gabungkan hasil foto kamera dengan frame kustom via HTML5 Canvas API dan unduh secara instan.
- **Auto Sync Drive & Firestore**: Simpan kenangan foto tamu ke Google Drive & database secara otomatis.

### 💬 5. Buku Tamu (Wishes & RSVP Wall)
- **Kirim Ucapan & Doa**: Form kirim ucapan beserta status konfirmasi kehadiran (*Hadir*, *Tidak Hadir*, *Ragu-ragu*).
- **Realtime Feed**: Ucapan tamu ditampilkan secara realtime langsung di halaman undangan.

### 🎁 6. Amplop Digital & Gift Confirmation
- **Salin Nomor Rekening (One-Click Copy)**: Memudahkan tamu menyalin nomor rekening/e-wallet.
- **Form Konfirmasi Hadiah**: Tamu dapat mengunggah bukti transfer atau mengirim konfirmasi pemberian hadiah secara langsung.

### 🔐 7. Comprehensive Admin Dashboard
- **Keamanan Berbasis Cookie Session**: Sistem autentikasi server-side aman dengan enkripsi SHA-256 token.
- **Wishes Manager**: Kelola, filter, dan hapus pesan/ucapan dari tamu undangan.
- **Photobooth Manager**: Galeri foto photobooth tamu dengan fitur pratinjau dan hapus terintegrasi Google Drive API.
- **Confirmations Manager**: Verifikasi konfirmasi hadiah dan bukti transfer digital.
- **Guests & WA Blast Generator**: Manajemen daftar tamu undangan, kalkulasi status kehadiran, serta generator link pesan WhatsApp kustom dengan template bervariasi.

---

## 🛠️ Teknologi & Stack Utama

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Library UI**: [React 19](https://reactjs.org/), [Lucide React](https://lucide.dev/) (Icons)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animasi & Interaktivitas**: [GSAP](https://greensock.com/gsap/) & `@gsap/react`
- **Database & Backend Services**: Firebase Firestore / Realtime Database, Next.js Server Actions
- **Integrasi Cloud**: Google APIs (`googleapis`) & Google Drive API v3

---

## 📂 Struktur Direktori Proyek

```text
my-wedding/
├── public/                 # Static Assets (Gambar, Frame Photobooth, Audio, Musik)
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, Server Actions)
│   │   ├── actions/        # Server Actions (Auth, Google Drive Upload, Auth verification)
│   │   ├── admin/          # Route Dashboard Admin (/admin)
│   │   ├── v1/             # Versi Alternatif Halaman Undangan (/v1)
│   │   ├── globals.css     # Design Tokens, Utility Styling, Tailwind Config
│   │   └── page.tsx        # Halaman Utama Undangan
│   ├── components/         # Komponen UI React
│   │   ├── admin/          # Komponen Panel Admin (Guests, Wishes, Photobooth, WA Template)
│   │   ├── canvas/         # Helper & Render Canvas Photobooth
│   │   └── *.tsx           # Komponen Halaman Undangan (Cover, Gallery, Photobooth, Gift, etc)
│   ├── domain/             # Tipe Data, Interfaces, & Business Domain Models
│   ├── hooks/              # Custom React Hooks
│   ├── lib/                # Konfigurasi Helper (Firebase, Format Currency, Frame Helper)
│   └── services/           # Service Layer untuk Abstraksi Database & API Calls
├── .env.local              # File Environment Variable (Konfidensial)
├── guid.md                 # Panduan Kustomisasi Layout & Styling Visual
└── package.json            # Daftar Dependensi & Script
```

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Prasyarat
Pastikan sistem Anda telah terpasang:
- **Node.js**: `v18.x` atau `v20.x` (Direkomendasikan Node 20 LTS)
- **npm** / **pnpm** / **yarn**

### 2. Kloning Repository & Install Dependensi
```bash
# Kloning repository ini
git clone https://github.com/username/my-wedding.git

# Masuk ke direktori proyek
cd my-wedding

# Install seluruh dependensi
npm install
```

### 3. Konfigurasi Environment Variables (`.env.local`)
Buat file `.env.local` di root direktori proyek dan isikan variabel berikut:

```env
# Credentials Firebase Project
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Kredensial Admin Dashboard
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password

# Integrasi Google Drive API (Photobooth Cloud Backup)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_DRIVE_FOLDER_ID=your_drive_folder_id
```

### 4. Jalankan Server Pengembang (Development)
```bash
npm run dev
```

Buka browser dan akses [http://localhost:3000](http://localhost:3000).

- **Halaman Utama Undangan**: `http://localhost:3000?to=NamaTamu`
- **Dashboard Admin**: `http://localhost:3000/admin`

---

## 📜 Skrip yang Tersedia

| Skrip | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan Next.js dev server pada mode pengembang. |
| `npm run build` | Melakukan kompilasi & optimasi build produksi. |
| `npm run start` | Menjalankan server produksi dari hasil build. |
| `npm run lint` | Menjalankan pemeriksaan kode menggunakan ESLint. |

---

## 🎨 Panduan Kustomisasi Visual

Untuk petunjuk mendetail tentang kustomisasi tampilan, seperti:
- Mengubah ukuran & rasio gambar dekorasi
- Pengaturan font dinamis via `@utility` di `globals.css`
- Menggeser posisi elemen & layout swapping (tukar kolom)

Silakan merujuk ke dokumen [guid.md](file:///Users/alzahfariski/Development/kerjaan/alfaefsatech/project/my-wedding/guid.md).

---

## 🔒 Hak Cipta & Lisensi

Hak Cipta © 2026 **Alzah & Effri Wedding Team**. Seluruh hak cipta dilindungi undang-undang.
