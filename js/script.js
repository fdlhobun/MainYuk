"use strict";
/* KONSTANTA DAN DATA AWAL*/

// Kunci penyimpanan di localStorage / sessionStorage
const KUNCI_DATA = "mainyuk-data-v1";
const KUNCI_TEMA = "mainyuk-tema";
const KUNCI_ADMIN = "mainyuk-admin";

const NAMA_HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MAKS_SLOT_PER_DAFTAR = 4;

const daftarPb = [
  { nama: "PB Garuda",         pin: "1111", wa: "6281234500001" },
  { nama: "PB Smash Banjar",   pin: "2222", wa: "6281234500002" },
  { nama: "PB Raket Borneo",   pin: "3333", wa: "6281234500003" },
  { nama: "PB Shuttle Kalsel", pin: "4444", wa: "6281234500004" },
  { nama: "PB Rajawali",       pin: "5555", wa: "6281234500005" },
  { nama: "PB Antasari",       pin: "6666", wa: "6281234500006" }
];

let idTerakhir = 0;
const buatId = () => ++idTerakhir;

/**
 * Membuat objek peserta.
 * @param {string} nama - nama pemain
 * @param {string} hp - nomor HP (format 62...)
 * @param {number} jumlah - jumlah slot yang diambil
 * @param {boolean} sudahBayar - status pembayaran
 * @returns {Object} objek peserta
 */
const buatPeserta = (nama, hp, jumlah, sudahBayar = false) => ({
  id: buatId(), nama, hp, jumlah, sudahBayar
});

/**
 * Membuat data awal 
 * Struktur: Array of Objects, tiap jadwal punya array peserta dan array tunggu.
 * @returns {Object[]} daftar jadwal
 */
function buatDataAwal() {
  const wa = (namaPb) => daftarPb.find((p) => p.nama === namaPb).wa;
  return [
    {
      id: buatId(), pb: "PB Garuda", lokasi: "GOR Banjarbaru", hari: "Sabtu", jam: "19.00 - 22.00",
      hargaBola: 3000, hargaLapangan: 10000, totalSlot: 16, adminWa: wa("PB Garuda"),
      peserta: [], tunggu: []
    },
    {
      id: buatId(), pb: "PB Smash Banjar", lokasi: "GOR Lambung Mangkurat", hari: "Sabtu", jam: "20.00 - 23.00",
      hargaBola: 4000, hargaLapangan: 12000, totalSlot: 16, adminWa: wa("PB Smash Banjar"),
      peserta: [
        buatPeserta("Budi", "6281234567890", 2, true),
        buatPeserta("Rina", "6285712341122", 1),
        buatPeserta("Andi", "6281398764455", 3, true),
        buatPeserta("Dewi", "6282155509900", 1)
      ],
      tunggu: []
    },
    {
      id: buatId(), pb: "PB Raket Borneo", lokasi: "GOR Cempaka", hari: "Jumat", jam: "19.30 - 22.30",
      hargaBola: 3000, hargaLapangan: 10000, totalSlot: 16, adminWa: wa("PB Raket Borneo"),
      peserta: [
        buatPeserta("Eko", "6281211110001", 5, true),
        buatPeserta("Fajar", "6281211110002", 4),
        buatPeserta("Gita", "6281211110003", 4)
      ],
      tunggu: []
    },
    {
      id: buatId(), pb: "PB Shuttle Kalsel", lokasi: "GOR Hasanuddin", hari: "Minggu", jam: "16.00 - 19.00",
      hargaBola: 3500, hargaLapangan: 8000, totalSlot: 20, adminWa: wa("PB Shuttle Kalsel"),
      peserta: [
        buatPeserta("Maya", "6281211110004", 4, true),
        buatPeserta("Nanda", "6281211110005", 4)
      ],
      tunggu: []
    },
    {
      id: buatId(), pb: "PB Rajawali", lokasi: "GOR Banjarbaru", hari: "Sabtu", jam: "21.00 - 24.00",
      hargaBola: 3000, hargaLapangan: 10000, totalSlot: 16, adminWa: wa("PB Rajawali"),
      peserta: [
        buatPeserta("Hadi", "6281211110006", 4, true),
        buatPeserta("Ira", "6281211110007", 4, true),
        buatPeserta("Joko", "6281211110008", 4),
        buatPeserta("Kiki", "6281211110009", 4)
      ],
      tunggu: [buatPeserta("Lina", "6281211110010", 2)]
    },
    {
      id: buatId(), pb: "PB Antasari", lokasi: "GOR Pelaihari", hari: "Rabu", jam: "19.00 - 22.00",
      hargaBola: 3000, hargaLapangan: 9000, totalSlot: 12, adminWa: wa("PB Antasari"),
      peserta: [
        buatPeserta("Oki", "6281211110011", 3, true),
        buatPeserta("Putri", "6281211110012", 3)
      ],
      tunggu: []
    }
  ];
}

/* STATE APLIKASI DAN PENYIMPANAN */

