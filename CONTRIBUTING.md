# Contributing

Viserys adalah workflow pack untuk AI coding agents. Perubahan harus menjaga routing skill, contract persona, adapter parity, documentation accuracy, dan verification evidence.

## Source of truth

- `skills/` dan `docs/skills.md` — skill behavior dan katalog.
- `agents/` dan `docs/personas-and-orchestration.md` — persona behavior dan roster.
- `docs/commands.md` — invariant command contract.
- `docs/installation.md` — harness support matrix dan setup status.
- `scripts/` — enforceable structural contracts.
- Manifest dan adapter directories — fakta wiring aktual; dokumentasi tidak boleh mengklaim capability yang tidak ada di sana.

## Sebelum proposing skill baru

1. Cari `skills/` dan `docs/skills.md` untuk workflow yang sudah menutup intent tersebut.
2. Periksa open pull requests bila remote tersedia: `gh pr list --state open`.
3. Tulis gap yang tidak bisa diselesaikan dengan memperluas skill existing.
4. Prefer extending an existing skill daripada membuat near-duplicate.

## Tambah atau ubah skill

1. Buat atau edit `skills/<name>/SKILL.md`.
2. Pastikan frontmatter hanya memiliki `name` dan `description` sesuai `docs/skill-anatomy.md`.
3. Tambah atau update `evals/cases/<name>.json` dengan minimal 3 positive triggers, 2 negative triggers, dan 1 behavioral eval.
4. Tambah fixture bila behavioral eval memakai `kind: execution`.
5. Update `README.md` bila count/phase summary berubah dan `docs/skills.md` bila katalog berubah.
6. Tambahkan attribution bila mengadaptasi material pihak ketiga.

## Tambah atau ubah persona

1. Gunakan `agents/<name>.md` dengan frontmatter `name` yang sama dengan filename.
2. Definisikan scope, output format, rules, dan composition boundary.
3. Persona tidak boleh memanggil persona lain; command/main session adalah orchestrator.
4. Update `docs/personas-and-orchestration.md`, README summary, dan orchestration reference bila roster atau fan-out berubah.
5. Update `scripts/validate-personas.js` dan regression tests untuk contract baru.
6. Jangan menambah OpenCode persona adapter tanpa keputusan scope eksplisit.

## Tambah atau ubah command

Command canonical memiliki adapter berikut:

```text
.claude/commands/<name>.md
.gemini/commands/<name>.toml
commands/<name>.toml
```

Jika OpenCode adapter memang disediakan:

```text
.opencode/command/<name>.md
```

Rules:

- Description antar adapter harus sama.
- Invariant behavior, required persona, severity taxonomy, dan output contract harus sama.
- Prompt body boleh berbeda hanya untuk syntax dan capability harness.
- Perubahan availability atau alias wajib memperbarui `docs/commands.md` dan `docs/installation.md`.
- Runtime support tidak boleh diklaim hanya karena structural validator lulus.

## Dokumentasi

- `README.md` adalah entry point, bukan tempat seluruh detail adapter.
- `docs/installation.md` adalah support matrix canonical.
- `docs/commands.md` adalah command behavior canonical.
- `docs/README.md` adalah navigation index.
- `AGENTS.md` berisi maintainer/agent rules, bukan katalog publik duplikat.
- Gunakan link ke source of truth daripada menyalin penjelasan panjang ke beberapa file.

## Validasi

| Check | Local | CI | Tujuan |
|---|---:|---:|---|
| `node scripts/validate-skills.js` | Wajib | Ya | Struktur dan frontmatter skills |
| `node scripts/validate-commands.js` | Wajib | Ya | Adapter parity dan description sync |
| `node scripts/validate-personas.js` | Wajib | Ya | Persona roster dan orchestration contract |
| `node scripts/validate-artifact-paths.js` | Wajib | Ya | Spec/plan/todo paths |
| `node scripts/validate-reference-links.js` | Wajib | Ya | Skill reference links |
| `node scripts/validate-versions.js` | Wajib | Ya | Manifest version consistency |
| `node scripts/run-evals.js --min-rank1 95` | Wajib | Ya | Trigger dan routing quality |
| `node --test scripts/*-test.js scripts/lib/*-test.js` | Wajib | Ya, per validator | Regression tests |
| `claude plugin validate .` | Bila plugin berubah | Ya | Claude marketplace/plugin structure |
| `git diff --check` | Wajib | Tidak terpisah | Whitespace errors |

Behavioral evals yang menghabiskan token hanya dijalankan bila diminta; deterministic eval tetap wajib.

## Scope discipline

- Jangan mengubah konfigurasi user/global tanpa permintaan eksplisit.
- Jangan commit secret, `.env`, cache, atau generated output.
- Jangan menambah runtime dependency untuk core Markdown tanpa alasan jelas.
- Pisahkan skill, adapter, dokumentasi, dan validator ke commit logis bila memungkinkan.
- Jangan memperbaiki capability harness dengan klaim dokumentasi; implementasikan dan verifikasi capability terlebih dahulu.
