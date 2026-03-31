# Business Processes - MoneyTrack

Dokumen ini menjelaskan alur kerja utama dalam aplikasi MoneyTrack.

## 1. Alur Onboarding Pengguna
1. **Registrasi:** User membuat akun baru menggunakan email atau Google Sign-In.
2. **Setup Awal:** Sistem meminta user membuat setidaknya satu "Akun Keuangan" (misal: Dompet) dan mengisi saldo awal.
3. **Kategori Default:** Sistem secara otomatis membuatkan beberapa kategori umum (Makan, Transportasi, Gaji) agar user bisa langsung mulai mencatat.

## 2. Pencatatan Transaksi (Pemasukan/Pengeluaran)
1. **Input:** User memilih tipe transaksi (Pengeluaran atau Pemasukan).
2. **Formulir:** User mengisi nominal, memilih kategori, memilih akun yang digunakan, dan mengatur tanggal.
3. **Validasi:** 
    - Jika Pengeluaran: Sistem mengecek apakah saldo di akun mencukupi (opsional, bisa dibiarkan negatif).
    - Jika Pemasukan: Saldo akan langsung ditambah.
4. **Eksekusi:** Sistem menyimpan data transaksi dan memperbarui saldo `Account` yang terkait secara atomik.
5. **Update UI:** Dashboard dan grafik diperbarui secara real-time untuk mencerminkan transaksi baru.

## 3. Alur Transfer Antar Akun
1. **Inisiasi:** User memilih fitur "Transfer".
2. **Detail:** User memilih "Akun Asal", "Akun Tujuan", dan memasukkan nominal.
3. **Proses:**
    - Saldo Akun Asal dikurangi.
    - Saldo Akun Tujuan ditambah.
    - Sistem mencatat satu entri transaksi bertipe "Transfer" untuk keperluan audit.
4. **Selesai:** Saldo di kedua akun diperbarui.

## 4. Penyusunan Laporan & Visualisasi
1. **Agregasi:** Sistem mengelompokkan semua transaksi berdasarkan `CategoryID` dan `Month`.
2. **Kalkulasi:** Menghitung total `SUM(amount)` untuk setiap grup.
3. **Rendering:** Data dikirim ke frontend untuk ditampilkan dalam bentuk grafik:
    - **Pie Chart:** Membandingkan pengeluaran antar kategori dalam satu bulan.
    - **Summary Card:** Menampilkan selisih (Net Income) antara total pemasukan dan pengeluaran.

## 5. Manajemen Data (Edit/Hapus)
1. **Edit:** Jika user mengubah nominal transaksi, sistem akan menghitung selisihnya dan menyesuaikan saldo akun terkait (Reversi saldo lama, lalu terapkan saldo baru).
2. **Hapus:** Jika transaksi dihapus, saldo akun dikembalikan ke keadaan sebelum transaksi tersebut ada.