/**
 * Memuat data dari localStorage. Jika belum ada (atau rusak),
 * pakai data awal. Sekaligus menyetel idTerakhir agar id baru tidak bentrok.
 * @returns {Object[]} daftar jadwal
 */
function muatData() {
  try {
    const tersimpan = localStorage.getItem(KUNCI_DATA);
    if (tersimpan) {
      const data = JSON.parse(tersimpan);
      for (const j of data) {
        idTerakhir = Math.max(idTerakhir, j.id);
        for (const p of [...j.peserta, ...j.tunggu]) {
          idTerakhir = Math.max(idTerakhir, p.id);
        }
      }
      return data;
    }
  } catch (err) {
    console.warn("Data tersimpan tidak bisa dibaca, memakai data awal.", err);
  }
  return buatDataAwal();
}

/** Menyimpan seluruh data jadwal ke localStorage agar tidak hilang saat refresh. */
function simpanData() {
  try {
    localStorage.setItem(KUNCI_DATA, JSON.stringify(dataJadwal));
  } catch (err) {
    console.warn("Gagal menyimpan data.", err);
  }
}

let dataJadwal = muatData();

// State sementara: jadwal yang sedang dibuka dan sesi admin
const state = {
  jadwalDipilihId: null,                       // jadwal di halaman detail
  adminPb: sessionStorage.getItem(KUNCI_ADMIN), // nama PB yang sedang login
  adminJadwalId: null                          // jadwal yang dipilih di dashboard
};

/*FUNGSI BANTU*/
// Pintasan pencarian elemen
const $ = (selektor, induk = document) => induk.querySelector(selektor);
const $$ = (selektor, induk = document) => [...induk.querySelectorAll(selektor)];

/**
 * Membuat elemen HTML baru dengan kelas dan teks.
 * @param {string} tag - nama tag
 * @param {string} [kelas] - nama kelas CSS
 * @param {string} [teks] - isi teks
 * @returns {HTMLElement}
 */
function buatEl(tag, kelas = "", teks = "") {
  const elemen = document.createElement(tag);
  if (kelas) elemen.className = kelas;
  if (teks) elemen.textContent = teks;
  return elemen;
}

/** Mengubah angka menjadi format rupiah, contoh: 3000 -> "Rp3.000". */
const formatRupiah = (angka) => "Rp" + angka.toLocaleString("id-ID");

/** Mencari satu jadwal berdasarkan id. */
const cariJadwal = (id) => dataJadwal.find((j) => j.id === id);

/** Menghitung total slot yang sudah terisi */
function hitungTerisi(jadwal) {
  let total = 0;
  for (const p of jadwal.peserta) {
    total += p.jumlah;
  }
  return total;
}

/** Menghitung sisa slot. */
const hitungSisa = (jadwal) => jadwal.totalSlot - hitungTerisi(jadwal);

/**
 * Menentukan status slot untuk warna badge dan progress bar.
 * @returns {"tersedia"|"hampir"|"penuh"}
 */
function statusSlot(jadwal) {
  const sisa = hitungSisa(jadwal);
  if (sisa <= 0) return "penuh";
  if (sisa <= 4) return "hampir";
  return "tersedia";
}

/** Biaya per orang = biaya lapangan + harga bola. */
const biayaPerOrang = (jadwal) => jadwal.hargaLapangan + jadwal.hargaBola;

/*Mengubah nomor HP ke format internasional tanpa tanda plus.*/
function normalisasiHp(hp) {
  let digit = hp.replace(/\D/g, "");
  if (digit.startsWith("0")) digit = "62" + digit.slice(1);
  return digit;
}

/** Nomor HP valid total 10 sampai 13 digit. */
function hpValid(hp) {
  const bersih = hp.replace(/[\s-]/g, "");
  return /^(08\d{8,11}|628\d{8,11})$/.test(bersih);
}

/** Membuat link WhatsApp dengan pesan yang sudah terisi. */
const buatLinkWa = (nomor, pesan) =>
  "https://wa.me/" + nomor + "?text=" + encodeURIComponent(pesan);

/** Menampilkan pesan error di bawah input dan memberi garis merah. */
function setError(input, pesan) {
  const penanda = document.getElementById("error-" + input.id.split("-")[1]);
  input.classList.add("invalid");
  if (penanda) penanda.textContent = pesan;
}

/** Menghapus pesan error dan garis merah dari input. */
function hapusError(input) {
  const penanda = document.getElementById("error-" + input.id.split("-")[1]);
  input.classList.remove("invalid");
  if (penanda) penanda.textContent = "";
}

/** Mengatur teks dan warna badge sesuai status slot. */
function aturBadge(elBadge, status) {
  const label = { tersedia: "Tersedia", hampir: "Hampir penuh", penuh: "Penuh" };
  const kelasTambahan = { tersedia: "", hampir: " badge-hampir", penuh: " badge-penuh" };
  elBadge.className = "badge" + kelasTambahan[status];
  elBadge.textContent = label[status];
}

