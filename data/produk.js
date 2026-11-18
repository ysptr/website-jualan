/* Semua isi toko ada di berkas ini. Ganti teks di dalam tanda kutip, simpan, lalu muat ulang halaman.
   Kosongkan ("") bagian yang tidak dipakai, nanti otomatis disembunyikan. */
window.TOKO = {
  nama: "Nama Tokomu",
  slogan: "Produk digital siap pakai untuk usahamu.",
  keterangan: "Bayar aman lewat Lynk.id, file langsung dikirim ke email kamu.",
  lynk: "",       // halaman utama Lynk.id, contoh: https://lynk.id/namakamu
  whatsapp: "",   // nomor WA dengan kode negara tanpa +, contoh: 6281234567890
  instagram: "",  // contoh: https://www.instagram.com/namakamu
  tiktok: "",     // contoh: https://www.tiktok.com/@namakamu
  email: "",
  refundHari: 7,  // batas hari pengajuan uang kembali, tampil di halaman Pengembalian Dana
  diperbarui: "18 November 2026", // tanggal terakhir halaman legal diubah
};

/* Satu produk = satu blok { ... }. harga: angka rupiah tanpa titik, 0 = gratis.
   lynk: link halaman produk di Lynk.id (untuk produk berbayar).
   unduh: link unduhan langsung (untuk produk gratis, misalnya Google Drive).
   gambar: nama berkas di folder gambar/, contoh "gambar/cv-ats.webp". Boleh dikosongkan.
   butuh: daftar yang wajib dimiliki pembeli sebelum membeli (aplikasi, perangkat). Boleh dikosongkan [].
   syarat: kalimat yang wajib dicentang sebelum tombol Beli aktif. Kosongkan "" kalau tidak perlu.
   unggulan: true = tampil besar di kartu jingga "Produk unggulan" (pakai di satu produk saja). Boleh dihapus. */
window.PRODUK = [
  {
    slug: "contoh-template-cv",
    unggulan: true,
    judul: "Contoh: Template CV ATS",
    kategori: "Template",
    harga: 25000,
    ringkas: "Ini produk contoh. Ganti dengan produkmu di data/produk.js.",
    fitur: ["Format Word dan Google Docs", "Lolos sistem ATS", "Panduan isi singkat"],
    butuh: ["Microsoft Word 2016 ke atas, atau akun Google untuk Google Docs"],
    syarat: "Saya sudah punya Microsoft Word atau akun Google untuk membuka file ini.",
    gambar: "",
    lynk: "",
    unduh: "",
  },
  {
    slug: "contoh-ebook-jualan",
    judul: "Contoh: E-book Jualan di WhatsApp",
    kategori: "E-book",
    harga: 49000,
    ringkas: "Ini produk contoh. Ganti dengan produkmu di data/produk.js.",
    fitur: ["PDF 60 halaman", "Contoh pesan siap salin", "Bonus daftar balasan cepat"],
    butuh: ["Aplikasi pembaca PDF di HP atau laptop"],
    syarat: "",
    gambar: "",
    lynk: "",
    unduh: "",
  },
  {
    slug: "contoh-checklist-gratis",
    judul: "Contoh: Checklist Buka Usaha",
    kategori: "Gratis",
    harga: 0,
    ringkas: "Ini produk gratis contoh. Isi link unduhan di bagian unduh.",
    fitur: ["PDF 1 halaman", "Bisa dicetak"],
    butuh: [],
    syarat: "",
    gambar: "",
    lynk: "",
    unduh: "",
  },
];
