# PRD — Sistem Manajemen Produksi Undangan

**Versi:** 0.3 (Draft — lengkap, siap diserahkan ke AI coding assistant untuk implementasi)
**Disusun untuk:** Internal — Bisnis Produksi Undangan
**Status:** Draft awal untuk didiskusikan dengan tim/owner

---

## 1. Latar Belakang

Saat ini proses bisnis berjalan manual/tidak terstruktur di beberapa titik kritis:

- Tidak ada batas jelas kapan client boleh order (deadline produksi vs kapasitas tim).
- Harga ditentukan tidak konsisten, sulit dibandingkan antar paket.
- Invoice/nota dibuat manual, rawan salah hitung dan tidak seragam.
- Komunikasi request desain dari frontdesk/owner ke desainer masih berupa catatan bebas → sering salah paham, desainer harus menerka-nerka ("ngawang").
- Tidak ada sistem pengingat deadline yang terpusat.

## 2. Tujuan Produk

Membangun sebuah **web app internal** yang merapikan seluruh alur kerja dari client masuk → deal harga → brief desain → produksi → invoice, dengan 2 modul utama:

1. **Sistem Manajemen Operasional** — pricelist, kalkulator/invoice, kalender kapasitas & deadline, reminder.
2. **Sistem Request Desain (Project Brief Terstruktur)** — form dinamis per jenis undangan, dengan input foto referensi (akses kamera langsung), dan (fase lanjutan) AI mockup generator.

## 3. Target Pengguna / Role

| Role | Jumlah User | Kebutuhan Utama |
|---|---|---|
| **Frontdesk / Admin** | 3 orang | Input data client, pilih paket & harga, buat invoice, isi form request desain, atur jadwal/deadline |
| **Owner / Manajemen** | 1 orang (atau merangkap Frontdesk) | Ubah pricelist, lihat kapasitas harian, approve/monitor semua project, lihat laporan |
| **Desainer** | 2 orang | Terima brief yang jelas & terstruktur (bukan catatan bebas), lihat referensi foto, lihat deadline per project |

*Total sekitar 5–6 akun aktif. Ini penting untuk desain sistem hak akses (role-based) — tidak perlu sistem multi-tenant kompleks, cukup role sederhana dengan permission per modul.*

## 4. Lingkup Fitur

### 4.1 Modul Pricelist

Berdasarkan pricelist aktual (WIPJOGJA), harga **tidak flat per pcs**, tapi **bertingkat (tiered) berdasarkan rentang jumlah pcs** — makin banyak pcs, makin murah harga satuannya. Contoh: *Amplop & Single Hard* → 100–200 pcs = Rp 10.300/pcs, tapi 901–1000 pcs = Rp 6.700/pcs. Jadi struktur data pricelist harus mendukung **tabel tingkatan harga per produk**, bukan satu angka saja.

**Struktur kategori produk (dari data yang ada):**

| Kelompok | Contoh Produk | Catatan |
|---|---|---|
| Hard Cover | Mini Amplop & Hard, Amplop & Single Hard, Rustic Hard 01/02, Rustic J Hard, Medium Amplop & Hard (+Cutting), Amplop & Hard Lipat (+Kancing), Hard Lipat & Emblem Kancing, Passport Hard & Tiket | Tiap produk beda ukuran & bahan (Ivory+Karton, Linen+Karton, Java/Akasia+Karton) |
| Soft Cover | Soft Cover Lipat, Soft Lipat Origami, Amplop+Single Soft, Amplop+Soft Lipat, Rustic I Soft | Khusus harga flat per paket qty kecil (25/50/75 pcs) — lihat "Special Price Under 100" |
| Special Price (Under 100 pcs) | Versi hard & soft cover di atas, dijual paket 25/50/75 pcs dengan harga total (bukan per pcs) | Perlu ditandai di sistem sebagai "mode harga paket", beda dari mode "harga per pcs" |
| Biaya Tambahan (Add-on) | Hot Print (tinta emas), Embos (timbul), Wax Seal, Denah Pisah, Kertas Transparan Print, Buku Tamu, Amplop Dalam Cetak, Print Label Nama, Kertas Tekstur (Akasia/Linen/Jasmine) | Sebagian juga tiered by qty (misal Hot Print: 100-200pcs=Rp200rb/spot, 500pcs↑=Rp600/spot); sebagian harga flat per pcs/per item |

