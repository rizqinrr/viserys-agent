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

Engineering workflow pack untuk AI coding agents. Viserys memberi agent proses yang konsisten untuk mendefinisikan masalah, merencanakan pekerjaan, mengimplementasikan perubahan, memverifikasi hasil, melakukan review, dan menyiapkan release.

```text
DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP
```

Core Viserys terdiri dari Markdown dan validator Node.js, tanpa runtime aplikasi atau network dependency. Adapter harness, plugin installation, hooks, browser tooling, dan behavioral evals memiliki prerequisite masing-masing.

## Isi repository

- **29 skills** — workflow engineering dari requirements sampai shipping.
- **7 specialist personas** — planning, review, security, testing, performance, UI, dan dokumentasi.
- **13 command contracts** — tersedia untuk Claude Code, Gemini CLI, dan Antigravity.
- **7 shared checklists** — definition of done, security, testing, performance, dan orchestration.
- **Structural validators dan evals** — menjaga skill, command, persona, artifact path, reference, version, dan routing tetap konsisten.
- **Optional hooks** — automatic context injection untuk lifecycle yang mendukungnya.

## Quick start

| Harness | Mulai dari | Status |
|---|---|---|
| **OpenCode** | Buka repository, tekan `Tab`, pilih `viserys` | Project adapter tersedia; root personas tidak otomatis aktif |
| **Claude Code** | Install plugin dari checkout lokal | Plugin flow paling lengkap dan diuji di CI |
| **Gemini CLI** | Gunakan adapter di `.gemini/commands/` | 13 commands tersedia dan structurally tested; runtime E2E belum diverifikasi |
| **Antigravity** | Gunakan adapter di `commands/` | 13 commands tersedia dan structurally tested; runtime E2E belum diverifikasi |
| **OMP** | Copy/link skills, agents, dan prompts ke scope OMP | Native compatibility melalui struktur OMP |
| **Codex** | Gunakan manifest `.codex-plugin/plugin.json` | Skills-only pada level manifest |

Panduan setup dan batas dukungan: [`docs/installation.md`](docs/installation.md).

### OpenCode project scope

```text
1. Buka root repository ini dari OpenCode.
2. Tekan Tab.
3. Pilih agent viserys.
```

### Claude Code dari checkout lokal

```bash
claude plugin validate .
claude plugin marketplace add ./
claude plugin install viserys@viserys --scope user
```

## Cara memakai Viserys

### Automatic routing

Minta pekerjaan secara natural. Viserys memilih skill yang cocok dari intent:

```text
Bantu debug test yang gagal dan cari root cause-nya.
```

```text
Rancang API pagination yang backward-compatible.
```

### Direct skill invocation

Sebut skill bila workflow tertentu wajib digunakan:

```text
Gunakan spec-driven-development untuk mendefinisikan feature ini.
```

### Commands

| Tujuan | Claude Code | Gemini / Antigravity |
|---|---|---|
| Requirements mendalam | `/get-prd` | `/get-prd` |
| Database schema | `/get-schema` | `/get-schema` |
| Executable task files | `/get-tasks` | `/get-tasks` |
| Feature specification | `/spec` | `/spec` |
| Implementation plan | `/plan` | `/planning` |
| Incremental build | `/build` | `/build` |
| Test workflow | `/test` | `/test` |
| Code review via `maester` | `/review` | `/review` |
| Pre-launch fan-out | `/ship` | `/ship` |
| Web performance | `/webperf` | `/webperf` |
| UI/design workflow | `/get-design` | `/get-design` |

Command behavior dan adapter differences: [`docs/commands.md`](docs/commands.md).

## Workflow yang direkomendasikan

### Feature

```text
/spec → /plan → /build → /test → /review → /ship
```

### Aplikasi atau sistem baru

```text
/get-prd → /get-schema → /get-tasks → implementasi → /review → /ship
```

### UI atau redesign

```text
/get-design shape <target>
→ frontend-ui-engineering
→ browser-testing-with-devtools
→ /review
→ /webperf bila relevan
→ /ship
```

### Bug fix

```text
debugging-and-error-recovery
→ test-driven-development
→ /review
```

Recipes lengkap: [`docs/workflows.md`](docs/workflows.md).

## Personas

