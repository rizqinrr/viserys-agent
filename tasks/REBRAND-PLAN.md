# Rebranding Plan: `viserys-agent` -> `viserys`

Status: DRAFT — belum dieksekusi
Target: `D:\01_Coding\www\viserys-agent` -> `D:\01_Coding\www\viserys`
Sumber konten: salinan `addyosmani/agent-skills`

---

## Keputusan Terkunci

| Item | Keputusan |
|---|---|
| Nama paket | `viserys` |
| Nama folder | `viserys-agent` -> `viserys` |
| Author / owner | `rizqinrr` |
| URL | `https://github.com/rizqinrr/viserys` |
| Lisensi | Dihapus (tanpa lisensi) |
| `docs/` | Hapus 16 file lama, ganti 2 file baru |
| Adapter multi-tool | Biarkan dulu (`.claude*`, `.codex-plugin`, `.gemini`, `.github`, `.agents`, `.opencode`) |
| Nama skill | Biarkan asli (termasuk `using-agent-skills`) |
| `evals/` + `scripts/` | Pertahankan penuh (Opsi A) |
| Git | Ditunda sampai instruksi eksplisit |

---

## Peta Ketergantungan Fase

```
FASE 0 (rename folder)
   |
   +-- FASE 1 (hapus file legal/meta)
   |      |
   |      +-- FASE 2 (hapus docs lama + tulis docs baru + README root)
   |             |
   |             +-- FASE 3 (update 5 manifest plugin)
   |                    |
   |                    +-- FASE 4 (bersihkan branding di non-docs)
   |                           |
   |                           +-- FASE 5 (verifikasi)
   |                                  |
   |                                  +-- FASE 6 (git - DITUNDA)
```

Aturan: jangan mulai fase berikutnya sebelum verifikasi fase sebelumnya lolos.

---

## FASE 0 — Rename Folder

Tujuan: mengubah nama folder kerja dari `viserys-agent` menjadi `viserys`.

### Langkah
1. `Test-Path -LiteralPath "D:\01_Coding\www\viserys-agent"` -> harus `True`.
2. `Test-Path -LiteralPath "D:\01_Coding\www\viserys"` -> harus `False` (kalau ada, berhenti dan lapor).
3. Pastikan tidak ada proses mengunci folder (tidak ada editor/terminal yang `cd` ke sana).
4. `Rename-Item -LiteralPath "D:\01_Coding\www\viserys-agent" -NewName "viserys"`.
5. Setelah rename, semua path di fase berikutnya memakai `D:\01_Coding\www\viserys`.

### Exit Criteria
- Folder `D:\01_Coding\www\viserys` ada dan berisi struktur lengkap (agents, skills, docs, evals, dll).
- Folder `viserys-agent` tidak ada lagi.

### Rollback
- `Rename-Item -LiteralPath "D:\01_Coding\www\viserys" -NewName "viserys-agent"`.

---

## FASE 1 — Hapus File Legal/Meta

Tujuan: membuang artefak legal dan meta upstream di root.

### Daftar File (5)
| # | Path | Alasan |
|---|---|---|
| 1 | `LICENSE` | Lisensi MIT upstream |
| 2 | `CONTRIBUTING.md` | Panduan kontribusi upstream |
| 3 | `README.md` | README upstream (~25 KB) |
| 4 | `CLAUDE.md` | Konteks Claude Code upstream |
| 5 | `AGENTS.md` | Konteks AGENTS upstream |

### Langkah
1. Verifikasi keberadaan tiap file (`Test-Path -LiteralPath`).
2. Hapus satu perintah dengan `Remove-Item -LiteralPath` (literal, jangan wildcard).
3. List ulang root, pastikan hanya tersisa: `.gitattributes`, `.gitignore`, `plugin.json`, dan direktori.

### Exit Criteria
- 5 file di atas tidak ada.
- Root hanya berisi `.gitattributes`, `.gitignore`, `plugin.json` sebagai file, sisanya direktori.

### Rollback
- `git` belum ada; rollback berarti restore dari salinan upstream. Catat bahwa fase ini destruktif tanpa backup — konfirmasi ulang sebelum jalan.

---

## FASE 2 — Rapikan `docs/` dan Root

Tujuan: membuang dokumentasi pihak ketiga, menyisakan referensi internal minimal, dan membuat README baru.

### Langkah 2a — Hapus 16 file docs lama
File berikut dihapus dari `docs/`:
1. `adoption-guide.md`
2. `advanced-per-agent-configuration.md`
3. `agents.md`
4. `antigravity-setup.md`
5. `codex-setup.md`
6. `commandcode-setup.md`
7. `comparison.md`
8. `copilot-cli-setup.md`
9. `copilot-setup.md`
10. `cursor-setup.md`
11. `developer-onboarding.md`
12. `gemini-cli-setup.md`
13. `getting-started.md`
14. `opencode-setup.md`
15. `skill-anatomy.md`
16. `windsurf-setup.md`

