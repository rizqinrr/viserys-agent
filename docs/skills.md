# Skill Catalog

Viserys memiliki 3 core skills utama yang terintegrasi dan ramah bagi pengguna baru. Deskripsi di `SKILL.md` menentukan kapan agent memuat workflow secara otomatis.

Alur pengerjaan menghasilkan 3 dokumen keluaran konkret:

```
get-prd (docs/PRD.md) ──→ get-tasks (tasks/*.md) ──→ get-design (docs/design.md)
```

---

## 1. DEFINE: `get-prd`

| Atribut | Keterangan |
|---|---|
| **Deliverable** | `docs/PRD.md` (atau `PRD.md`) |
| **Gunakan ketika** | Memulai aplikasi/sistem/fitur baru dan belum ada dokumen spesifikasi tertulis. |
| **Deskripsi** | Melakukan wawancara terstruktur mendalam (*design-tree interviewing*), ekstraksi kebutuhan & batasan (*constraints*), penajaman ide mentah, serta pemetaan entitas data inti. |
| **Trigger Kata Kunci** | `"get prd"`, `"bikin PRD"`, `"buat PRD"`, `"mau bikin sistem baru"`, `"grill me"` |

---

## 2. PLAN: `get-tasks`

| Atribut | Keterangan |
|---|---|
| **Deliverable** | `tasks/<feature>/plan.md` & `task-01.md`, `task-02.md`, dst. |
| **Gunakan ketika** | PRD sudah disetujui dan siap dipecah menjadi unit-unit pekerjaan teknis. |
| **Deskripsi** | Menyusun grafik dependensi, memotong fitur menjadi irisan vertikal (*vertical slices / tracer bullets*), menetapkan kriteria verifikasi TDD per task, dan menyajikan tabel ringkasan sebelum file task dibuat. |
| **Trigger Kata Kunci** | `"get tasks"`, `"breakdown PRD"`, `"pecah jadi task"`, `"bikin task list"`, `"turn this into tasks"` |

---

## 3. DESIGN: `get-design`

| Atribut | Keterangan |
|---|---|
| **Deliverable** | `docs/design.md` (atau `design.md`) |
| **Gunakan ketika** | Merancang arah visual UI/UX, tata letak, atau membersihkan antarmuka dari pola generik AI slop. |
| **Deskripsi** | Wawancara estetika produk, penentuan tokens desain (warna, tipografi, radius, elevasi), tata letak responsif (mobile 375px hingga desktop), serta penetapan seluruh siklus state interaktif (default, hover, focus, active, disabled, loading, empty, error). |
| **Trigger Kata Kunci** | `"get design"`, `"bikin UI"`, `"desain tampilan"`, `"critique AI slop"`, `"redesign surface"` |
