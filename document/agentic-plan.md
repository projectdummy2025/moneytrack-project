# Rencana Implementasi Agentic AI: Input Transaksi Berbasis Struk Cerdas

Dokumen ini merinci arsitektur, alur kerja pengguna (User Flow), dan spesifikasi teknis untuk mengimplementasikan fitur **Agentic Input** pada MoneyTrack. Fitur ini memungkinkan pengguna mencatat transaksi secara otomatis hanya dengan mengunggah foto struk belanja atau invoice.

Sistem ini didukung oleh kombinasi **OCR Worker** (hosted di Hugging Face) dan **Multi-Agent System** bertenaga **Groq API** demi akurasi pemetaan finansial yang maksimal.

---

## 1. Alur Pengguna (User Flow): Pemindaian Cerdas & Tombol Melayang (FAB Overlay)

Untuk menjaga kegunaan input manual yang sudah familiar bagi pengguna, tombol tambah tengah `[+]` di navbar tetap dipertahankan untuk input manual konvensional. Fitur pemindai cerdas dihadirkan sebagai **Floating Action Button (FAB) Overlay** yang elegan di halaman utama (Dashboard).

```
[Tombol Melayang Scan] ──> [Pilih Foto Struk] ──> [Animasi Scan State] ──> [Review Draft (Cerdas)] ──> [Konfirmasi & Simpan]
```

### Langkah 1: Aktivasi Pemindaian (Initiation)
* **Tampilan**: Di sudut kanan bawah halaman Dashboard, terdapat tombol lingkaran melayang (**FAB Overlay**) berdiameter `56px`.
* **Desain Tombol**:
  * Menggunakan gaya *glassmorphism* modern (`bg-[#162424]/80` dengan `backdrop-blur-md`).
  * Memiliki garis tepi tipis bernuansa **neon turkuis bersinar** (`#35C2C1`) dengan efek animasi denyut lingkaran (*pulsing ring*) halus di belakangnya sebagai penanda fitur pintar.
  * Berisi ikon kamera/pemindaian bersinar (`ScanLine` atau `Camera`).
* **Interaksi**: Pengguna mengetuk tombol melayang tersebut, dan sistem langsung memicu pemilihan file gambar/kamera sistem secara instan.

### Langkah 2: Proses Pemindaian Cerdas (Visual Scan State)
* Begitu gambar struk dipilih, drawer `QuickRecord` langsung meluncur ke atas menampilkan **Status Pemrosesan (Scanning Screen)**:
  * **Visual**: Gambar struk yang diunggah ditampilkan dengan latar belakang buram (*blur backdrop*) dan sinar pemindai laser neon bergerak vertikal naik-turun.
  * **Teks Status Agen**: Menampilkan status pemikiran agen secara real-time untuk transparansi aksi AI:
    1. `"Mengunggah struk ke OCR Worker..."`
    2. `"Agen 1: Membersihkan & menyusun data struk belanja..."`
    3. `"Agen 2: Memetakan transaksi ke dompet & kategori Anda..."`

### Langkah 3: Tinjauan Hasil Pemetaan (Draft Review State)
Setelah agen selesai memproses (estimasi total waktu < 2.5 detik menggunakan Groq), drawer menampilkan formulir transaksi yang terisi otomatis secara cerdas:
* **Nominal (Amount)**: Terisi otomatis sesuai nominal total pada struk.
* **Akun/Dompet (Wallet)**: Dipilih otomatis (misal: `Gopay` karena Agen 2 mendeteksi pembayaran via QRIS/E-Wallet pada struk dan mencocokkannya dengan akun dompet aktif milik pengguna).
* **Kategori (Category)**:
  * **Kasus A (Kategori Ada)**: Kategori yang ada di database langsung terpilih (misal: `Food & Beverage`).
  * **Kasus B (Saran Kategori Baru)**: Jika struk berisi barang yang tidak cocok dengan kategori saat ini (misal: beli obat di apotek, tapi pengguna belum punya kategori Kesehatan), Agen 2 akan **merekomendasikan kategori baru** (misal: `Kesehatan`) lengkap dengan warna pastel yang diusulkan.
* **Catatan (Memo)**: Berisi ringkasan barang belanjaan yang disusun rapi oleh Agen 1 (misal: `"Kopi Kenangan: 2x Es Kopi Kenangan Mantan, 2x Roti Coklat"`).

### Langkah 4: Konfirmasi Akhir (User Decision)
* **Persetujuan**: Pengguna meninjau draf. Jika sudah sesuai, pengguna menekan tombol **"Confirm & Record"**.
  * *Efek Sistem*: Jika pengguna menyetujui saran kategori baru, sistem akan **membuat kategori tersebut secara otomatis di database** sebelum menyimpan transaksi.
* **Koreksi Manual**: Pengguna dapat mengedit field apa pun (nominal, dompet, kategori, memo) secara manual sebelum menyimpannya jika dirasa ada interpretasi agen yang kurang tepat.

---

## 2. Arsitektur Teknis Multi-Agent (Powered by Groq)

Pemrosesan struk belanja dibagi menjadi tiga agen terkoordinasi (3-Agent System) untuk memisahkan tanggung jawab, menekan halusinasi, dan menjamin kepatuhan data terhadap skema database (Zero DB Error).