/** Mengatur lebar dan warna progress bar. */
function aturProgress(elFill, jadwal) {
  const persen = Math.round((hitungTerisi(jadwal) / jadwal.totalSlot) * 100);
  const status = statusSlot(jadwal);
  elFill.style.width = persen + "%";
  elFill.className = "progress-fill" + (status === "hampir" ? " fill-hampir" : status === "penuh" ? " fill-penuh" : "");
  const pembungkus = elFill.parentElement;
  if (pembungkus) pembungkus.setAttribute("aria-valuenow", persen);
}

/** Teks sisa slot */
function teksSisa(jadwal) {
  const sisa = hitungSisa(jadwal);
  if (sisa > 0) return `Sisa ${sisa} dari ${jadwal.totalSlot} slot`;
  const antre = jadwal.tunggu.length;
  return `Slot penuh (${jadwal.totalSlot}/${jadwal.totalSlot})` + (antre > 0 ? ` | ${antre} orang antre` : "");
}

/* PENANDA WAKTU OTOMATIS*/

/**
 * Memecah teks jam "20.00 - 23.00" menjadi menit sejak tengah malam.
 * @returns {{mulai:number, selesai:number}|null} null jika format salah
 */
function parseJam(teksJam) {
  const cocok = teksJam.match(/(\d{1,2})[.:](\d{2})\s*-\s*(\d{1,2})[.:](\d{2})/);
  if (!cocok) return null;
  return {
    mulai: Number(cocok[1]) * 60 + Number(cocok[2]),
    selesai: Number(cocok[3]) * 60 + Number(cocok[4])
  };
}

/**
 * Menghasilkan label waktu untuk sebuah jadwal.
 * @param {Object} jadwal - data jadwal
 * @param {Date} [sekarang] - waktu acuan (default: waktu saat ini)
 * @returns {{teks:string, tipe:string}|null}
 */
function infoWaktu(jadwal, sekarang = new Date()) {
  const jam = parseJam(jadwal.jam);
  if (!jam) return null;

  const menitSekarang = sekarang.getHours() * 60 + sekarang.getMinutes();
  let selisihHari = (NAMA_HARI.indexOf(jadwal.hari) - sekarang.getDay() + 7) % 7;

  // Jadwal hari ini: cek sedang berlangsung atau sudah lewat
  if (selisihHari === 0) {
    if (menitSekarang >= jam.mulai && menitSekarang < jam.selesai) {
      return { teks: "Sedang berlangsung", tipe: "hampir" };
    }
    if (menitSekarang >= jam.selesai) selisihHari = 7;
  }

  if (selisihHari === 0) {
    const selisihMenit = jam.mulai - menitSekarang;
    if (selisihMenit < 60) return { teks: `Mulai ${selisihMenit} menit lagi`, tipe: "hampir" };
    if (selisihMenit <= 180) return { teks: `Mulai ${Math.ceil(selisihMenit / 60)} jam lagi`, tipe: "hampir" };
    return { teks: jam.mulai >= 17 * 60 ? "Malam ini" : "Hari ini", tipe: "tersedia" };
  }
  if (selisihHari === 1) return { teks: "Besok", tipe: "tersedia" };
  if (selisihHari === 7) return { teks: "Minggu depan", tipe: "tersedia" };
  return { teks: `${selisihHari} hari lagi`, tipe: "tersedia" };
}

/* NAVIGASI ANTAR TAMPILAN */

/**
 * Menampilkan satu tampilan dan menyembunyikan yang lain.
 * @param {string} nama - beranda | detail | konfirmasi | admin-login | admin
 */
function tampilkanView(nama) {
  // Dashboard admin hanya boleh dibuka setelah login
  if (nama === "admin" && !state.adminPb) nama = "admin-login";

  for (const view of $$(".view")) {
    view.hidden = view.id !== "view-" + nama;
  }
  window.scrollTo({ top: 0 });

  if (nama === "beranda") renderJadwal();
  if (nama === "admin") renderAdmin();
}

/**
 * Satu pendengar klik untuk semua elemen ber-atribut data-view
 * (event delegation), termasuk tautan yang menuju bagian di Beranda.
 */
document.addEventListener("click", (e) => {
  const pemicu = e.target.closest("[data-view]");
  if (!pemicu) return;
  e.preventDefault();

  let tujuan = pemicu.dataset.view;
  if (tujuan === "admin-login" && state.adminPb) tujuan = "admin";
  tampilkanView(tujuan);

  // Untuk tautan seperti #cara-main
  const href = pemicu.getAttribute("href");
  if (href && href.length > 1) {
    const sasaran = document.querySelector(href);
    if (sasaran) sasaran.scrollIntoView({ behavior: "smooth" });
  }
});

/* BERANDA RENDER KARTU, FILTER, URUTKAN */

// Fungsi pembanding untuk tiap pilihan urutan
const pembandingUrut = {
  slot: (a, b) => hitungSisa(b) - hitungSisa(a),
  murah: (a, b) => biayaPerOrang(a) - biayaPerOrang(b),
  nama: (a, b) => a.pb.localeCompare(b.pb, "id")
};

