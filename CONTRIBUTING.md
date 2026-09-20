# Contributing

Viserys adalah pack workflow untuk AI coding agents. Perubahan harus menjaga tiga hal: skill tetap dapat diroute, workflow tetap dapat diverifikasi, dan adapter tidak saling drift.

## Sebelum proposing skill baru

1. Cari katalog `skills/` dan `docs/skills.md` untuk workflow yang sudah menutup intent tersebut.
2. Periksa open pull requests bila repository remote tersedia: `gh pr list --state open`.
3. Tulis gap yang tidak bisa diselesaikan dengan memperluas skill existing.
4. Prefer extending an existing skill daripada membuat near-duplicate.

## Tambah atau ubah skill

1. Buat atau edit `skills/<name>/SKILL.md`.
2. Pastikan frontmatter hanya memiliki `name` dan `description` sesuai `docs/skill-anatomy.md`.
3. Tambah `evals/cases/<name>.json` dengan minimal 3 positive triggers, 2 negative triggers, dan 1 behavioral eval.
4. Tambah fixture bila behavioral eval memakai `kind: execution`.
5. Update `README.md`, `docs/README.md`, dan `docs/skills.md` bila katalog berubah.
6. Tambahkan attribution bila mengadaptasi material pihak ketiga.

## Tambah command

Command harus memiliki adapter yang sesuai:

```text
.claude/commands/<name>.md
.gemini/commands/<name>.toml
commands/<name>.toml
```

Jika OpenCode adapter disediakan, gunakan:

```text
.opencode/command/<name>.md
```

Description antar adapter harus sama. Body boleh berbeda untuk syntax harness.

## Validasi

```bash
node scripts/validate-skills.js
node scripts/validate-commands.js
node scripts/validate-artifact-paths.js
node scripts/validate-reference-links.js
node scripts/validate-versions.js
node scripts/run-evals.js --min-rank1 95
node --test scripts/*-test.js scripts/lib/*-test.js
```

Jalankan `git diff --check` sebelum membuka pull request.

## Scope discipline

- Jangan mengubah konfigurasi user/global tanpa permintaan eksplisit.
- Jangan commit secret, `.env`, cache, atau generated output.
- Jangan menambah dependency runtime untuk skill Markdown tanpa alasan yang jelas.
- Pisahkan perubahan skill, command adapter, dokumentasi, dan validator ke commit logis bila memungkinkan.
