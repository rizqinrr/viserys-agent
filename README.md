```
.---------------------------------------------------------------.
|'||'  '|' '||'  .|'''.|  '||''''|  '||''|.   '||' '|'  .|'''.| |
| '|.  .'   ||   ||..  '   ||  .     ||   ||    || |    ||..  ' |
|  ||  |    ||    ''|||.   ||''|     ||''|'      ||      ''|||. |
|   |||     ||  .     '||  ||        ||   |.     ||    .     '|||
|    |     .||. |'....|'  .||.....| .||.  '|'   .||.   |'....|' |
'---------------------------------------------------------------'
```

# Viserys

[![Agent Skills](https://img.shields.io/badge/skills.sh-rizqinrr%2Fviserys--agent-18181b?logo=vercel&logoColor=white)](https://skills.sh/rizqinrr/viserys-agent)
[![Showcase Web](https://img.shields.io/badge/demo-GitHub%20Pages-2563eb)](https://rizqinrr.github.io/viserys-agent/)
[![License](https://img.shields.io/badge/license-Apache%202.0-green.svg)](LICENSE)
[![Tests Passing](https://img.shields.io/badge/tests-62%20passed-brightgreen)](#validation)

Engineering workflow pack untuk AI coding agents. Viserys memberi AI proses rekayasa perangkat lunak yang terstruktur—mencegah agent melakukan *vibe coding* serampangan tanpa spesifikasi, tanpa dekomposisi tugas, dan tanpa standar visual.

```text
INTERVIEW & SPEC (get-prd) ──→ VERTICAL TASK SLICES (get-tasks) ──→ BESPOKE UI SPEC (get-design)
```

Core Viserys terdiri dari Markdown murni dan validator Node.js tanpa runtime aplikasi atau dependensi network. Kompatibel out-of-the-box dengan Claude Code, Cursor, Windsurf, OpenCode, Gemini CLI, dan Antigravity.

---

## Quick Install

### 1. Universal Install (`npx skills`)

Gunakan package manager skill dari Vercel / Agent Skills ecosystem untuk menambahkan Viserys ke agent pilihan Anda (Claude Code, Cursor, Windsurf, Codex, dll.):

```bash
# Install semua core skills ke agent aktif
npx skills add rizqinrr/viserys-agent

# Atau install secara spesifik per skill
npx skills add rizqinrr/viserys-agent --skill get-prd
```

### 2. OpenCode Project Scope

Buka repositori ini langsung dari OpenCode:
```text
1. Buka folder repositori dari OpenCode.
2. Tekan Tab.
3. Pilih agent viserys.
```

### 3. Claude Code Plugin

Install langsung dari checkout lokal repositori:
```bash
claude plugin validate .
claude plugin marketplace add ./
claude plugin install viserys@viserys --scope user
```

---

## 3 Core Pillars

Viserys berfokus pada tiga alur kerja rekayasa berkekuatan tinggi yang menghasilkan deliverable terstandarisasi:

```
get-prd (docs/PRD.md) ──→ get-tasks (tasks/<name>/plan.md) ──→ get-design (docs/design.md)
```

| Skill | Deliverable | Kapan Digunakan |
|---|---|---|
| **`get-prd`** | `docs/PRD.md` | Memulai inisiatif, fitur, atau sistem baru. Menjalankan *structured interview*, validasi problem, ekstraksi intent, identifikasi batasan (NFRs/SLAs), dan perancangan entitas data inti. |
| **`get-tasks`** | `tasks/<feature>/plan.md` & `task-*.md` | PRD telah disetujui. Memecah spesifikasi menjadi *vertical task slices*, urutan dependensi, kriteria penerimaan terukur, dan gate verifikasi TDD. |
| **`get-design`** | `docs/design.md` | Merancang antarmuka produk web/aplikasi. Menghapus estetika generik "AI slop", menetapkan token desain unik, breakpoint responsif (mobile-first), dan kelengkapan state interaktif. |

Detail trigger, batasan, dan kontrak tiap skill: [`docs/skills.md`](docs/skills.md).

---

## Cara Memakai Viserys

### 1. Natural Language Intent (Automatic Routing)

Cukup ajak bicara agent Anda secara natural, agent akan memilih skill yang sesuai secara otomatis:

```text
"Saya mau bikin fitur autentikasi multi-tenant baru, tolong interview saya."
→ Memanggil get-prd
```

```text
"PRD di docs/PRD.md sudah disetujui, tolong breakdown jadi task yang bisa dieksekusi subagent."
→ Memanggil get-tasks
```

```text
"Desain antarmuka dashboard monitoring ini, jangan buat yang terlihat generic AI slop."
→ Memanggil get-design
```

### 2. Direct Slash Commands

Tersedia slash command untuk Claude Code, Gemini CLI, dan Antigravity:

| Perintah | Deskripsi | Target Deliverable |
|---|---|---|
| `/get-prd` | Wawancara terstruktur & spesifikasi mendalam | `docs/PRD.md` |
| `/get-tasks` | Dekomposisi tugas vertikal & verifikasi TDD | `tasks/<feature>/plan.md` |
| `/get-design` | Arah visual, tokens, dan state antarmuka | `docs/design.md` |

Detail kontrak perintah: [`docs/commands.md`](docs/commands.md).

---

## Ekosistem & Komponen Pendukung

Selain 3 core skills, Viserys menyertakan komponen rekayasa pendukung:

- **7 Specialist Personas** (`agents/`) — persona prompt ahli untuk subagent (`strategist`, `maester`, `kingsguard`, `prover`, `racer`, `artisan`, `chronicler`).
- **7 Shared Checklists** (`references/`) — checklist siap pakai untuk security, testing, Core Web Vitals, definition of done, dan orchestrasi.
- **Structural Validators & Evals** (`scripts/`, `evals/`) — suite pengujian otomatis untuk memverifikasi konsistensi routing, format frontmatter, versioning, dan trigger rank-1.

---

## Matriks Dukungan Harness

| Platform / Agent | Metode Integrasi | Status |
|---|---|---|
| **Claude Code** | Plugin lokal atau `npx skills add` | Didukung penuh & diuji di CI |
| **Cursor / Windsurf** | `npx skills add rizqinrr/viserys-agent` | Didukung via open agent-skills standard |
| **OpenCode** | Project adapter (`.opencode/`) & global config | Didukung |
| **Antigravity** | Adapter di `commands/` | Structurally validated |
| **Gemini CLI** | Adapter di `.gemini/commands/` | Structurally validated |

Panduan instalasi lengkap: [`docs/installation.md`](docs/installation.md).

---

## Repository Map

| Path | Isi |
|---|---|
| `skills/` | 3 core workflow skills (`get-prd`, `get-tasks`, `get-design`) dan per-skill references |
| `agents/` | 7 specialist persona prompts |
| `site/` | Web showcase & viewer interaktif untuk GitHub Pages |
| `references/` | Shared checklists dan panduan orkestrasi |
| `.claude/commands/` | Claude Code command adapters |
| `.gemini/commands/` | Gemini CLI command adapters |
| `commands/` | Antigravity command adapters |
| `.opencode/` + `opencode.json` | OpenCode agent/command adapters dan root project config |
| `evals/` | Evals suite deterministik & behavioral fixtures |
| `scripts/` | Validator struktural, eval runner, dan unit test suites |
| `docs/` | Dokumentasi spesifikasi, instalasi, dan authoring |

---

## Validation

Semua perubahan pada repositori dijaga oleh validator deterministik:

```bash
# Validasi struktur skill, perintah, dan manifest
node scripts/validate-skills.js
node scripts/validate-commands.js
node scripts/validate-personas.js
node scripts/validate-artifact-paths.js
node scripts/validate-reference-links.js
node scripts/validate-versions.js

# Validasi trigger evals (Tier-2)
node scripts/run-evals.js --min-rank1 95

# Unit test suites (62 tests)
node --test scripts/*-test.js scripts/lib/*-test.js
```

---

## Community & Links

- **Web Showcase**: [https://rizqinrr.github.io/viserys-agent/](https://rizqinrr.github.io/viserys-agent/)
- **Skills.sh Registry**: [https://skills.sh/rizqinrr/viserys-agent](https://skills.sh/rizqinrr/viserys-agent)
- **Discord Community**: [Join Discord Viserys](https://discord.gg/WR6rg5YAy)

---

## License

Viserys dilisensikan di bawah [Apache License 2.0](LICENSE). Copyright 2026 rizqinrr.  
Materi `get-design` mengadaptasi panduan Apache-2.0 dari Impeccable; atribusi upstream dipertahankan pada file adaptasi yang relevan.