### Langkah 2b — Tulis `docs/README.md` (baru)
Isi minimal:
- Identitas paket `viserys`.
- Tujuan paket (workflow engineering untuk agent).
- Peta struktur folder (`skills/`, `agents/`, `references/`, `commands/`, `evals/`, `scripts/`, `hooks/`).
- Cara memakai: skill, persona, command.
- Tautan ke `docs/skill-anatomy.md`.

### Langkah 2c — Tulis `docs/skill-anatomy.md` (baru, tulis ulang)
Isi:
- Format `SKILL.md`: frontmatter (`name`, `description`), aturan penamaan kebab-case.
- Section wajib: Overview, When to Use, Process, Common Rationalizations, Red Flags, Verification.
- Kapan boleh menambah `scripts/` dan `references/`.
- Prinsip penulisan: spesifik, verifiable, minimal.
- WAJIB bebas dari kalimat branding upstream.

### Langkah 2d — Tulis `README.md` root (baru)
Isi:
- Nama `viserys`, deskripsi singkat.
- Daftar skill (25) dengan pengelompokan lifecycle: DEFINE, PLAN, BUILD, VERIFY, REVIEW, SHIP.
- Daftar persona (`agents/`).
- Cara pakai minimal.
- Tanpa link ke repo upstream.

### Exit Criteria
- `docs/` hanya berisi `README.md` dan `skill-anatomy.md`.
- `README.md` root ada dan tidak menyebut `addyosmani`.

### Risiko
- `scripts/validate-reference-links.js` merujuk `docs/*` lama -> akan ditangani di FASE 4, tapi validator akan merah sampai itu beres. Jangan jalankan verifikasi final sebelum FASE 4.

### Rollback
- Restore dari salinan upstream.

---

## FASE 3 — Update 5 Manifest Plugin

Tujuan: mengganti identitas mesin dari `agent-skills` ke `viserys`.

### Perubahan Umum
- `name: "agent-skills"` -> `"viserys"`.
- `author.name` / `owner.name` -> `rizqinrr`.
- `homepage` / `repository` -> `https://github.com/rizqinrr/viserys`.
- Hapus field `license: "MIT"`.
- Normalkan karakter mojibake `\uFFFD?` jadi `-`.

### File dan Field

| File | Field yang diubah |
|---|---|
| `plugin.json` | `name`, `description` |
| `.claude-plugin/plugin.json` | `name`, `description`, `author.name`, `homepage`, `repository`, hapus `license` |
| `.claude-plugin/marketplace.json` | `name` -> `viserys`, `owner.name`, `owner.url`, `plugins[].source.repo`, `plugins[].homepage`, `plugins[].keywords`, hapus `plugins[].license` |
| `.codex-plugin/plugin.json` | `name`, `author.name`, `author.url`, `homepage`, `repository`, hapus `license`, `interface.displayName` -> `Viserys`, `interface.longDescription`, `interface.developerName` |
| `.agents/plugins/marketplace.json` | `name`, `interface.displayName`, `plugins[].name` |

### Exit Criteria
- Semua JSON valid (`ConvertFrom-Json`).
- Tidak ada `license` di kelima file.
- Tidak ada `addyosmani` di kelima file.

### Rollback
- Simpan salinan `.bak` tiap file sebelum edit, atau restore dari upstream.

---

## FASE 4 — Bersihkan Branding di File Non-Docs

Tujuan: menghilangkan sisa jejak upstream di kode, hooks, commands, dan eval docs.

### Pola Pencarian (harus nol setelah fase ini)
```
addyosmani | Addy Osmani | addy-agent-skills | agent-skills | Production-grade engineering
```
Pengecualian yang diizinkan: nama skill `using-agent-skills` (sengaja dibiarkan).

### Sasaran per File

