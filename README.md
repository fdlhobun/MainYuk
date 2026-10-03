# MainYuk - Cari Slot Badminton PB

Web untuk mencari dan mengisi slot kosong main badminton di jadwal PB. Pemain memilih jadwal, mengisi nama dan nomor HP, lalu langsung terhubung ke admin PB lewat WhatsApp. Admin PB bisa mengelola jadwal dan pendaftarnya dari dashboard sederhana.

## Tautan

| | Link |
|---|---|
| Live demo (GitHub Pages) | https://fdlhobun.github.io/MainYuk/ |
| Desain Figma (View) | https://www.figma.com/design/9RajTHAiuMlBNqaNSu4CYR/MainYuk---Badminton-Slot-Booking |
| Prototype Figma | https://www.figma.com/proto/9RajTHAiuMlBNqaNSu4CYR/MainYuk---Badminton-Slot-Booking?node-id=1-26&p=f&t=F6FZMOz3zl5im5In-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1 |
| Repository | https://github.com/fdlhobun/MainYuk |

## Fungsi Web

Banyak PB punya slot kosong di jadwal main rutinnya, tetapi sulit diketahui orang luar. MainYuk mempertemukan keduanya: PB menampilkan jadwal beserta sisa slot dan biayanya (contoh: bola Rp3.000, lapangan Rp10.000), dan pemain tinggal mendaftar tanpa chat berulang-ulang.

## Fitur Utama

**Untuk pemain**
- Daftar jadwal berbentuk kartu: PB, lokasi, hari dan jam, harga bola dan lapangan, progress bar slot, dan badge status (Tersedia, Hampir penuh, Penuh).
- Filter berdasarkan hari, pencarian nama PB atau lokasi, dan pengurutan (slot terbanyak, harga termurah, nama A-Z).
- Form join dengan validasi (nama, nomor HP, jumlah slot) dan estimasi biaya otomatis.
- Halaman konfirmasi dengan tombol **Hubungi Admin via WhatsApp** (pesan sudah terisi otomatis).

**Fitur tambahan (kreatif)**
- **Penanda waktu otomatis:** badge "Malam ini", "Besok", "Mulai 2 jam lagi", atau "Sedang berlangsung" yang dihitung dari hari dan jam saat ini.
- **Daftar tunggu:** jika slot penuh, pemain tetap bisa mengantre. Saat admin menghapus peserta, antrean naik otomatis.
- **Data tersimpan** di `localStorage`, sehingga tidak hilang saat halaman di refresh.
- **Mode gelap** dengan satu tombol .

**Untuk admin PB**
- Login dengan memilih PB dan memasukkan PIN (simulasi).
- Ringkasan: jadwal aktif, total pendaftar, slot terisi, perkiraan pemasukan.
- Tambah dan hapus jadwal, lihat pendaftar per jadwal, tandai lunas, hubungi pemain lewat WhatsApp, hapus pendaftar.

## Struktur Folder

```
MainYuk/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## Cara Menjalankan

**Online:** buka https://fdlhobun.github.io/MainYuk/

## Akun Demo Admin

Klik menu **Admin**, pilih PB, lalu masukkan PIN:

| PB | PIN |
|---|---|
| PB Garuda | 1111 |
| PB Smash Banjar | 2222 |
| PB Raket Borneo | 3333 |
| PB Shuttle Kalsel | 4444 |
| PB Rajawali | 5555 |
| PB Antasari | 6666 |

Untuk mencoba **daftar tunggu**: daftar di PB Rajawali (slot penuh), lalu login admin PB Rajawali (PIN 5555) dan hapus satu peserta. Pemain yang antre akan naik otomatis.

## Catatan dan Keterbatasan

- Web ini tidak memakai backend. Data disimpan di `localStorage` browser masing-masing, jadi pendaftaran dari satu perangkat tidak terlihat di perangkat lain. Pendaftaran yang sebenarnya diteruskan ke admin lewat WhatsApp.
- Login admin hanya simulasi (PIN tersimpan di kode) dan bukan sistem keamanan sungguhan.
- Untuk mengembalikan data ke contoh awal: buka DevTools (F12), tab Application, Local Storage, hapus kunci `mainyuk-data-v1`, lalu refresh.
