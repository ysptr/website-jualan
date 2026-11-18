// Latar malam di kanvas: bintang berkelip, kunang-kunang yang menyingkir dari jari/kursor, sesekali bintang jatuh.
// Berhenti saat tab tidak dilihat, saat tombol "Jeda gerakan" aktif, atau saat HP diatur "kurangi gerakan".
(() => {
  const c = document.getElementById("langit");
  const ctx = c && c.getContext("2d");
  if (!ctx) return;
  const html = document.documentElement;
  const kurang = matchMedia("(prefers-reduced-motion: reduce)");
  const kursor = { x: -999, y: -999 };
  let w = 0, h = 0, bintang = [], kunang = [], jatuh = null, jatuhLagi = performance.now() + 4000, t0 = performance.now(), jalan = false;

  // cahaya kunang-kunang dibuat sekali, lalu tinggal ditempel (ringan untuk HP)
  const cahaya = document.createElement("canvas");
  cahaya.width = cahaya.height = 64;
  {
    const g = cahaya.getContext("2d"), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, "rgba(250,255,190,1)");
    r.addColorStop(0.16, "rgba(230,243,106,.9)");
    r.addColorStop(0.45, "rgba(230,243,106,.22)");
    r.addColorStop(1, "rgba(230,243,106,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 64, 64);
  }

  function ukur() {
    const lebarLama = w, dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // di HP, bilah alamat yang muncul/hilang hanya mengubah tinggi: jangan acak ulang bintang
    if (Math.abs(w - lebarLama) > 40) {
      bintang = Array.from({ length: Math.round((w * h) / 6500) }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.1 + 0.3, f: Math.random() * 6.28, s: 0.5 + Math.random() * 1.5,
      }));
      kunang = Array.from({ length: w < 700 ? 10 : 18 }, () => ({
        x: Math.random() * w, y: h * 0.3 + Math.random() * h * 0.7, vx: 0, vy: 0, a: Math.random() * 6.28, f: Math.random() * 6.28, u: 9 + Math.random() * 11,
      }));
    }
    gambar(performance.now());
  }

  function gambar(now) {
    const dt = Math.min(now - t0, 50) / 1000, s = now / 1000;
    t0 = now;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fbf3e0";
    for (const b of bintang) {
      ctx.globalAlpha = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(s * b.s + b.f));
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, 6.283);
      ctx.fill();
    }
    for (const k of kunang) {
      k.a += (Math.random() - 0.5) * 2 * dt; // berkelana pelan ke arah acak
      let ax = Math.cos(k.a) * 16, ay = Math.sin(k.a) * 16;
      const dx = k.x - kursor.x, dy = k.y - kursor.y, d2 = dx * dx + dy * dy;
      if (d2 < 150 * 150) { // terlalu dekat jari/kursor: menyingkir
        const d = Math.sqrt(d2) || 1, dorong = (1 - d / 150) * 520;
        ax += (dx / d) * dorong; ay += (dy / d) * dorong;
      }
      k.vx = (k.vx + ax * dt) * 0.965; k.vy = (k.vy + ay * dt) * 0.965;
      k.x += k.vx * dt * 3; k.y += k.vy * dt * 3;
      if (k.x < -30) k.x = w + 30; else if (k.x > w + 30) k.x = -30;
      if (k.y < -30) k.y = h + 30; else if (k.y > h + 30) k.y = -30;
      ctx.globalAlpha = 0.2 + 0.8 * Math.max(0, Math.sin(s * 1.2 + k.f)) ** 2;
      ctx.drawImage(cahaya, k.x - k.u, k.y - k.u, k.u * 2, k.u * 2);
    }
    if (!jatuh && now > jatuhLagi) jatuh = { x: w * (0.35 + Math.random() * 0.65), y: h * Math.random() * 0.3, t: 0 };
    if (jatuh) {
      jatuh.t += dt;
      const p = jatuh.t / 0.9;
      if (p >= 1) { jatuh = null; jatuhLagi = now + 6000 + Math.random() * 8000; }
      else {
        const hx = jatuh.x - 620 * jatuh.t, hy = jatuh.y + 260 * jatuh.t, g = ctx.createLinearGradient(hx, hy, hx + 150, hy - 63);
        g.addColorStop(0, "rgba(251,243,224,.95)");
        g.addColorStop(1, "rgba(251,243,224,0)");
        ctx.globalAlpha = Math.sin(p * Math.PI);
        ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 150, hy - 63); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  const boleh = () => !kurang.matches && !html.classList.contains("diam") && !document.hidden;
  function putar(now) {
    if (!boleh()) { jalan = false; return; } // berhenti, gambar terakhir tetap tampil
    gambar(now);
    requestAnimationFrame(putar);
  }
  function mulai() {
    if (jalan || !boleh()) return;
    jalan = true; t0 = performance.now();
    requestAnimationFrame(putar);
  }
  const ikut = (e) => { kursor.x = e.clientX; kursor.y = e.clientY; };
  addEventListener("pointermove", ikut, { passive: true });
  addEventListener("pointerdown", ikut, { passive: true });
  html.addEventListener("pointerleave", () => { kursor.x = kursor.y = -999; });
  addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") kursor.x = kursor.y = -999; });
  addEventListener("resize", ukur);
  document.addEventListener("visibilitychange", mulai);
  new MutationObserver(mulai).observe(html, { attributes: true, attributeFilter: ["class"] });
  kurang.addEventListener?.("change", mulai);
  ukur();
  mulai();
})();
