# 🤖 AI Coding Agent Guidelines

Dokumen ini berisi standar kerja & aturan wajib bagi AI Agent di repository ini.

---

## 1. Project Context & Environment
- **Project Type:** Static Website — Ucapan Selamat Ulang Tahun interaktif untuk **Caca**.
- **Teknologi:** HTML/CSS/JS murni (vanilla), tanpa build tools, tanpa framework, tanpa backend.
- **Hosting:** GitHub Pages via repository GitHub (**tanpa VPS / server sendiri**).
- Gunakan environment variables atau mekanisme serupa untuk data sensitif. Jangan pernah simpan kredensial/API keys langsung di dalam kode.
- Semua fitur harus tetap berfungsi secara offline tanpa dependensi eksternal (tanpa CDN).

---

## 2. Code Quality & Security
- Tulis kode yang modular, mudah dibaca, dan aman dari kerentanan umum (XSS).
- Sebelum menyelesaikan tugas, pastikan kode telah divalidasi: uji dengan membuka `index.html` di browser dan pastikan Console DevTools bebas dari error sintaks JS.
- Komentar kode dalam Bahasa Indonesia, hanya bila diperlukan.

---

## 3. Git Workflow & Mandatory CI/CD Trigger (WAJIB)
1. **Granular Commit:** Lakukan `git commit` untuk setiap 1 tugas/fitur kecil yang selesai dikerjakan. Gunakan format konvensi pesan commit (contoh: `feat: ...` atau `fix: ...`).
2. **Auto Push:** Setelah komit berhasil dan dipastikan bebas error, kamu **WAJIB** menjalankan perintah:
   ```
   git push origin main
   ```

   > ⚠️ **Catatan Penting:** Perintah `git push` ini adalah pemicu (*trigger*) deployment otomatis GitHub Pages agar perubahan langsung tayang ke publik.

---

## 4. Restrictions (Yang Dilarang)
- ❌ Dilarang melakukan `git push` jika kodingan masih bermasalah/error.
- ❌ Dilarang menjalankan perintah terminal berskala destruktif (`rm -rf`, `Remove-Item -Recurse -Force`, `DROP DATABASE`, dll) tanpa persetujuan.
- ❌ Dilarang mengubah struktur folder utama aplikasi tanpa instruksi spesifik.

---

## 5. Spesifikasi Proyek

### Deskripsi
Website ucapan selamat ulang tahun pribadi untuk **Caca**, lengkap dengan animasi confetti dan musik yang diputar otomatis saat halaman dibuka.

### Struktur File
```
index.html        — halaman utama
css/style.css     — styling & animasi CSS
js/music.js       — melodi "Selamat Ulang Tahun" via Web Audio API
js/confetti.js    — animasi confetti vanilla canvas
assets/           — (opsional) gambar/audio tambahan
```

### Fitur Wajib
1. **Musik:** Melodi "Selamat Ulang Tahun" disintesis langsung via Web Audio API (tanpa file MP3).
   - Coba autoplay saat halaman dibuka → jika diblokir browser, mulai pada interaksi pertama (klik/tap).
   - Tombol toggle 🔊/🔇 selalu tersedia di layar.
2. **Confetti:** Ledakan besar saat halaman dimuat + hujan confetti perlahan terus-menerus, warna mengikuti palet tema.
3. **Balon dekoratif** mengambang naik (CSS).
4. **Responsif** untuk HP maupun desktop.

### Palet Warna (serasi, tidak boleh bertabrakan)
| Warna      | Hex      | Fungsi                    |
|------------|----------|---------------------------|
| Ungu muda  | `#a18cd1` | Latar gradien awal        |
| Pink lembut | `#fbc2eb` | Latar gradien tengah     |
| Peach      | `#ffe0d1` | Latar gradien akhir      |
| Emas       | `#f6d365` | Aksen judul & confetti   |
| Putih      | `#ffffff` | Teks utama (dengan shadow) |

### Cara Menjalankan
- Buka `index.html` langsung di browser, atau
- Gunakan Live Server (VS Code), atau
- `python -m http.server` lalu akses `http://localhost:8000`