/**
 * Mengambil jadwal yang sesuai filter hari dan kata pencarian,
 * lalu mengurutkannya sesuai pilihan.
 * @returns {Object[]} daftar jadwal hasil filter
 */
function ambilJadwalTersaring() {
  const hari = $("#filter-hari").value;
  const kata = $("#filter-cari").value.trim().toLowerCase();
  const urut = $("#filter-urut").value;

  return dataJadwal
    .filter((j) => hari === "semua" || j.hari === hari)
    .filter((j) => (j.pb + " " + j.lokasi).toLowerCase().includes(kata))
    .sort(pembandingUrut[urut]);
}

/** Menggambar ulang semua kartu jadwal di Beranda. */
function renderJadwal() {
  const wadah = $("#daftar-jadwal");
  const hasil = ambilJadwalTersaring();
  wadah.innerHTML = "";

  for (const jadwal of hasil) {
    wadah.appendChild(buatKartu(jadwal));
  }

  $("#jumlah-jadwal").textContent = `${hasil.length} jadwal ditemukan`;
  $("#jadwal-kosong").hidden = hasil.length > 0;
}

/**
 * Membuat satu kartu jadwal dari <template>.
 * @param {Object} jadwal - data jadwal
 * @returns {DocumentFragment} kartu siap ditempel ke halaman
 */
function buatKartu(jadwal) {
  const kartu = $("#tpl-kartu").content.cloneNode(true);
  const status = statusSlot(jadwal);

  $(".jadwal-pb", kartu).textContent = jadwal.pb;
  $(".jadwal-lokasi", kartu).textContent = jadwal.lokasi;
  $(".harga-bola", kartu).textContent = formatRupiah(jadwal.hargaBola);
  $(".harga-lapangan", kartu).textContent = formatRupiah(jadwal.hargaLapangan);
  $(".jadwal-sisa", kartu).textContent = teksSisa(jadwal);
  aturBadge($(".badge", kartu), status);
  aturProgress($(".progress-fill", kartu), jadwal);

  // Teks hari dan jam + penanda waktu otomatis
  const elWaktu = $(".jadwal-waktu", kartu);
  elWaktu.textContent = `${jadwal.hari}  |  ${jadwal.jam}`;
  const waktu = infoWaktu(jadwal);
  if (waktu) {
    const penanda = buatEl("span", "badge badge-waktu" + (waktu.tipe === "hampir" ? " badge-hampir" : ""), waktu.teks);
    elWaktu.appendChild(penanda);
  }

  // Tombol: Join biasa, atau gabung daftar tunggu bila slot penuh
  const tombol = $(".btn-join", kartu);
  if (status === "penuh") {
    tombol.textContent = "Gabung Daftar Tunggu";
    tombol.classList.replace("btn-primary", "btn-outline");
  }
  tombol.addEventListener("click", () => bukaDetail(jadwal.id));

  return kartu;
}

// Filter berjalan otomatis saat pengguna mengetik atau mengganti pilihan
for (const idKontrol of ["filter-hari", "filter-cari", "filter-urut"]) {
  $("#" + idKontrol).addEventListener("input", renderJadwal);
}
$("#form-filter").addEventListener("submit", (e) => {
  e.preventDefault();
  renderJadwal();
});

/* DETAIL JADWAL DAN FORM JOIN (+ DAFTAR TUNGGU) */

const formJoin = $("#form-join");
const inputNama = $("#join-nama");
const inputHp = $("#join-hp");
const inputJumlah = $("#join-jumlah");

/**
 * Membuka halaman detail untuk satu jadwal dan mengisi semua datanya.
 * @param {number} id - id jadwal
 */
function bukaDetail(id) {
  state.jadwalDipilihId = id;
  formJoin.reset();
  for (const input of [inputNama, inputHp, inputJumlah]) hapusError(input);
  renderDetail();
  tampilkanView("detail");
}

/** Mengisi ulang isi halaman detail dari data jadwal yang dipilih. */
function renderDetail() {
  const j = cariJadwal(state.jadwalDipilihId);
  const penuh = hitungSisa(j) <= 0;

  $("#detail-pb").textContent = j.pb;
  aturBadge($("#detail-badge"), statusSlot(j));
  $("#detail-lokasi").textContent = j.lokasi;
  $("#detail-hari").textContent = j.hari;
  $("#detail-jam").textContent = j.jam;
  $("#detail-bola").textContent = formatRupiah(j.hargaBola) + " / bola";
  $("#detail-lapangan").textContent = formatRupiah(j.hargaLapangan) + " / orang";
  $("#detail-sisa").textContent = teksSisa(j);
  aturProgress($("#detail-progress"), j);

  // Judul form dan tombol menyesuaikan: daftar biasa atau daftar tunggu
  $("#judul-form").textContent = penuh ? "Daftar Tunggu" : "Daftar Main";
  $("#form-join button[type='submit']").textContent = penuh ? "Masuk Daftar Tunggu" : "Daftar Sekarang";
  inputJumlah.max = penuh ? MAKS_SLOT_PER_DAFTAR : Math.min(hitungSisa(j), MAKS_SLOT_PER_DAFTAR);

  renderPesertaDetail(j);
  perbaruiEstimasi();
}