```
                  +--------------------------------+
                  |    OCR Worker (Hugging Face)   |
                  +--------------------------------+
                                  | Teks Raw OCR
                                  v
                  +--------------------------------+
                  |   Agen 1: Raw Data Cleaner     | -> Model: Llama-3.3-70b (Akurasi Tinggi)
                  +--------------------------------+
                                  | JSON Fakta Belanja Bersih
                                  v
                  +--------------------------------+
                  |  Agen 1.5: Schema & Context    | -> Model: Llama-3.1-8b (Validasi Skema DB)
                  |           Validator            |
                  +--------------------------------+
                                  | Panduan Struktur & Aturan Valid
                                  v
+------------------+  +--------------------------------+
| Database Postgres | - |    Agen 2: Database Mapper     | -> Model: Llama-3.1-8b (Cepat & Klasifikasi)
+------------------+  +--------------------------------+
 (Dompet & Kategori User)         |
                                  v
                  +--------------------------------+
                  |  Agen 1.5: Schema & Context    | -> Validasi Pasca-Pemetaan (Cek Duplikat/ID)
                  |           Validator            |
                  +--------------------------------+
                                  | Draf Payload Valid 100%
                                  v
                  +--------------------------------+
                  |  Frontend Pre-fill Payload     |
                  +--------------------------------+
```

### Agen 1: Raw Data Cleaner (Pembersih Data)
* **Tanggung Jawab**: Mengubah teks OCR mentah yang berantakan menjadi data transaksi finansial terstruktur (JSON). Agen ini murni menganalisis fakta struk tanpa mengetahui detail database user.
* **Model Rekomendasi**: `llama-3.3-70b-specdec` atau `mixtral-8x7b-32768` (Groq API).
* **Format Output JSON**:
```json
{
  "merchantName": "Kopi Kenangan - Mall Kelapa Gading",
  "totalAmount": 78000,
  "transactionDate": "2026-05-31",
  "items": [
    { "name": "Es Kopi Kenangan Mantan", "price": 24000, "qty": 2 },
    { "name": "Roti Coklat", "price": 15000, "qty": 2 },
    { "name": "Tax 10%", "price": 7000, "qty": 1 }
  ],
  "paymentMethod": "QRIS"
}
```

### Agen 1.5: Database Schema & Context Validator (Validator Skema & Konteks)
* **Tanggung Jawab**: Bertindak sebagai penengah dan validator yang memastikan integritas data. Agen ini bekerja dalam dua fase:
  1. **Pre-Validation**: Membaca aturan skema tabel transaksi PostgreSQL (panjang memo maksimal 255 karakter, tipe data nominal numerik, kesesuaian klasifikasi pengeluaran) dan menyusun pedoman instruksi skema yang wajib diikuti oleh Agen 2.
  2. **Post-Verification**: Membaca draf final dari Agen 2 dan mencocokkannya dengan ID dompet dan kategori riil milik user di database untuk menjamin 100% kebenaran rujukan relasi kunci asing (foreign key) serta memastikan usulan kategori baru tidak terduplikasi.
* **Model Rekomendasi**: `llama-3.1-8b-instant` atau `gemma2-9b-it` (Groq API).

### Agen 2: Database Mapping Agent (Pembuat Mapping DB)
* **Tanggung Jawab**: Mengambil output bersih dari Agen 1 dan memetakannya ke entitas database riil milik pengguna yang sedang aktif (Wallets & Categories) sesuai dengan batasan panduan skema dari Agen 1.5.
* **Input Pendukung**: Data kueri database pengguna yang aktif saat sesi berlangsung:
  * Daftar Dompet Aktif: `[{ id, walletName, walletType }]`
  * Daftar Kategori Aktif: `[{ id, categoryName, classification }]`
* **Model Rekomendasi**: `llama-3.1-8b-instant` or `gemma2-9b-it` (Groq API).
* **Format Output JSON**:
```json
{
  "mappedWalletId": "w_gopay_123", 
  "mappedCategoryId": "cat_fnb_456", 
  "transactionType": "expense",
  "amount": "78000",
  "memo": "Kopi Kenangan - Mall Kelapa Gading: 2x Es Kopi Kenangan Mantan, 2x Roti Coklat",
  "suggestNewCategory": null
}
```
*Jika tidak ada kategori yang cocok di database pengguna, Agen 2 akan menghasilkan nilai:*
```json
{
  "mappedWalletId": "w_gopay_123", 
  "mappedCategoryId": null, 
  "transactionType": "expense",
  "amount": "78000",
  "memo": "Apotek Kimia Farma: 1x Amoxilin, 1x Paracetamol",
  "suggestNewCategory": {
    "name": "Kesehatan",
    "icon": "Medicine",
    "color": "#ef4444"
  }
}
```

---

## 3. Integrasi & Keamanan Sesi Pengguna

Untuk memastikan data tidak bocor antar pengguna dan pemetaan Agen 2 berjalan akurat:
1. **Validasi Sesi**: Backend Next.js (`/api/ocr`) membaca cookie sesi (`moneytrack_session`) dari pengguna yang mengunggah gambar untuk memvalidasi identitas mereka.
2. **Kueri Konteks Aman**: Server melakukan kueri ke PostgreSQL untuk mengambil daftar dompet dan kategori *hanya* milik User-ID yang valid tersebut.
3. **Penyajian Data ke Agen 2**: Data dompet dan kategori dikirimkan sebagai variabel di dalam prompt sistem Agen 2 secara dinamis.
4. **Eksekusi Aman**: Dengan demikian, Agen 2 hanya mengetahui data dompet dan kategori milik pengguna yang sedang aktif, menjaga privasi finansial sepenuhnya.