**Field per produk di sistem:**
- Nama produk, kategori (Hard/Soft/Special/Add-on), ukuran, bahan
- Free item bawaan (misal: pakai foto, plastik terpisah, stiker label nama, kartu souvenir — ini gratis, jadi cukup dicatat sebagai info, tidak masuk hitungan harga)
- **Tabel tingkatan harga**: daftar pasangan (rentang jumlah pcs → harga/pcs atau harga paket)
- Untuk add-on tiered (Hot Print, Embos): sama, tabel rentang qty → harga per spot
- Untuk add-on non-tiered (Wax Seal, Denah Pisah, dll): cukup satu harga per pcs/per item
- Catatan varian (misal: "amplop dalam putih" vs "amplop dalam cetak" → harga beda meski produk sama)

**Fitur:**
- CRUD pricelist termasuk tabel tingkatan harga per produk (bisa tambah/hapus baris rentang).
- Riwayat perubahan harga (log kapan harga berubah, dari berapa ke berapa) — supaya invoice lama tetap konsisten dengan harga saat itu dibuat, dan harga baru tidak keliru dipakai retroaktif.
- Role: hanya Owner/Admin yang bisa ubah harga; Frontdesk hanya bisa memilih dari pricelist (read + pakai) saat membuat invoice.
- Import awal data pricelist bisa dilakukan sekali dari file PDF/Excel yang sudah ada (data entry manual sekali di awal, sistem tidak perlu baca otomatis dari PDF).

### 4.2 Modul Kalkulator & Invoice Maker

Disesuaikan dengan format **Surat Order** yang sudah dipakai (dari file referensi), supaya tim tidak perlu belajar format baru — sistem cuma merapikan & mengotomatisasi proses yang sama.

**Kalkulator:**
- Input data client: Nama, Alamat, No HP.
- Pilih produk dari pricelist → input jumlah pcs → sistem otomatis cari tingkatan harga yang sesuai (sesuai rentang qty) → hitung Harga/pcs × Jumlah = Subtotal.
- Bisa tambah beberapa baris item sekaligus (misal: undangan utama + amplop dalam cetak + buku tamu).
- Tambahan (add-on) dipilih terpisah: Hot Print Emas, Custom Pisau, Buku Tamu, Print Label Nama, Undangan Online, Kilat — masing-masing dengan keterangan & harga sesuai pricelist.
- **Mode perbandingan harga**: bisa buat 2–3 skenario paket sekaligus (misal: Paket A pakai Rustic Hard vs Paket B pakai Medium Amplop) untuk ditunjukkan ke client sebelum deal.
- Total otomatis terhitung dari semua item + tambahan.

**Invoice / Surat Order:**
- Setelah skenario dipilih client → convert jadi **Surat Order resmi** dengan field:
  - Data client (Nama, Alamat, No HP)
  - Rincian item (Keterangan jenis undangan, Jumlah pcs, Harga/pcs, Subtotal) + Tambahan (dengan keterangan)
  - Total keseluruhan
  - **Pembagian pembayaran**: DP 1 (nominal tetap, misal Rp 200.000 — sesuai "Cara Pemesanan"), DP 2 (persentase, misal 80% saat ACC desain), Pelunasan (sisa saat undangan jadi)
  - Tanggal tonggak proses: Desain Awal, Revisi Desain, ACC Desain, Undangan Jadi — ini otomatis terhubung ke Modul Kalender (§4.3) sebagai deadline per tahap, bukan cuma satu deadline akhir.
  - Catatan & Catatan Lain (freetext)
- Status Surat Order: **Draft → DP 1 Dibayar → Dalam Antrian Desain → Preview/Revisi → ACC (DP 2 Dibayar) → Cetak → Lunas → Selesai**. Status ini otomatis sinkron dengan status Project di Modul Request Desain (§4.4), supaya frontdesk tidak input dua kali.
- Export ke PDF / print, dengan layout mengikuti format Surat Order yang sudah ada.

