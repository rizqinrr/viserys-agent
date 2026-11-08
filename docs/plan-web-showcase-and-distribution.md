# Rencana Implementasi: Webview GitHub Pages & Distribusi Viserys

Dokumen perencanaan dan spesifikasi teknis untuk pembuatan situs showcase berbasis GitHub Pages dan sistem distribusi multi-channel Viserys.

---

## 1. Tujuan & Sasaran

1. **Visibilitas & Branding Profesional**: Menyediakan portal web interaktif di GitHub Pages (`https://rizqinrr.github.io/viserys-agent/`) yang menjelaskan filosofi, alur kerja, dan keunggulan Viserys bagi pengguna baru maupun calon pengguna.
2. **Distribusi Satu Perintah (Zero-Friction Distribution)**:
   - **Jalur Universal**: `npx skills add rizqinrr/viserys-agent` (didukung oleh ekosistem `skills.sh`).
   - **Jalur Dedicated CLI**: `npx viserys-agent` (instalasi interaktif dengan wizard terminal).
3. **Showcase Interaktif 3 Alur Inti**:
   - Mensimulasikan alur kerja 3 pilar:
     - `get-prd` → Menghasilkan `docs/PRD.md`
     - `get-tasks` → Menghasilkan `tasks/*.md`
     - `get-design` → Menghasilkan `docs/design.md`

---

## 2. Arsitektur & Struktur Direktori

Situs akan ditempatkan pada direktori `site/` dengan arsitektur web modern tanpa runtime build yang rumit (*zero build-step static site*) agar cepat dimuat, mudah dipelihara, dan bebas dari ketergantungan paket yang rentan kedaluwarsa.

```
viserys/
├── site/
│   ├── index.html            # Struktur markup landing page & interactive showcase
│   ├── styles.css            # Desain visual modern, dark-mode first, tipografi presisi, anti-slop
│   ├── app.js                # Interaktivitas: tab switcher, copy-to-clipboard, simulator dokumen
│   └── assets/               # Ikon SVG, favicon, dan diagram alur
├── bin/
│   └── cli.js                # CLI executable mandiri untuk `npx viserys-agent`
├── .github/
│   └── workflows/
│       └── deploy-pages.yml  # Otomatisasi deploy direktori site/ ke GitHub Pages
└── docs/
    └── plan-web-showcase-and-distribution.md
```

---

## 3. Desain & Fitur Webview (`site/`)

Webview dirancang dengan mematuhi prinsip **Anti-AI-Slop** dari skill `get-design`:
- **Tipografi Berbobot**: Kombinasi sans-serif geometris tajam untuk judul dan monospace berkarakter untuk kode perintah.
- **Hierarki Kontras Tinggi**: Dark background berbasis *deep obsidian* dengan aksen kontras yang fungsional (bukan gradien neon murahan).
- **Komponen Utama**:
  1. **Header & Navigation**: Brand Viserys, link GitHub, dokumentasi, dan badge versi (`v0.1.0`).
  2. **Hero Section**:
     - Headline: *"Engineering Discipline for AI Coding Agents"*.
     - Subheadline: *"Transform vague ideas into production-ready software through structured PRDs, vertical task slicing, and anti-slop design systems."*
     - Terminal Install Box: 1-klik copy command `npx skills add rizqinrr/viserys-agent` dengan visual feedback.
  3. **Interactive 3-Pillar Simulator**:
     - Pengguna dapat mengklik 3 tab alur:
       - **Tab 1 (`get-prd`)**: Menampilkan transkrip percakapan wawancara mendalam + live preview dokumen `PRD.md`.
       - **Tab 2 (`get-tasks`)**: Menampilkan diagram relasi dependensi task + live preview `plan.md` & `task-01.md`.
       - **Tab 3 (`get-design`)**: Menampilkan visual palette token, responsive breakdown, dan live preview `design.md`.
  4. **Agent Compatibility Matrix**:
     - Visual badge interaktif yang menampilkan dukungan native untuk Claude Code, Antigravity, OpenCode, Cursor, Gemini CLI, dan Codex.
  5. **Footer**: Lisensi Apache 2.0, kredit pengembang, dan link ke GitHub repository.

---

## 4. Sistem Distribusi Dedicated CLI (`bin/cli.js`)

Menambahkan script Node.js ringan yang dapat dieksekusi langsung via `npx`:

```javascript
#!/usr/bin/env node
// bin/cli.js
// Menyediakan wizard interaktif di terminal saat user mengetik: npx viserys-agent
```

### Kemampuan CLI:
1. Menampilkan banner ASCII Viserys.
2. Memindai environment proyek lokal untuk mendeteksi agent yang aktif.
3. Menanyakan pilihan cakupan instalasi:
   - `Project scope` (disalin ke `.agents/skills/` atau direktori agent terkait).
   - `Global scope` (disalin ke konfigurasi pengguna).
4. Menyediakan perintah `update` untuk menyinkronkan skill dari GitHub ke versi terbaru.

---

## 5. Workflow Otomatisasi GitHub Pages (`.github/workflows/deploy-pages.yml`)

Workflow GitHub Actions standar menggunakan tindakan resmi GitHub (`actions/deploy-pages`):
- Memicu otomatis setiap ada `push` ke branch `main` yang mengubah direktori `site/**`.
- Membangun dan menerbitkan artefak statis langsung ke GitHub Pages tanpa konfigurasi manual server.

---

## 6. Validasi & Kompatibilitas Repositori

Penambahan `site/`, `bin/cli.js`, dan file workflow tidak boleh merusak validator internal Viserys:
- `validate-skills.js`: Tetap memvalidasi 3 skill di `skills/`.
- `validate-commands.js`: Tetap memvalidasi konsistensi command.
- `validate-personas.js`: Memastikan kontrak persona tetap utuh.
- `validate-artifact-paths.js`: Memastikan referensi artefak pipeline (`tasks/<name>/plan.md`) tetap konsisten.
- `run-evals.js`: Mempertahankan tingkat trigger rank-1 100%.
- Unit tests (`scripts/*-test.js`): Seluruh 62 test tetap berstatus **PASSED**.

---

## 7. Rencana Tahapan Eksekusi

- [ ] **Langkah 1**: Bangun antarmuka web statis di `site/` (`index.html`, `styles.css`, `app.js`).
- [ ] **Langkah 2**: Siapkan GitHub Actions workflow di `.github/workflows/deploy-pages.yml`.
- [ ] **Langkah 3**: Siapkan script CLI mandiri di `bin/cli.js` dan daftarkan ke `package.json`.
- [ ] **Langkah 4**: Uji coba lokal dan verifikasi seluruh test suite (`node --test ...` dan validator).
- [ ] **Langkah 5**: Tawarkan commit & push ke GitHub agar GitHub Pages langsung aktif.

