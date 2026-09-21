# Installation and Harness Support

Panduan ini membedakan kemampuan yang tersedia di repository, structural validation, dan runtime end-to-end verification. Core skills adalah Markdown; plugin, command adapter, persona, hook, dan browser tooling mempunyai prerequisite tersendiri.

## Support matrix

| Harness | Skills | Commands | Primary agent | Personas | Hooks | Status |
|---|---:|---:|---:|---:|---:|---|
| OpenCode | Ya | `/get-design` adapter repo; lainnya via routing | `viserys` | Root `agents/` tidak otomatis aktif | Tidak disediakan | Project adapter tersedia |
| Claude Code | Ya | 13 adapters | Plugin session | 7 plugin personas | SessionStart optional | Paling lengkap; install flow diuji CI |
| Gemini CLI | Ya bila skill source dikonfigurasi | 13 adapters | Tidak ada Viserys primary adapter | Bergantung custom-agent support | Tidak disediakan | Available, structurally tested; runtime E2E belum diverifikasi |
| Antigravity | Ya bila skill source dikonfigurasi | 13 adapters | Tidak ada Viserys primary adapter | Bergantung custom-agent support | Tidak disediakan | Available, structurally tested; runtime E2E belum diverifikasi |
| OMP | Ya | Native prompts/commands | `/viserys` session mode | Native OMP agents | Bergantung OMP | Kompatibel melalui copy/link structure |
| Codex | Ya, melalui manifest | Tidak ada native command catalog | Tidak ada | Tidak terverifikasi | Tidak disediakan | Skills-only pada level manifest |

`validate-commands.js` memverifikasi parity filename dan description untuk Claude, Gemini, dan Antigravity. Structural validation tidak sama dengan runtime installation test.

## OpenCode

### Prerequisite

- Checkout Viserys tersedia secara lokal.
- OpenCode dijalankan dari root repository untuk project scope.

### Project scope

```text
1. Buka root repository Viserys dari OpenCode.
2. Tekan Tab.
3. Pilih agent viserys.
```

Adapter project:

- `.opencode/agents/viserys.md` — primary agent.
- `opencode.json` di root — project config yang memuat `AGENTS.md` dan mendaftarkan `skills/`. OpenCode memuat project config dari root project/Git directory; `.opencode/` dipakai untuk agents, commands, dan plugin directories.
- `.opencode/command/get-design.md` — command `/get-design`.

Verifikasi: primary agent `viserys` muncul dan direct skill invocation dapat menemukan skill dari `skills/`.

### Global scope