### 4.3 Modul Kalender & Kapasitas
Dua jenis pembatasan kapasitas yang dibedakan:

1. **Kapasitas Client per Tanggal** — batas jumlah client baru yang bisa diterima per hari/tanggal tertentu (mencegah overbooking penerimaan order).
2. **Kapasitas Desain per Hari** — batas jumlah desain yang bisa dikerjakan tim desainer per hari (mencegah desainer kebanjiran kerjaan).

Fitur pendukung:
- Kalender visual (bulanan/mingguan) menampilkan jumlah slot terisi vs sisa slot, per kategori di atas.
- Setiap Surat Order punya 4 tonggak tanggal yang ditarik dari alur "Cara Pemesanan": **Desain Awal → Revisi Desain (max 3x, sesuai kebijakan) → ACC Desain → Undangan Jadi**. Tiap tonggak ini muncul di kalender sebagai item terpisah, bukan cuma satu deadline besar — supaya kapasitas desain per hari (§4.3 poin 2) bisa dihitung dari beban riil per tahap.
- Saat frontdesk input deadline baru, sistem beri warning jika kapasitas tanggal tersebut sudah penuh.
- Owner bisa atur ulang batas kapasitas (misal: musim ramai naikkan limit, musim sepi turunkan).
- **Reminder/pengingat**: cukup ditampilkan di **dashboard** (tidak perlu integrasi WhatsApp/email — sesuai keputusan, supaya tidak menambah kompleksitas & biaya integrasi). Reminder bisa ditaruh terpisah dari deadline produksi (misal: reminder H-3 follow up client, reminder H-1 sebelum deadline cetak).

### 4.4 Modul Request Desain (Project Brief Terstruktur)

**Alur yang diinginkan:**

1. **Halaman utama** → daftar project yang sudah ada + tombol **"+ Project Baru"**.
2. **Form data awal** (sama untuk semua jenis): Nama client, No HP, Jenis undangan, Jumlah pcs, Tanggal acara, Deadline, Catatan tambahan.
3. Setelah jenis undangan dipilih → sistem menampilkan **form dinamis** sesuai jenis produk tersebut.
   - Contoh: *Amplop cetak dalam + isi soft lipat* → field yang muncul: Amplop Depan (font, background, ornamen), Amplop Belakang, Isi Lipat 1, Isi Lipat 2, dst — masing-masing dengan sub-field font/background/ornamen.
4. Setiap sub-field (font, background, ornamen, dll) punya **kotak upload foto referensi**.
   - Klik kotak → langsung buka kamera device (mobile-first, pakai `<input type="file" capture="environment">` atau akses kamera browser) → foto langsung otomatis masuk ke kotak tersebut, tanpa perlu pilih dari galeri dulu.
5. Setelah semua field & foto terisi → project tersimpan dan **langsung terlihat oleh desainer** dengan format yang rapi dan konsisten (bukan lagi catatan tulisan bebas).
6. **(Fase Lanjutan)** Tombol "Generate Preview AI" → sistem mengirim semua foto referensi + keterangan (font/background/ornamen) ke AI image generation → menghasilkan gambar preview kombinasi (amplop depan, belakang, isi, dst) supaya client dan desainer punya gambaran visual awal sebelum desain manual dikerjakan.

**Catatan penting soal builder form dinamis:**
Supaya tidak perlu coding ulang tiap kali ada jenis undangan baru, sebaiknya dibuat sistem **template builder**: Owner/Admin bisa mendefinisikan "Jenis Produk X punya field apa saja" dari UI (bukan hardcode), sehingga menambah jenis undangan baru di masa depan tidak butuh developer.

**Template field per jenis produk (hasil breakdown, 8 template):**

