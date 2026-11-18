// Katalog toko: data dari data/produk.js → saring kategori, cari, panel detail (#p/<slug>), beli via Lynk.id.
const T = window.TOKO || {};
const P = window.PRODUK || [];
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const rupiah = (n) => (n > 0 ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n) : "Gratis");
const gambar = (p) => (p.gambar ? `<img src="${esc(p.gambar)}" alt="" loading="lazy">` : `<span class="inisial" aria-hidden="true">${esc(p.judul.replace(/^Contoh:\s*/, "").charAt(0))}</span>`);
const PANAH = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>`;
const CENTANG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="m5 12.5 4.5 4.5L19 7.5"/></svg>`;

/* ---------- jeda gerakan (disimpan di browser pengunjung) ---------- */
const html = document.documentElement;
function aturJeda(diam) {
  html.classList.toggle("diam", diam);
  $("#jeda").setAttribute("aria-pressed", String(diam));
  try { localStorage.setItem("diam", diam ? "1" : ""); } catch {}
}
try { aturJeda(localStorage.getItem("diam") === "1"); } catch {}
$("#jeda").addEventListener("click", () => aturJeda(!html.classList.contains("diam")));

/* ---------- isi toko ---------- */
document.title = T.nama || "Toko";
document.querySelectorAll("[data-toko]").forEach((el) => (el.textContent = T[el.dataset.toko] || ""));
$("#logo-tanda").textContent = (T.nama || "").trim().charAt(0);
$("#tahun").textContent = new Date().getFullYear();
if (T.lynk) Object.assign($("#atas-lynk"), { href: T.lynk, hidden: false });
// Link WA dengan pesan sudah terisi, supaya pembeli tinggal tekan kirim.
const wa = (pesan) => T.whatsapp && "https://wa.me/" + T.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(pesan);
const waUmum = wa(`Halo ${T.nama || ""}, saya mau tanya-tanya dulu soal produknya.`);
if (waUmum) Object.assign($("#wa-kartu"), { href: waUmum, hidden: false });
const KONTAK = [
  ["WhatsApp", waUmum],
  ["Instagram", T.instagram], ["TikTok", T.tiktok], ["Lynk.id", T.lynk],
  ["Email", T.email && "mailto:" + T.email],
].filter(([, url]) => url);
$("#kontak").innerHTML = KONTAK.map(([n, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener">${n}</a>`).join("");

/* ---------- katalog ---------- */
let kategori = "Semua", kata = "";
const DAFTAR_KAT = ["Semua", ...new Set(P.map((p) => p.kategori).filter(Boolean))];
$("#kategori").innerHTML = DAFTAR_KAT.map((k) => `<button type="button" data-kat="${esc(k)}" aria-pressed="${k === kategori}">${esc(k)}</button>`).join("");
$("#kategori").addEventListener("click", (e) => {
  const b = e.target.closest("[data-kat]"); if (!b) return;
  kategori = b.dataset.kat;
  document.querySelectorAll("#kategori button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  tampilkan();
});
$("#cari").addEventListener("input", (e) => { kata = e.target.value.trim().toLowerCase().replace(/-/g, ""); tampilkan(); });
$("#reset").addEventListener("click", () => { $("#cari").value = ""; kata = ""; $('#kategori [data-kat="Semua"]').click(); });
addEventListener("keydown", (e) => {
  if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName) && !$("#detail").open) { e.preventDefault(); $("#cari").focus(); }
});

function cocok(p) {
  const teks = [p.judul, p.kategori, p.ringkas, ...(p.fitur || [])].join(" ").toLowerCase().replace(/-/g, ""); // "ebook" cocok dengan "E-book"
  return (kategori === "Semua" || p.kategori === kategori) && (!kata || teks.includes(kata));
}
function tampilkan() {
  const hasil = P.filter(cocok);
  // animasi masuk hanya saat halaman pertama dimuat, tidak setiap kali mengetik di kolom cari
  const naik = (i) => (tampilkan.sudah ? "" : ` class="naik" style="--i:${6 + i}"`);
  $("#daftar").innerHTML = hasil.map((p, i) => `
    <li${naik(i)}><button type="button" class="kartu" data-slug="${esc(p.slug)}">
      <span class="k-gambar">${gambar(p)}</span>
      <span class="k-isi">
        <span class="k-judul">${esc(p.judul)}</span>
        <span class="k-kategori">${esc(p.kategori)}</span>
      </span>
      <span class="k-harga${p.harga > 0 ? "" : " gratis"}">${rupiah(p.harga)}</span>
      <span class="k-panah">${PANAH}</span>
    </button></li>`).join("");
  tampilkan.sudah = true;
  $("#jumlah").textContent = hasil.length;
  $("#kosong").hidden = hasil.length > 0;
}
const bukaKartu = (e) => { const b = e.target.closest("[data-slug]"); if (b) location.hash = "p/" + b.dataset.slug; };
$("#daftar").addEventListener("click", bukaKartu);
tampilkan();

/* ---------- produk unggulan: produk pertama yang punya unggulan: true ---------- */
const U = P.find((p) => p.unggulan);
if (U) {
  $("#unggulan").innerHTML = `
    <div class="u-atas">
      <div class="u-media">${gambar(U)}</div>
      <div>
        <p class="u-kategori">${esc(U.kategori)}</p>
        <h3 class="u-judul">${esc(U.judul)}</h3>
      </div>
    </div>
    <p class="u-ringkas">${esc(U.ringkas)}</p>
    <ul class="u-fitur">${(U.fitur || []).map((f, j) => `<li style="--j:${j}">${CENTANG}<span>${esc(f)}</span></li>`).join("")}</ul>
    <div class="u-bawah">
      <p class="u-harga">${U.harga > 0 ? "<small>Harga</small>" : ""}${rupiah(U.harga)}</p>
      <button type="button" class="tombol tinta" data-slug="${esc(U.slug)}">${U.harga > 0 ? "Lihat &amp; beli" : "Lihat &amp; unduh"} ${PANAH}</button>
    </div>`;
  $("#unggulan").addEventListener("click", bukaKartu);
  $("#unggulan-blok").hidden = false;
}

/* ---------- detail ---------- */
const d = $("#detail");
function buka(slug) {
  const p = P.find((x) => x.slug === slug); if (!p) return;
  $("#d-gambar").innerHTML = gambar(p);
  $("#d-kategori").textContent = p.kategori || "";
  $("#d-judul").textContent = p.judul;
  $("#d-harga").textContent = rupiah(p.harga);
  $("#d-ringkas").textContent = p.ringkas || "";
  $("#d-fitur").innerHTML = (p.fitur || []).map((f) => `<li>${esc(f)}</li>`).join("");
  const butuh = p.butuh || [];
  $("#d-butuh-blok").hidden = !butuh.length;
  $("#d-butuh").innerHTML = butuh.map((b) => `<li>${esc(b)}</li>`).join("");

  aktif = p;
  const url = p.harga > 0 ? p.lynk : p.unduh || p.lynk;
  const beli = $("#d-beli");
  beli.textContent = url ? (p.harga > 0 ? "Beli di Lynk.id" : "Unduh gratis") : "Link belum diisi";
  if (url) beli.href = url; else beli.removeAttribute("href");
  // Syarat wajib: tombol beli terkunci sampai dicentang (mengurangi pembeli salah beli lalu minta refund).
  $("#d-setuju").hidden = !(url && p.syarat);
  $("#d-setuju").classList.remove("ingatkan");
  $("#d-setuju-cek").checked = false;
  $("#d-setuju-teks").textContent = p.syarat || "";
  aturBeli();
  $("#d-catatan").hidden = !(url && p.harga > 0);
  const tanya = wa(`Halo ${T.nama || ""}, saya mau tanya soal "${p.judul}".`);
  $("#d-wa").hidden = !tanya;
  if (tanya) $("#d-wa").href = tanya;
  if (!d.open) d.showModal();
}
let aktif = null;
function aturBeli() {
  const terkunci = !$("#d-beli").href || (aktif?.syarat && !$("#d-setuju-cek").checked);
  $("#d-beli").setAttribute("aria-disabled", String(Boolean(terkunci)));
}
$("#d-setuju-cek").addEventListener("change", () => { aturBeli(); if ($("#d-setuju-cek").checked) $("#d-setuju").classList.remove("ingatkan"); });
$("#d-beli").addEventListener("click", (e) => {
  if ($("#d-beli").getAttribute("aria-disabled") !== "true") return;
  e.preventDefault();
  if (!$("#d-setuju").hidden) { $("#d-setuju").classList.add("ingatkan"); $("#d-setuju-cek").focus(); }
});
function dariHash() {
  const m = location.hash.match(/^#p\/(.+)$/);
  if (m) buka(decodeURIComponent(m[1])); else if (d.open) d.close();
}
d.addEventListener("close", () => { if (location.hash.startsWith("#p/")) history.replaceState(null, "", location.pathname + location.search + "#katalog"); });
d.addEventListener("click", (e) => { if (e.target === d) d.close(); }); // klik di luar panel
addEventListener("hashchange", dariHash);
dariHash();

function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("tampil"); clearTimeout(toast.w); toast.w = setTimeout(() => el.classList.remove("tampil"), 2000); }
$("#d-bagikan").addEventListener("click", async () => {
  const url = location.href;
  if (navigator.share) { try { await navigator.share({ title: $("#d-judul").textContent, url }); } catch {} return; }
  try { await navigator.clipboard.writeText(url); toast("Link produk tersalin."); } catch { toast("Salin link dari kolom alamat browser."); }
});
