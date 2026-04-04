# Product Requirements Document (PRD) - MoneyTrack

## 1. Project Overview
**MoneyTrack** adalah aplikasi web pelacakan keuangan personal yang dirancang untuk membantu pengguna mencatat pemasukan, pengeluaran, dan memantau kesehatan finansial mereka secara real-time dengan antarmuka yang bersih dan intuitif.

## 2. Goals & Objectives
- Memberikan kemudahan dalam mencatat transaksi harian (kurang dari 10 detik per input).
- Memberikan visualisasi aliran uang (cash flow) yang jelas untuk membantu pengambilan keputusan finansial.
- Membantu pengguna mengelola saldo di berbagai instrumen (Bank, Tunai, E-wallet) dalam satu tempat.

## 3. Target Audience
Individu yang ingin mengelola keuangan pribadi dengan lebih disiplin dan terorganisir.

## 4. Functional Requirements

### 4.1 Manajemen Akun (Wallet)
- Pengguna dapat membuat beberapa akun (misal: Bank BCA, Dompet Tunai, e-Wallet).
- Pengguna dapat melihat saldo saat ini di setiap akun dan total saldo gabungan.
- Pengguna dapat melakukan transfer antar akun (mutasi internal).

### 4.2 Manajemen Kategori
- Pengguna dapat membuat kategori khusus untuk pengeluaran (misal: Makan, Belanja, Transport).
- Pengguna dapat membuat kategori khusus untuk pemasukan (misal: Gaji, Bonus, Investasi).
- Mendukung ikon atau warna untuk setiap kategori agar mudah dikenali.

### 4.3 Manajemen Transaksi
- Mencatat transaksi dengan detail: Nominal, Tanggal, Kategori, Akun Sumber, dan Catatan Opsional.
- Edit dan hapus transaksi yang salah input.
- Filter transaksi berdasarkan rentang waktu (harian, mingguan, bulanan), kategori, atau akun.

### 4.4 Dashboard & Visualisasi
- Ringkasan total pemasukan dan pengeluaran bulan berjalan di halaman utama.
- Grafik lingkaran (Pie Chart) untuk distribusi pengeluaran per kategori.
- Grafik garis (Line Chart) untuk tren saldo dari waktu ke waktu.

### 4.5 Autentikasi & Keamanan
- Login/Register menggunakan email atau OAuth (Google).
- Proteksi data agar hanya pemilik akun yang bisa melihat datanya.

## 5. Non-Functional Requirements
- **Responsivitas:** Aplikasi harus *Mobile-First* (nyaman digunakan di HP maupun Desktop).
- **Keamanan:** Data finansial bersifat sangat privat; enkripsi database adalah keharusan.
- **Performa:** Navigasi antar halaman harus cepat (di bawah 1 detik).

## 6. Tech Stack
- **Framework (Frontend & Backend):** Next.js 16.x (App Router & Server Actions). Memanfaatkan fitur terbaru dari React 19 dan Next.js untuk performa maksimal.
- **Styling:** Tailwind CSS + Shadcn/UI untuk komponen antarmuka yang modern dan konsisten.
- **Database:** PostgreSQL (direkomendasikan menggunakan layanan seperti Supabase atau Neon).
- **ORM:** Drizzle ORM 0.45.x (untuk interaksi database yang sangat cepat, ringan, dan memiliki type-safety penuh).
- **Autentikasi:** NextAuth.js (Auth.js) atau Clerk.
- **Visualisasi:** Recharts atau Chart.js untuk grafik finansial.

## 8. Naming Convention Standard (The "Lugas & Memorable" Rule)
Untuk menjaga skalabilitas dan kejelasan maksud kode, setiap file wajib mengikuti aturan penamaan berikut:
- **Specific Items (Complex/Feature-heavy):** Wajib menggunakan gabungan **2 kata** yang lugas dan berani (Contoh: `WalletVault.ts`, `PulseBoard.tsx`, `FlowMaster.ts`).
- **Simple Items (Generic/Single-purpose):** Cukup **1 kata** yang lugas dan kuat (Contoh: `Button.tsx`, `Icon.tsx`, `Layout.tsx`).
- **Separation Concept (Strict):**
    - **Core (Brain):** File `.ts`. Berisi `Custom Hooks` yang mengelola state, API calls, dan algoritma. Dilarang ada JSX.
    - **Shell (Body):** File `.tsx`. Berisi `Presentational Components`. Dilarang ada `useState`, `useEffect`, atau fungsi async. Hanya menerima `props` dan merender UI.
    - **Map (Bridge):** Folder `app/`. Hanya memanggil Hook dari Core dan melemparkannya ke Shell.