| # | Template | Field (tiap field = font, background, ornamen + foto referensi) | Produk yang Memakai |
|---|---|---|---|
| 1 | Amplop + Isi Single | Amplop Depan, Amplop Belakang, Dalam Amplop, Isi Depan, Isi Belakang | Mini Amplop & Hard, Amplop & Single Hard, Amplop & Single Hard Cutting, Medium Amplop & Hard, Medium Amplop & Hard Cutting, Mini Amplop & Single Soft, Amplop & Single Soft, Amplop & Cutting Single Soft, Rustic J Hard, Rustic I Soft, Rustic K Soft |
| 2 | Amplop + Isi Lipat | Amplop Depan, Amplop Belakang, Dalam Amplop, Isi Depan Tengah, Isi Depan Kanan/Kiri (pas lipatan), Isi Dalam/Belakang Tengah, Isi Dalam/Belakang Kanan, Isi Dalam/Belakang Kiri | Amplop & Hard Lipat, Amplop & Hard Lipat Kancing, Amplop & Soft Lipat |
| 3 | Lipat Semi Amplop | Depan, Belakang Tutup, Belakang Bawah, Dalam Atas, Dalam Tengah, Dalam Bawah | Hard Lipat*, Soft Cover Lipat* |
| 4 | Lipat 3 | Depan Tengah, Belakang Kanan/Kiri (pas lipatan), Dalam Tengah, Dalam Kanan, Dalam Kiri | Hard Lipat*, Hard Lipat & Emblem Kancing, Soft Cover Lipat*, Mini Soft Cover Lipat |
| 5 | Passport | Buku Depan, Buku Belakang, Halaman 1, Halaman 2, Halaman 3, Halaman 4, Halaman 5, Halaman 6, Tiket Depan, Tiket Belakang | Passport Hard & Tiket, Buku Passport & Tiket |
| 6 | Origami | Depan (Tengah, Atas, Bawah, Kanan, Kiri), Belakang (Tengah, Atas, Bawah, Kanan, Kiri) | Origami Soft Lipat |
| 7 | Kalender | Sabuk, Depan, Isi, Denah, Bulan | Kalender Soft |
| 8 | 1 Lembar | Depan, Belakang | Rustic F01, Rustic F02, Rustic Hard 01, Rustic Hard 02 |

**\*Catatan — produk dengan 2 kemungkinan gaya lipat (dikonfirmasi):** *Hard Lipat* dan *Soft Cover Lipat* memang masing-masing punya 2 gaya lipatan berbeda (Lipat Semi Amplop dan Lipat 3) untuk produk fisik yang sama. Artinya, saat frontdesk membuat project baru dengan salah satu dari 2 produk ini, sistem harus menampilkan **satu pertanyaan tambahan: "Pilih gaya lipatan"** sebelum menampilkan form field yang sesuai (Template 3 atau Template 4). Ini satu-satunya kasus di mana 1 produk perlu 2 kemungkinan template.

Dua mekanisme tambahan supaya template ini efisien dipakai sehari-hari:

- **Pengaturan Umum (default) di atas form**: satu set font/background/ornamen utama yang otomatis mengisi semua field di bawahnya. Frontdesk cukup override manual pada field yang memang beda (misal isi belakang pakai font berbeda). Tanpa ini, tiap field harus diisi ulang satu-satu meski isinya sering sama.
- **Auto-append field dari add-on yang dibeli**: field tidak hanya berasal dari template dasar produk, tapi juga otomatis bertambah sesuai add-on yang dipilih di Kalkulator (§4.2). Misal jika client beli Wax Seal, Hot Print, Denah Pisah, Buku Tamu, atau Kertas Tekstur, sistem otomatis menambahkan field foto referensi terpisah untuk tiap item tersebut (misal "Motif Wax Seal", "Motif Hot Print"), supaya desainer dapat brief lengkap termasuk elemen tambahan yang sudah dibayar, tidak cuma bagian utama undangan.

**Kebijakan revisi:** Batas "revisi 3x" pada alur pemesanan (§5) hanya berupa **patokan/acuan**, bukan dikunci sistem. Sistem tetap menghitung dan menampilkan jumlah revisi yang sudah berjalan (untuk transparansi ke Owner), tapi tidak memblokir revisi ke-4 dst — keputusan lanjut/tidaknya tetap di tangan Owner/Frontdesk.

## 5. Alur Kerja End-to-End (Gambaran Besar)