Salin `.opencode/agents/viserys.md` ke `~/.config/opencode/agents/viserys.md`, lalu daftarkan checkout skills dengan absolute path:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "skills": {
    "paths": [
      "D:/path/to/viserys/skills"
    ]
  }
}
```

Jangan menyalin atau mengubah konfigurasi global tanpa persetujuan pemilik environment. Dokumentasi OpenCode: [skills](https://opencode.ai/docs/skills/) dan [agents](https://opencode.ai/docs/agents/).

### Batasan

Persona di root `agents/` sengaja tidak diduplikasi ke `.opencode/agents/`. OpenCode memakai skill routing atau degraded single-context fallback kecuali pengguna membuat adapter persona sendiri.

## Claude Code

### Prerequisite

- Claude Code CLI.
- Git checkout Viserys.
- Bash dan `jq` hanya diperlukan untuk optional SessionStart hook.

### Install dari checkout lokal

```bash
claude plugin validate .
claude plugin marketplace add ./
claude plugin install viserys@viserys --scope user
```

`.claude-plugin/plugin.json` secara eksplisit mendaftarkan `skills/` dan dua command paths: `.claude/commands/` serta `commands/`. Root `agents/` dan `hooks/` mengikuti plugin discovery/layout behavior; keduanya bukan field eksplisit dalam manifest tersebut.

Setelah install, coba `/spec`, `/plan`, `/review`, atau `/ship`. Bila CLI menampilkan namespace plugin, gunakan completion yang ditawarkan.

### Verifikasi

```bash
claude plugin validate .
```

CI juga menguji marketplace add dan plugin install. Persona discovery dan command runtime tetap bergantung versi Claude Code yang digunakan.

### Hooks

SessionStart hook bersifat optional. Tanpa Bash atau `jq`, skills dan commands tetap tersedia tetapi automatic meta-skill injection tidak berjalan. Detail: [`hooks.md`](hooks.md).

## Gemini CLI

Repository menyediakan 13 adapter di `.gemini/commands/`.

### Availability

- Filename dan description parity divalidasi terhadap Claude dan Antigravity.
- Planning command bernama `/planning`, bukan `/plan`.
- Command bodies menggunakan syntax/prompt yang disesuaikan untuk Gemini.
- Runtime installation dan persona dispatch belum diuji end-to-end oleh CI repository ini.

### Setup

Tempatkan atau hubungkan file `.gemini/commands/*.toml` ke command scope Gemini CLI yang digunakan. Root `agents/` adalah persona source, bukan `.gemini/agents/` adapter; copy/register persona ke lokasi custom-agent yang didukung versi Gemini bila true subagent dispatch dibutuhkan. Tanpa itu, commands memakai degraded single-context fallback. Karena repository belum menyediakan installer Gemini, ikuti mekanisme custom command dan custom agent resmi dari versi Gemini CLI yang dipakai.

### Verifikasi

```bash
node scripts/validate-commands.js
node scripts/validate-personas.js
```

Lalu pastikan command seperti `/review` dan `/planning` muncul pada session Gemini. Kegagalan runtime harus dilaporkan sebagai compatibility gap, bukan dianggap structural-validator failure.

## Antigravity

Repository menyediakan 13 TOML adapter di `commands/`.

### Availability

- Filename dan description parity divalidasi terhadap Claude dan Gemini.
- Planning command bernama `/planning`.
- Runtime installation dan persona dispatch belum diuji end-to-end oleh CI repository ini.

### Setup

Tempatkan atau hubungkan `commands/*.toml`, `skills/`, dan bila didukung `agents/` ke project/user scope Antigravity yang digunakan. Repository belum menyediakan installer Antigravity; gunakan mechanism command dan skill source dari versi harness aktif.

### Verifikasi

```bash
node scripts/validate-commands.js
node scripts/validate-personas.js
```

Setelah wiring, pastikan `/review`, `/planning`, dan `/ship` tersedia. Status adapter tetap **available, structurally tested** sampai runtime E2E ditambahkan ke CI.

## OMP

OMP mendukung satu folder per skill berisi `SKILL.md`, agent Markdown, dan prompt sesuai scope.

### Project scope

```text
.omp/
├── agents/
├── prompts/
└── skills/
    └── <skill-name>/SKILL.md
```

### User scope

```text
~/.omp/agent/
├── agents/
├── prompts/
└── skills/
    └── <skill-name>/SKILL.md
```

Salin atau tautkan `skills/` ke lokasi skills OMP. Salin `agents/` hanya bila specialist personas dibutuhkan. Prompt `/get-design` dapat ditempatkan sebagai `prompts/get-design.md` pada scope yang dipilih.

Aktifkan session mode:

```text
/viserys hai
```

Mulai sesi baru atau refresh Agent Hub agar perubahan definition ter-load. Dokumentasi OMP: [skills](https://omp.sh/docs/skills), [subagent authoring](https://omp.sh/docs/subagent-authoring), dan [prompt templates](https://omp.sh/docs/prompt-templates).

## Codex

`.codex-plugin/plugin.json` mendaftarkan `skills/` dan metadata interface Viserys. Dukungan saat ini adalah skills-only pada level manifest.

Tidak tersedia:

- native Viserys command catalog;
- primary agent adapter;
- persona orchestration yang terverifikasi;
- installer khusus repository.

Distribusikan folder `skills/` melalui mechanism plugin/skills Codex yang digunakan. Jangan mengklaim command atau persona support tanpa runtime verification.

## Windows notes

Command validation menggunakan Node.js dan bekerja dari PowerShell:

```powershell
node scripts/validate-commands.js
node scripts/validate-personas.js
```

Claude SessionStart hook tetap membutuhkan Bash-compatible shell dan `jq`; PowerShell saja tidak menjalankan shell hook tersebut.

## Update dan uninstall

- **Checkout-based setup:** pull/update repository lalu restart atau reload harness.
- **Copied setup:** sinkronkan seluruh skill directory termasuk `references/`, bukan hanya `SKILL.md`.
- **Plugin setup:** gunakan update/uninstall mechanism harness yang memasang plugin.
- Setelah update, jalankan structural validators dan smoke-test satu command utama.