| # | File | Aksi |
|---|---|---|
| 1 | `hooks/session-start.sh` | Ganti URL/nama repo -> `rizqinrr/viserys` |
| 2 | `hooks/session-start-test.sh` | Sinkron dengan no.1 |
| 3 | `hooks/SDD-CACHE.md` | Bersihkan nama upstream |
| 4 | `scripts/run-evals.js` | Bersihkan referensi nama plugin/URL |
| 5 | `scripts/run-evals-test.js` | Sinkron dengan no.4 |
| 6 | `scripts/validate-reference-links.js` | Sesuaikan target link (docs lama sudah dihapus) |
| 7 | `scripts/validate-reference-links-test.js` | Sinkron dengan no.6 |
| 8 | `scripts/validate-commands.js` | Bersihkan nama |
| 9 | `scripts/validate-commands-test.js` | Sinkron dengan no.8 |
| 10 | `scripts/validate-artifact-paths-test.js` | Bersihkan |
| 11 | `scripts/lib/skill-lint.js` | Cek whitelist/lint nama skill |
| 12 | `scripts/lib/skill-lint-test.js` | Sinkron dengan no.11 |
| 13 | `.claude/commands/build.md` | `agent-skills` -> `viserys` |
| 14 | `.claude/commands/code-simplify.md` | idem |
| 15 | `.claude/commands/constraints.md` | idem |
| 16 | `.claude/commands/plan.md` | idem |
| 17 | `.claude/commands/review.md` | idem |
| 18 | `.claude/commands/ship.md` | idem |
| 19 | `.claude/commands/spec.md` | idem |
| 20 | `.claude/commands/test.md` | idem |
| 21 | `.claude/commands/webperf.md` | idem |
| 22 | `.github/workflows/test-plugin-install.yml` | Ganti nama plugin/repo |
| 23 | `.github/ISSUE_TEMPLATE/skill-gap.yml` | Ganti nama repo |
| 24 | `evals/README.md` | Bersihkan link/issues upstream, sesuaikan referensi `--min-rank1`, `#351`, `#361` |
| 25 | `evals/skill-impact.md` | Cek dan bersihkan |

### Langkah
1. Untuk tiap file: baca dulu, edit hanya baris yang mengandung pola.
2. Untuk pasangan `*-test.js`: pastikan ekspektasi test disesuaikan, jangan sampai test mengecek string upstream.
3. Untuk no.6/7: ganti referensi `docs/<file-lama>.md` ke `docs/README.md` atau `docs/skill-anatomy.md` sesuai konteks; kalau referensi tidak lagi relevan, hapus assertion-nya.
4. Untuk `evals/README.md`: perbarui narasi tapi pertahankan isi teknis (3 tier, format eval case) karena ini dokumentasi internal paket `viserys`.

### Exit Criteria
- Grep pola di atas -> nol (kecuali `using-agent-skills`).
- Tidak ada link mati ke `docs/*` yang sudah dihapus.

### Rollback
- Edit terarah per file; rollback dengan mengembalikan baris asli (catat diff sebelum-sesudah).

---

## FASE 5 — Verifikasi

Tujuan: membuktikan paket `viserys` utuh dan bersih.

### Langkah
1. Validasi JSON:
   - `Get-Content <file> -Raw | ConvertFrom-Json` untuk `plugin.json`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json`, dan semua `evals/cases/*.json` yang tersentuh.
2. Validator struktur (wajib lolos):
   - `node scripts/validate-skills.js`
   - `node scripts/validate-commands.js`
   - `node scripts/validate-artifact-paths.js`
   - `node scripts/validate-reference-links.js`
   - `node scripts/validate-versions.js`
3. Eval Tier 2 (gratis, tanpa token):
   - `node scripts/run-evals.js`
   - Cek: trigger rank-1 rate tidak turun, tidak ada collision.
4. Grep final:
   - `Select-String -Pattern "addyosmani|Addy Osmani|addy-agent-skills|agent-skills|Production-grade engineering"` di seluruh file teks -> nol.
5. Audit mojibake:
   - Cari karakter `\uFFFD` di seluruh file teks -> nol.
6. Cek struktur akhir:
   - `docs/` hanya `README.md` + `skill-anatomy.md`.
   - Root tanpa 5 file legal/meta.

### Exit Criteria
- Semua validator exit code 0.
- Semua item grep bersih.
- Struktur folder sesuai target.

### Jika Gagal
- Kembali ke fase penyebab (biasanya FASE 4 untuk link/doc).
- Jangan tandai selesai sampai semua hijau.

---

## FASE 6 — Git (DITUNDA)

Status: menunggu instruksi eksplisit user.

### Rencana (belum dijalankan)
1. `git init` di `D:\01_Coding\www\viserys`.
2. `git add -A` lalu commit awal (`chore: rebrand agent-skills to viserys`).
3. `gh repo create rizqinrr/viserys --private --source . --push` (setelah user konfirmasi public/private).

### Jangan Jalankan Sampai
- User memberi perintah eksplisit untuk git.

---

## Checklist Eksekusi (centang saat selesai)

- [ ] FASE 0 — folder di-rename ke `viserys`
- [ ] FASE 1 — 5 file legal/meta dihapus
- [ ] FASE 2a — 16 file docs lama dihapus
- [ ] FASE 2b — `docs/README.md` dibuat
- [ ] FASE 2c — `docs/skill-anatomy.md` dibuat
- [ ] FASE 2d — `README.md` root dibuat
- [ ] FASE 3 — 5 manifest plugin di-update & JSON valid
- [ ] FASE 4 — branding dibersihkan di 25 file sasaran
- [ ] FASE 5 — semua validator + eval lolos, grep bersih
- [ ] FASE 6 — ditunda