/** Menggambar daftar peserta dan antrean di halaman detail. */
function renderPesertaDetail(j) {
  const daftar = $("#detail-peserta");
  daftar.innerHTML = "";

  for (const p of j.peserta) {
    const baris = buatEl("li", "list-item");
    baris.appendChild(buatEl("span", "", p.nama));
    baris.appendChild(buatEl("span", "muted small", p.jumlah + " slot"));
    daftar.appendChild(baris);
  }
  for (const p of j.tunggu) {
    const baris = buatEl("li", "list-item");
    baris.appendChild(buatEl("span", "", p.nama));
    baris.appendChild(buatEl("span", "badge badge-hampir", `Antre (${p.jumlah} slot)`));
    daftar.appendChild(baris);
  }

  $("#peserta-kosong").hidden = j.peserta.length + j.tunggu.length > 0;
}

/** Menghitung estimasi biaya (biaya per orang x jumlah slot) saat jumlah diubah. */
function perbaruiEstimasi() {
  const j = cariJadwal(state.jadwalDipilihId);
  const jumlah = Number(inputJumlah.value);
  const valid = Number.isInteger(jumlah) && jumlah > 0;
  $("#join-estimasi").textContent = formatRupiah(valid ? biayaPerOrang(j) * jumlah : 0);
}
inputJumlah.addEventListener("input", perbaruiEstimasi);

/**
 * Memeriksa semua isian form join.
 * @returns {{valid:boolean, nama:string, hp:string, jumlah:number}}
 */
function validasiJoin(jadwal) {
  const nama = inputNama.value.trim();
  const jumlah = Number(inputJumlah.value);
  const sisa = hitungSisa(jadwal);
  const hp = normalisasiHp(inputHp.value);
  let valid = true;

  // Bersihkan error lama dulu
  for (const input of [inputNama, inputHp, inputJumlah]) hapusError(input);

  // Nama minimal 3 huruf
  if (nama.length < 3) {
    setError(inputNama, "Nama wajib diisi, minimal 3 huruf.");
    valid = false;
  }

  // Nomor HP: format benar dan belum terdaftar di jadwal ini
  if (!hpValid(inputHp.value)) {
    setError(inputHp, "Nomor HP minimal 10 digit dan diawali 08.");
    valid = false;
  } else if ([...jadwal.peserta, ...jadwal.tunggu].some((p) => p.hp === hp)) {
    setError(inputHp, "Nomor ini sudah terdaftar di jadwal ini.");
    valid = false;
  }

  // Jumlah slot: bilangan bulat, tidak melebihi batas atau sisa slot
  if (!Number.isInteger(jumlah) || jumlah < 1) {
    setError(inputJumlah, "Jumlah slot minimal 1.");
    valid = false;
  } else if (jumlah > MAKS_SLOT_PER_DAFTAR) {
    setError(inputJumlah, `Maksimal ${MAKS_SLOT_PER_DAFTAR} slot sekali daftar.`);
    valid = false;
  } else if (sisa > 0 && jumlah > sisa) {
    setError(inputJumlah, `Sisa slot hanya ${sisa}.`);
    valid = false;
  }

  return { valid, nama, hp, jumlah };
}

/** Memproses pengiriman form join: masuk peserta atau daftar tunggu. */
formJoin.addEventListener("submit", (e) => {
  e.preventDefault();
  const jadwal = cariJadwal(state.jadwalDipilihId);
  const hasil = validasiJoin(jadwal);
  if (!hasil.valid) return;

  const orang = buatPeserta(hasil.nama, hasil.hp, hasil.jumlah);
  const antre = hitungSisa(jadwal) <= 0;

  // Percabangan: slot masih ada -> peserta, slot penuh -> daftar tunggu
  if (antre) {
    jadwal.tunggu.push(orang);
  } else {
    jadwal.peserta.push(orang);
  }

  simpanData();
  tampilkanKonfirmasi(jadwal, orang, antre);
});

/*KONFIRMASI DAN LINK WHATSAPP*/

/**
 * Mengisi halaman konfirmasi dan membuat link WhatsApp ke admin PB.
 * @param {Object} jadwal - jadwal yang didaftari
 * @param {Object} orang - data pendaftar
 * @param {boolean} antre - true jika masuk daftar tunggu
 */