```
Client datang/kontak
        ↓
Frontdesk cek Kalender (kapasitas tanggal masih ada?)
        ↓
Buat skenario harga di Kalkulator (bisa >1 opsi)
        ↓
Client pilih → convert jadi Invoice (DP)
        ↓
Buat Project Baru → isi Form Brief Desain sesuai jenis undangan
        ↓
Upload foto referensi (kamera langsung) tiap elemen
        ↓
(Opsional) Generate preview AI → tunjukkan ke client
        ↓
Project masuk antrian Desainer (sesuai kapasitas desain/hari)
        ↓
Desainer kerjakan sesuai brief terstruktur
        ↓
Reminder deadline aktif sampai selesai
        ↓
Pelunasan → Invoice Lunas → Project selesai
```

## 6. Kebutuhan Data (Gambaran Model, bukan final schema)

- **Client**: nama, alamat, no HP, riwayat order
- **PricelistItem**: nama, kategori (Hard/Soft/Special/Add-on), ukuran, bahan, mode harga (per-pcs tiered / paket flat), daftar free item bawaan
- **PriceTier**: terkait ke PricelistItem, rentang qty (min–max), harga/pcs atau harga paket
- **SuratOrder (Invoice)**: no order, client, list item+qty+harga+subtotal, list tambahan, total, DP1 (nominal), DP2 (%), status pelunasan, 4 tonggak tanggal (desain awal/revisi/ACC/jadi), catatan, status keseluruhan
- **CapacitySlot**: tanggal, tipe (client/desain), limit, terpakai
- **Reminder**: judul, tanggal/waktu, terkait project/order mana, status (tampil di dashboard)
- **ProductTemplate**: nama jenis undangan, daftar field dinamis (nama field, tipe: teks/pilihan/upload foto)
- **Project**: data client, jenis undangan, terhubung ke SuratOrder, deadline per tahap, status, isi field sesuai template + foto per field
- **DesignAsset** (fase AI): foto referensi per field, hasil generate AI (jika ada), biaya generate yang dibebankan ke client (jika fitur charge-per-generate diaktifkan)

## 7. Kebutuhan Non-Fungsional

- **Mobile-friendly** — akses kamera & isi form kemungkinan besar dilakukan dari HP di lapangan/toko.
- **Multi-user dengan role** (Owner, Frontdesk, Desainer) — hak akses berbeda.
- **Kecepatan input** — form brief jangan terlalu panjang/ribet, karena akan sering diisi berulang.
- Data tersimpan aman (backup), terutama data invoice & harga.

### Rekomendasi Tech Stack

Dokumen ini akan diserahkan ke AI coding assistant (Cursor/Trae) untuk implementasi. Stack yang sudah diputuskan:

- **Database & Backend**: **Supabase** (Postgres). Cocok karena:
  - Fitur bawaan **Supabase Storage** langsung pas untuk kebutuhan upload foto referensi via kamera (§4.4) — tidak perlu setup storage terpisah.
  - Fitur bawaan **Supabase Auth** cukup untuk kebutuhan role sederhana (Owner/Frontdesk/Desainer, total ~5–6 akun — lihat §3), tidak perlu sistem auth custom.
  - Row Level Security (RLS) Supabase bisa dipakai langsung untuk membatasi siapa boleh ubah pricelist vs siapa cuma boleh pakai (§4.1).
- **Frontend & Hosting**: **Vercel**. Konsekuensinya, framework yang paling natural dipakai adalah **Next.js** (App Router), karena Vercel adalah platform native Next.js — deploy tinggal push ke repo tanpa konfigurasi tambahan.
- **Struktur data** di §6 (Kebutuhan Data) sudah cukup dekat dengan bentuk tabel Postgres/Supabase — bisa langsung dipetakan jadi tabel: `clients`, `pricelist_items`, `price_tiers`, `surat_orders`, `capacity_slots`, `reminders`, `product_templates`, `projects`, `design_assets`.
- **Catatan untuk AI coding assistant**: PRD ini berisi keputusan produk & alur bisnis, bukan spesifikasi teknis final (skema tabel detail, nama kolom, dsb sebaiknya didesain saat implementasi mengikuti pola di §6). Fase pengerjaan disarankan mengikuti urutan roadmap di §8 (jangan langsung bikin semua modul sekaligus), supaya tiap fase bisa dites dulu sebelum lanjut ke fase berikutnya.

## 8. Rekomendasi Fase Pengembangan (Roadmap)

