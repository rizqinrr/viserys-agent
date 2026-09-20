# Installation

Panduan ini membedakan dukungan yang teruji dari adapter yang tersedia tetapi belum memiliki installer end-to-end.

## OpenCode

### Project scope

Buka root repository Viserys dari OpenCode, lalu tekan `Tab` dan pilih `viserys`.

Adapter project berada di `.opencode/`:

- `.opencode/agent/viserys.md` — primary agent.
- `.opencode/opencode.json` — mendaftarkan `AGENTS.md` dan `skills/`.
- `.opencode/command/get-design.md` — command `/get-design`.

### Global scope

Salin agent Viserys ke konfigurasi global OpenCode dan daftarkan folder skills checkout ini pada `skills.paths`:

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

Salin `.opencode/agent/viserys.md` ke salah satu lokasi agent global OpenCode yang didukung, misalnya `~/.config/opencode/agents/viserys.md`. Gunakan path absolut untuk checkout skills agar agent tetap menemukan seluruh skill.

OpenCode membaca skills dari `SKILL.md` dan agent dari file Markdown. Lihat dokumentasi OpenCode untuk [skills](https://opencode.ai/docs/skills/) dan [agents](https://opencode.ai/docs/agents/).

## Claude Code

Dari checkout Viserys:

```bash
claude plugin validate .
claude plugin marketplace add ./
claude plugin install viserys@viserys --scope user
```

Manifest Claude mendaftarkan:

- `.claude/commands/` dan `commands/` sebagai command sources.
- `skills/` sebagai skill source.
- `agents/` sebagai persona source melalui plugin.
- `hooks/` sebagai optional session lifecycle integration.

Setelah terpasang, gunakan `/spec`, `/plan`, `/build`, `/test`, `/review`, `/ship`, atau `/get-design`. Jika versi Claude menampilkan command dengan namespace plugin, gunakan completion yang ditawarkan oleh CLI.

Hook SessionStart menggunakan shell script dan dapat membutuhkan Bash serta `jq`. Skills tetap dapat dipakai tanpa hook, tetapi automatic context injection dari hook tidak tersedia.

## OMP

OMP mendukung skill dengan satu folder per skill yang berisi `SKILL.md`, plus agent Markdown dan prompt/command sesuai scope.

### Project scope

Salin atau tautkan struktur berikut ke project:

```text
.omp/
├── agents/
├── prompts/
└── skills/
    └── <skill-name>/SKILL.md
```

### User scope

Gunakan struktur user OMP aktif:

```text
~/.omp/agent/
├── agents/
├── prompts/
└── skills/
    └── <skill-name>/SKILL.md
```

Untuk paket Viserys, salin `skills/` ke lokasi skills OMP dan `agents/` ke lokasi agents jika ingin specialist tersedia lintas project. Prompt `/get-design` dapat ditempatkan sebagai `prompts/get-design.md` pada scope yang diinginkan.

Aktifkan mode Viserys selama satu sesi dengan:

```text
/viserys hai
```

OMP membaca perubahan skill saat sesi baru dimulai; agent definitions dapat direfresh dari Agent Hub sesuai versi OMP yang digunakan.

Dokumentasi OMP: [skills](https://omp.sh/docs/skills), [subagent authoring](https://omp.sh/docs/subagent-authoring), dan [prompt templates](https://omp.sh/docs/prompt-templates).

## Codex

Manifest Codex mendaftarkan skills:

```text
.codex-plugin/plugin.json
```

Distribusikan folder `skills/` sebagai skill source sesuai mekanisme plugin/skills Codex yang kamu gunakan. Dukungan saat ini adalah **skills-only pada level manifest**; command catalog, persona orchestration, dan installer Codex khusus belum disediakan oleh repository ini.

## Update

Untuk semua harness, update checkout Viserys lalu reload atau restart harness sesuai mekanismenya. Jangan menyalin hanya `SKILL.md` tanpa folder `references/` pendukung bila skill tersebut menggunakannya.

## Batas dukungan

| Harness | Skills | Commands | Primary agent | Personas | Status |
|---|---:|---:|---:|---:|---|
| OpenCode | Ya | `/get-design` adapter repo | `viserys` | Manual/adapter-specific | Project adapter lengkap |
| Claude Code | Ya | 13 command adapters | Plugin agent | Plugin personas | Paling teruji |
| OMP | Ya | Prompt/command native | `/viserys` session mode | Native OMP agents | Kompatibilitas native |
| Codex | Ya, manifest | Belum ada catalog native | Tidak ada adapter Viserys khusus | Tidak terverifikasi | Skills-only |