function tampilkanKonfirmasi(jadwal, orang, antre) {
  const total = biayaPerOrang(jadwal) * orang.jumlah;

  $("#judul-konfirmasi").textContent = antre ? "Kamu Masuk Daftar Tunggu" : "Pendaftaran Berhasil!";
  $("#konfirmasi-pesan").textContent = antre
    ? `Kamu akan naik otomatis jika ada slot kosong di ${jadwal.pb}. Hubungi admin untuk info lebih lanjut.`
    : `Admin ${jadwal.pb} akan menghubungi kamu lewat WhatsApp untuk konfirmasi.`;

  $("#konf-nama").textContent = orang.nama;
  $("#konf-jadwal").textContent = `${jadwal.hari}, ${jadwal.jam}`;
  $("#konf-lokasi").textContent = jadwal.lokasi;
  $("#konf-jumlah").textContent = orang.jumlah + " slot";
  $("#konf-total").textContent = formatRupiah(total);

  const pesan = `Halo admin ${jadwal.pb}, saya ${orang.nama} (${orang.hp}) ` +
    `${antre ? "mau masuk daftar tunggu" : "sudah daftar"} main ${jadwal.hari} ${jadwal.jam} ` +
    `di ${jadwal.lokasi} untuk ${orang.jumlah} slot. Total ${formatRupiah(total)}.`;
  $("#konf-wa").href = buatLinkWa(jadwal.adminWa, pesan);

  tampilkanView("konfirmasi");
}

/* ADMIN: LOGIN, DASHBOARD, KELOLA JADWAL DAN PENDAFTAR */

const formLogin = $("#form-login");
const formJadwal = $("#form-jadwal");

/** Mengisi pilihan PB di form login dari array daftarPb. */
function isiPilihanPb() {
  const pilihan = $("#login-pb");
  for (const pb of daftarPb) {
    const opsi = buatEl("option", "", pb.nama);
    opsi.value = pb.nama;
    pilihan.appendChild(opsi);
  }
}

/** Memeriksa PIN. Jika cocok, simpan sesi dan buka dashboard. */
formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const pb = daftarPb.find((p) => p.nama === $("#login-pb").value);
  const pin = $("#login-pin").value.trim();
  const penandaError = $("#error-login");

  if (pin === pb.pin) {
    state.adminPb = pb.nama;
    state.adminJadwalId = null;
    sessionStorage.setItem(KUNCI_ADMIN, pb.nama);
    $("#jadwal-wa").value = pb.wa;
    penandaError.textContent = "";
    formLogin.reset();
    tampilkanView("admin");
    tampilkanToast("Selamat datang, admin " + pb.nama + "!");
  } else {
    penandaError.textContent = pin === "" ? "PIN wajib diisi." : "PIN salah. Coba lagi.";
  }
});

/** Keluar dari akun admin dan kembali ke Beranda. */
$("#btn-keluar").addEventListener("click", () => {
  state.adminPb = null;
  state.adminJadwalId = null;
  sessionStorage.removeItem(KUNCI_ADMIN);
  tampilkanView("beranda");
  tampilkanToast("Kamu sudah keluar.");
});

/** Mengambil jadwal milik PB yang sedang login. */
const jadwalAdmin = () => dataJadwal.filter((j) => j.pb === state.adminPb);

/** Menggambar ulang seluruh dashboard admin. */
function renderAdmin() {
  const milikku = jadwalAdmin();
  const pb = daftarPb.find((p) => p.nama === state.adminPb);

  $("#admin-judul").textContent = state.adminPb;
  $("#jadwal-pb").value = state.adminPb;
  if (!$("#jadwal-wa").value) $("#jadwal-wa").value = pb.wa;

  // Pilih jadwal pertama jika belum ada yang dipilih
  if (!milikku.some((j) => j.id === state.adminJadwalId)) {
    state.adminJadwalId = milikku.length > 0 ? milikku[0].id : null;
  }

  renderStatistik(milikku);
  renderJadwalAdmin(milikku);
  renderPendaftarAdmin();
}

/** Menghitung dan menampilkan empat kotak ringkasan. */
function renderStatistik(milikku) {
  let pendaftar = 0, terisi = 0, kapasitas = 0, pemasukan = 0;

  for (const j of milikku) {
    pendaftar += j.peserta.length;
    terisi += hitungTerisi(j);
    kapasitas += j.totalSlot;
    pemasukan += hitungTerisi(j) * biayaPerOrang(j);
  }

  $("#stat-jadwal").textContent = milikku.length;
  $("#stat-pendaftar").textContent = pendaftar + " orang";
  $("#stat-slot").textContent = `${terisi} / ${kapasitas}`;
  $("#stat-pemasukan").textContent = formatRupiah(pemasukan);
}

/** Menggambar daftar "Jadwal Saya" beserta tombol Pendaftar dan Hapus. */
function renderJadwalAdmin(milikku) {
  const daftar = $("#admin-jadwal");
  daftar.innerHTML = "";
  $("#admin-jadwal-kosong").hidden = milikku.length > 0;

  for (const j of milikku) {
    const baris = buatEl("li", "list-item" + (j.id === state.adminJadwalId ? " aktif" : ""));

    const info = buatEl("div", "item-info");
    info.appendChild(buatEl("strong", "", `${j.hari}, ${j.jam}`));
    info.appendChild(buatEl("span", "muted small", `${j.lokasi} | ${teksSisa(j).toLowerCase()}`));

    const aksi = buatEl("div", "item-aksi");
    const badge = buatEl("span");
    aturBadge(badge, statusSlot(j));

    const tombolLihat = buatEl("button", "btn btn-outline btn-sm", "Pendaftar");
    tombolLihat.type = "button";
    tombolLihat.addEventListener("click", () => {
      state.adminJadwalId = j.id;
      renderAdmin();
    });

    const tombolHapus = buatEl("button", "btn btn-danger-outline btn-sm", "Hapus");
    tombolHapus.type = "button";
    tombolHapus.addEventListener("click", () => hapusJadwal(j.id));

    aksi.append(badge, tombolLihat, tombolHapus);
    baris.append(info, aksi);
    daftar.appendChild(baris);
  }
}

