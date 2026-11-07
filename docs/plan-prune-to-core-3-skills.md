# Rencana Pemangkasan & Penyempurnaan 3 Skill Inti Viserys

Dokumen ini merinci rencana pemangkasan repositori Viserys dari 22 skill menjadi **3 skill inti**, serta peta jalan penyempurnaan kualitas ketiga skill tersebut sebelum rilis/publikasi.

---

## 1. Tujuan & Latar Belakang

- **Fokus Kualitas Tinggi**: Menjadikan Viserys sebagai paket workflow yang sangat tajam, teruji, dan bebas dari fitur berlebihan (*slop/bloat*).
- **Tiga Pilar Utama**:
  1. **`get-prd`** (Tahap DEFINE) — Menggali ide dan kebutuhan mentah pengguna menjadi dokumen spesifikasi/PRD standar industri melalui wawancara terstruktur mendalam.
  2. **`get-tasks`** (Tahap PLAN) — Memecah PRD menjadi unit-unit tugas yang atomik, memiliki dependensi jelas, dan langsung dapat dieksekusi oleh agen AI tanpa kebingungan konteks.
  3. **`get-design`** (Tahap DESIGN / BUILD) — Menyusun arsitektur antarmuka pengguna, tata letak, dan sistem desain yang berestetika tinggi, aksesibel, dan anti-AI-slop.

---

## 2. Ruang Lingkup

### A. Skill yang Dipertahankan (3 Core Skills)
1. `skills/get-prd/`
2. `skills/get-tasks/`
3. `skills/get-design/`

### B. Skill yang Dipangkas / Diarsipkan (19 Skills)
- `api-and-interface-design`
- `ci-cd-and-automation`
- `code-review-and-quality`
- `code-simplification`
- `constraint-driven-development`
- `debugging-and-error-recovery`
- `deprecation-and-migration`
- `documentation-and-adrs`
- `frontend-ui-engineering`
- `get-schema`
- `git-workflow-and-versioning`
- `idea-refine`
- `incremental-implementation`
- `observability-and-instrumentation`
- `performance-optimization`
- `security-and-hardening`
- `shipping-and-launch`
- `test-driven-development`
- `using-agent-skills`

---

## 3. Strategi Keamanan & Pencadangan (Safety First)

Sebelum file dihapus dari working tree, lakukan pencadangan utuh:
1. Buat git branch pencadangan:
   ```bash
   git branch archive/22-skills-baseline
   ```
   *Seluruh 22 skill, evaluator, dan kode lama tetap tersimpan aman di branch ini dan dapat diambil kembali kapan saja.*

---

## 4. Dampak Sistem & Penyesuaian Komponen

| Komponen | Penyesuaian yang Diperlukan |
|---|---|
| `skills/` | Menghapus 19 direktori skill non-inti; menyisakan 3 direktori. |
| `evals/cases/` & `evals/fixtures/` | Menghapus case & fixture milik 19 skill yang dipangkas agar `run-evals.js` tidak mencari file yang hilang. |
| Perintah Slash Commands | Menyesuaikan file perintah di `.claude/commands/`, `commands/` (TOML), dan `.gemini/commands/` agar selaras dengan 3 skill yang aktif. |
| Script Validator (`scripts/`) | Memperbarui validator (`validate-commands.js`, `validate-personas.js`, `validate-skills.js`) dan test-suit-nya agar mencerminkan kontrak baru. |
| Dokumentasi & Manifest | Memperbarui `README.md`, `AGENTS.md`, `docs/skills.md`, `docs/commands.md`, dan manifest plugin (`plugin.json`, `.opencode/`, `.claude-plugin/`, dll.). |

---

## 5. Peta Jalan Penyempurnaan 3 Skill Inti

Setelah repositori ramping:

### Phase 1: Penyempurnaan `get-prd`
- **Wawancara Adaptif**: Panduan agen untuk tidak terburu-buru menulis PRD; tanyakan asumsi kritis (skala pengguna, batas sistem, model data, prioritas non-fungsional).
- **Struktur Dokumen PRD**: Standarisasi format PRD (Problem Statement, User Personas, Core User Journeys, Functional Requirements, Non-Functional Requirements, Edge Cases, Out of Scope).
- **Verifikasi & Acceptance**: Checklist kualitas PRD agar tidak ada ruang abu-abu bagi agen perencana di tahap berikutnya.

### Phase 2: Penyempurnaan `get-tasks`
- **Dekomposisi Atomik**: Menghasilkan file tugas per task yang berdiri sendiri (*self-contained* context).
- **Dependency Graph**: Urutan eksekusi jelas, mencegah agen mengerjakan task B sebelum task A selesai.
- **Contract & Verification**: Setiap task harus memiliki kriteria lulus yang dapat diuji (command verifikasi / unit test).

### Phase 3: Penyempurnaan `get-design`
- **Anti-AI-Slop Visual Bar**: Menghindari tipografi generik, card berulang, gradien murahan, dan layout hampa.
- **Design Tokens & Systems**: Panduan tipografi skala modular, palet warna berbobot kontras tinggi, hierarki visual, dan spacing yang presisi.
- **Micro-Interactions & States**: Panduan state lengkap (hover, active, focus-visible, loading, error, empty state).

---

## 6. Langkah Eksekusi Bertahap

- [ ] **Langkah 1**: Buat branch cadangan `archive/22-skills-baseline`.
- [ ] **Langkah 2**: Hapus direktori 19 skill non-inti dari `skills/`.
- [ ] **Langkah 3**: Hapus eval cases & fixtures terkait 19 skill di `evals/`.
- [ ] **Langkah 4**: Sinkronkan perintah slash commands & persona orchestration contracts.
- [ ] **Langkah 5**: Sesuaikan script validator dan jalankan regression tests hingga seluruh validator hijau (`PASSED`).
- [ ] **Langkah 6**: Perbarui dokumentasi (`README.md`, `AGENTS.md`, manifest plugin).
- [ ] **Langkah 7**: Mulai iterasi mendalam penyempurnaan skill `get-prd`, `get-tasks`, dan `get-design`.