Karena scope ini besar, disarankan dibangun bertahap, bukan sekaligus:

**Fase 1 — Fondasi (MVP)**
- Modul Pricelist (CRUD harga)
- Modul Kalkulator + Invoice Maker (termasuk perbandingan harga & export PDF)

**Fase 2 — Manajemen Waktu**
- Kalender kapasitas (client/tanggal & desain/hari)
- Reminder dasar (tampil di dashboard)

**Fase 3 — Brief Desain Terstruktur**
- Halaman project + tombol tambah project
- Template builder (form dinamis per jenis undangan)
- Upload foto via kamera langsung

**Fase 4 — AI Preview Generator**
- Integrasi AI image generation dari foto referensi + keterangan
- Preview gabungan (amplop depan/belakang/isi, dst)
- **Mekanisme biaya dibebankan ke client**: setiap klik "Generate Preview AI" akan mengurangi saldo/kredit yang sudah dibayar client, atau client bayar dulu sebelum tombol generate aktif (mirip beli kredit/token). Ini perlu keputusan lebih lanjut soal:
  - Berapa harga jual ke client per generate (harus di atas biaya API supaya untung, bukan cuma menutup biaya)
  - Apakah dibayar terpisah dari DP1/DP2, atau digabung sebagai satu baris "Biaya AI Preview" di Surat Order
  - Batas jumlah generate gratis (jika ada) sebelum mulai berbayar
  - Ini menambah kompleksitas (perlu sistem kredit/saldo + pembayaran granular), jadi disarankan divalidasi dulu ke beberapa client di Fase 3 sebelum dikembangkan penuh di Fase 4.

*Alasan AI diletakkan di fase terakhir: fitur ini paling kompleks secara teknis (butuh API AI image gen, biaya per generate, dan kualitas hasil perlu banyak trial), sementara Fase 1–3 sudah memberi dampak besar ke masalah utama (harga tidak jelas & brief tidak jelas) tanpa risiko teknis tinggi.*

## 9. Keputusan yang Sudah Diambil & Sisa Pertanyaan

| # | Topik | Keputusan |
|---|---|---|
| 1 | Reminder | Cukup notifikasi di **dashboard**, tidak perlu integrasi WhatsApp/email. |
| 2 | Jumlah user | 3 Frontdesk, 2 Desainer (+ Owner). Total ~5–6 akun. |
| 3 | Offline/PWA | Nice-to-have, **bukan prioritas** — dikerjakan hanya jika tidak menambah kompleksitas signifikan. Ditunda ke fase belakangan, dievaluasi ulang setelah Fase 1–3 selesai. |
| 4 | Biaya AI (Fase 4) | Dibebankan ke client per generate (bukan ditanggung bisnis). Skema detail (harga jual, batas gratis, cara bayar) masih perlu dirancang — lihat §8 Fase 4. |
| 5 | Integrasi pembayaran otomatis | **Kondisional**: dikerjakan kalau mudah diimplementasikan (misal via payment gateway yang sudah ada API-nya), dilewati kalau ternyata rumit. Bukan blocker untuk fase manapun — pencatatan manual (status Lunas/Belum diklik manual oleh frontdesk) tetap jadi fallback yang valid. |

Sisa hal yang perlu dilengkapi sebelum development Fase 3 dimulai:
- Semua 8 template sudah lengkap dipetakan ke seluruh produk pricelist, termasuk Template Kalender (§4.4) — tidak ada lagi field yang menyusul.
- Mekanisme "pilih gaya lipatan" untuk Hard Lipat & Soft Cover Lipat (dua kemungkinan template per produk) perlu dipastikan tampil sebagai pertanyaan terpisah di form pembuatan project, bukan field biasa.
- Kebijakan revisi sudah diputuskan: 3x hanya patokan, tidak dikunci sistem (lihat §4.4).

---

*Dokumen versi 0.3 ini sudah lengkap: pricelist tiered, format Surat Order, 8 template desain terpetakan ke seluruh produk, dan rekomendasi tech stack (Supabase + Vercel/Next.js) di §7. Siap dijadikan acuan untuk AI coding assistant (Cursor/Trae) mengimplementasikan sesuai urutan roadmap di §8, dimulai dari Fase 1.*