/** Menggambar daftar pendaftar (dan antrean) untuk jadwal yang dipilih. */
function renderPendaftarAdmin() {
  const j = cariJadwal(state.adminJadwalId);
  const daftar = $("#admin-pendaftar");
  daftar.innerHTML = "";

  if (!j) {
    $("#judul-admin-pendaftar").textContent = "Pendaftar";
    $("#admin-pendaftar-kosong").hidden = false;
    return;
  }

  $("#judul-admin-pendaftar").textContent = `Pendaftar - ${j.hari}, ${j.jam.split(" ")[0]}`;
  const semua = [
    ...j.peserta.map((p) => ({ orang: p, antre: false })),
    ...j.tunggu.map((p) => ({ orang: p, antre: true }))
  ];
  $("#admin-pendaftar-kosong").hidden = semua.length > 0;
  $("#admin-pendaftar-kosong").textContent = "Belum ada pendaftar untuk jadwal ini.";

  for (const { orang, antre } of semua) {
    const baris = buatEl("li", "list-item");

    const info = buatEl("div", "item-info");
    info.appendChild(buatEl("strong", "", `${orang.nama} (${orang.jumlah} slot)`));
    info.appendChild(buatEl("span", "muted small", "0" + orang.hp.slice(2)));

    const aksi = buatEl("div", "item-aksi");

    // Penanda: antre / sudah bayar / belum bayar
    if (antre) {
      aksi.appendChild(buatEl("span", "badge badge-hampir", "Antre"));
    } else {
      const statusBayar = buatEl("span", "badge" + (orang.sudahBayar ? "" : " badge-hampir"), orang.sudahBayar ? "Sudah bayar" : "Belum bayar");
      aksi.appendChild(statusBayar);

      const tombolBayar = buatEl("button", "btn btn-outline btn-sm", orang.sudahBayar ? "Batal lunas" : "Tandai lunas");
      tombolBayar.type = "button";
      tombolBayar.addEventListener("click", () => {
        orang.sudahBayar = !orang.sudahBayar;
        simpanData();
        renderAdmin();
      });
      aksi.appendChild(tombolBayar);
    }

    // Tombol hubungi: membuka WhatsApp ke pemain
    const tombolWa = buatEl("a", "btn btn-outline btn-sm", "Hubungi");
    tombolWa.target = "_blank";
    tombolWa.rel = "noopener";
    tombolWa.href = buatLinkWa(
      orang.hp,
      `Halo ${orang.nama}, ini admin ${j.pb}. Konfirmasi main ${j.hari} ${j.jam} di ${j.lokasi} (${orang.jumlah} slot, ${formatRupiah(biayaPerOrang(j) * orang.jumlah)}).`
    );

    const tombolHapus = buatEl("button", "btn btn-danger-outline btn-sm", "Hapus");
    tombolHapus.type = "button";
    tombolHapus.addEventListener("click", () => hapusPeserta(j.id, orang.id, antre));

    aksi.append(tombolWa, tombolHapus);
    baris.append(info, aksi);
    daftar.appendChild(baris);
  }
}

/**
 * Memindahkan antrean ke daftar peserta selama slot cukup (fitur daftar tunggu).
 * @param {Object} jadwal - jadwal yang slotnya baru dikosongkan
 * @returns {string[]} nama-nama yang berhasil naik
 */
function naikkanDaftarTunggu(jadwal) {
  const naik = [];
  while (jadwal.tunggu.length > 0 && jadwal.tunggu[0].jumlah <= hitungSisa(jadwal)) {
    const orang = jadwal.tunggu.shift();
    jadwal.peserta.push(orang);
    naik.push(orang.nama);
  }
  return naik;
}

/**
 * Menghapus pendaftar. Jika slot terbebas, antrean otomatis naik.
 * @param {number} idJadwal - id jadwal
 * @param {number} idPeserta - id peserta
 * @param {boolean} dariAntrean - true jika yang dihapus ada di daftar tunggu
 */