| Persona | Fokus |
|---|---|
| `strategist` | Full planning, dependency graph, task slicing, acceptance criteria |
| `maester` | Correctness, readability, architecture, security, performance |
| `kingsguard` | Threat modeling dan vulnerability detection |
| `prover` | Test strategy, coverage, dan prove-it pattern |
| `racer` | Core Web Vitals dan web performance |
| `artisan` | Product UI, visual hierarchy, accessibility, responsive behavior |
| `chronicler` | ADR, API docs, migration notes, changelog, release documentation |

`/ship` selalu menjalankan `maester`, `kingsguard`, `prover`, dan `chronicler` secara paralel; `artisan` ditambahkan hanya untuk perubahan UI/web. Persona behavior bergantung pada kemampuan subagent harness. Lihat [`docs/personas-and-orchestration.md`](docs/personas-and-orchestration.md).

## Skills

| Phase | Skills |
|---|---|
| **DEFINE** | `get-prd`, `idea-refine`, `interview-me`, `spec-driven-development`, `constraint-driven-development` |
| **PLAN** | `get-schema`, `get-tasks`, `planning-and-task-breakdown` |
| **BUILD** | `incremental-implementation`, `test-driven-development`, `context-engineering`, `source-driven-development`, `doubt-driven-development`, `get-design`, `frontend-ui-engineering`, `api-and-interface-design` |
| **VERIFY** | `browser-testing-with-devtools`, `debugging-and-error-recovery` |
| **REVIEW** | `code-review-and-quality`, `code-simplification`, `security-and-hardening`, `performance-optimization` |
| **SHIP** | `git-workflow-and-versioning`, `ci-cd-and-automation`, `deprecation-and-migration`, `documentation-and-adrs`, `observability-and-instrumentation`, `shipping-and-launch` |

Trigger, boundary, dan output tiap skill: [`docs/skills.md`](docs/skills.md).

## Repository map

| Path | Isi |
|---|---|
| `skills/` | 29 workflow skills dan per-skill references |
| `agents/` | 7 specialist persona prompts |
| `.claude/commands/` | Claude Code command adapters |
| `.gemini/commands/` | Gemini CLI command adapters |
| `commands/` | Antigravity command adapters; juga dideklarasikan oleh manifest Claude |
| `.opencode/` + `opencode.json` | OpenCode agent/command adapters dan root project config |
| `.claude-plugin/` | Claude plugin manifest |
| `.codex-plugin/` | Codex skills manifest |
| `docs/` | User, maintainer, dan adapter documentation |
| `references/` | Shared checklists dan orchestration guidance |
| `evals/` | Deterministic dan optional behavioral evals |
| `scripts/` | Structural validators, eval runner, dan tests |
| `hooks/` | Optional lifecycle hooks |

## Validation

```bash
node scripts/validate-skills.js
node scripts/validate-commands.js
node scripts/validate-personas.js
node scripts/validate-artifact-paths.js
node scripts/validate-reference-links.js
node scripts/validate-versions.js
node scripts/run-evals.js --min-rank1 95
node --test scripts/*-test.js scripts/lib/*-test.js
```

CI juga memvalidasi Claude plugin manifest dan installation flow. Detail validation contract: [`CONTRIBUTING.md`](CONTRIBUTING.md#validasi).

## Community

Butuh bantuan, ingin berdiskusi, atau berbagi pengalaman memakai Viserys? [Join Discord Viserys](https://discord.gg/WR6rg5YAy).

## Documentation

- [Documentation index](docs/README.md)
- [Installation dan support matrix](docs/installation.md)
- [Command catalog](docs/commands.md)
- [Workflow recipes](docs/workflows.md)
- [Skill catalog](docs/skills.md)
- [Personas dan orchestration](docs/personas-and-orchestration.md)
- [Hooks](docs/hooks.md)
- [Skill anatomy](docs/skill-anatomy.md)
- [Eval system](evals/README.md)
- [Contributing](CONTRIBUTING.md)

## License

Viserys dilisensikan di bawah [Apache License 2.0](LICENSE). Copyright 2026 rizqinrr.

Materi `get-design` mengadaptasi guidance Apache-2.0 dari Impeccable; atribusi upstream dipertahankan pada file adaptasi yang relevan.