function hapusPeserta(idJadwal, idPeserta, dariAntrean) {
  const j = cariJadwal(idJadwal);
  const daftar = dariAntrean ? j.tunggu : j.peserta;
  const indeks = daftar.findIndex((p) => p.id === idPeserta);
  if (indeks === -1) return;

  const [dihapus] = daftar.splice(indeks, 1);
  let pesan = `${dihapus.nama} dihapus.`;

  if (!dariAntrean) {
    const naik = naikkanDaftarTunggu(j);
    if (naik.length > 0) pesan += ` ${naik.join(", ")} naik dari daftar tunggu.`;
  }

  simpanData();
  renderAdmin();
  tampilkanToast(pesan);
}

/** Menghapus satu jadwal setelah konfirmasi. */
function hapusJadwal(idJadwal) {
  const j = cariJadwal(idJadwal);
  if (!confirm(`Hapus jadwal ${j.hari}, ${j.jam}? Semua pendaftarnya ikut terhapus.`)) return;

  dataJadwal = dataJadwal.filter((item) => item.id !== idJadwal);
  simpanData();
  renderAdmin();
  tampilkanToast("Jadwal dihapus.");
}

/** Memeriksa isian form tambah jadwal. Mengembalikan objek jadwal baru atau null. */
function validasiJadwalBaru() {
  const lokasi = $("#jadwal-lokasi").value.trim();
  const jam = $("#jadwal-jam").value.trim();
  const bola = Number($("#jadwal-bola").value);
  const lapangan = Number($("#jadwal-lapangan").value);
  const slot = Number($("#jadwal-slot").value);
  const wa = normalisasiHp($("#jadwal-wa").value);
  const penanda = $("#error-jadwal");

  // Setiap pengecekan mengembalikan pesan khusus agar pengguna tahu apa yang salah
  if (lokasi.length < 3) return gagalJadwal("Lokasi wajib diisi.");
  if (!parseJam(jam)) return gagalJadwal("Jam harus berformat 20.00 - 23.00.");
  if ($("#jadwal-bola").value === "" || bola < 0) return gagalJadwal("Harga bola wajib diisi (boleh 0).");
  if ($("#jadwal-lapangan").value === "" || lapangan < 0) return gagalJadwal("Biaya lapangan wajib diisi (boleh 0).");
  if (!Number.isInteger(slot) || slot < 1) return gagalJadwal("Total slot minimal 1.");
  if (!hpValid($("#jadwal-wa").value)) return gagalJadwal("Nomor WhatsApp admin tidak valid.");

  penanda.textContent = "";
  return {
    id: buatId(), pb: state.adminPb, lokasi, hari: $("#jadwal-hari").value, jam,
    hargaBola: bola, hargaLapangan: lapangan, totalSlot: slot, adminWa: wa,
    peserta: [], tunggu: []
  };
}

/** Menampilkan pesan error form jadwal dan mengembalikan null. */
function gagalJadwal(pesan) {
  $("#error-jadwal").textContent = pesan;
  return null;
}

/** Menyimpan jadwal baru: langsung muncul di dashboard dan di Beranda. */
formJadwal.addEventListener("submit", (e) => {
  e.preventDefault();
  const baru = validasiJadwalBaru();
  if (!baru) return;

  dataJadwal.push(baru);
  state.adminJadwalId = baru.id;
  simpanData();

  for (const id of ["jadwal-lokasi", "jadwal-jam", "jadwal-bola", "jadwal-lapangan", "jadwal-slot"]) {
    $("#" + id).value = "";
  }
  renderAdmin();
  tampilkanToast("Jadwal baru tersimpan dan sudah tampil di Beranda.");
});

/*MODE GELAP DAN NOTIFIKASI */

let timerToast = null;

/**
 * Menampilkan pesan singkat di bagian bawah layar selama beberapa detik.
 * @param {string} pesan - isi notifikasi
 */
function tampilkanToast(pesan) {
  let toast = $("#toast");
  if (!toast) {
    toast = buatEl("div", "toast");
    toast.id = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = pesan;
  toast.classList.add("tampil");
  clearTimeout(timerToast);
  timerToast = setTimeout(() => toast.classList.remove("tampil"), 3500);
}

/** Menerapkan tema (terang/gelap) ke halaman dan memperbarui label tombol. */
function terapkanTema(tema) {
  document.documentElement.dataset.theme = tema;
  const tombol = $("#btn-tema");
  if (tombol) {
    tombol.textContent = tema === "dark" ? "Mode terang" : "Mode gelap";
    tombol.setAttribute("aria-pressed", String(tema === "dark"));
  }
}

/** Membuat tombol pengganti tema di navbar dan memulihkan pilihan terakhir. */
function siapkanTema() {
  const tombol = buatEl("button", "btn btn-outline btn-sm", "Mode gelap");
  tombol.type = "button";
  tombol.id = "btn-tema";
  tombol.addEventListener("click", () => {
    const baru = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    terapkanTema(baru);
    localStorage.setItem(KUNCI_TEMA, baru);
  });
  $(".navbar").appendChild(tombol);

  const tersimpan = localStorage.getItem(KUNCI_TEMA);
  const preferensiSistem = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  terapkanTema(tersimpan || preferensiSistem);
}

/* INISIALISASI */
isiPilihanPb();
siapkanTema();
tampilkanView("beranda");
