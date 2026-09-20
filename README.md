# Viserys

Engineering workflow pack untuk AI coding agents. Viserys membantu agent bekerja dengan alur yang konsisten:

```text
DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP
```

Viserys berisi 29 skills Markdown, reviewer personas, slash commands, shared checklists, dan validator. Core skills bersifat Markdown-only; adapter harness, hooks, browser tooling, dan behavioral evals punya kebutuhan tambahan masing-masing.

## Quick start

Pilih harness yang kamu gunakan:

| Harness | Status | Mulai dari |
|---|---|---|
| **OpenCode** | Project adapter lengkap; global setup manual | [OpenCode setup](docs/installation.md#opencode) |
| **Claude Code** | Plugin marketplace dan commands teruji di CI | [Claude Code setup](docs/installation.md#claude-code) |
| **OMP** | Skills/agents/commands kompatibel lewat folder user atau project | [OMP setup](docs/installation.md#omp) |
| **Codex** | Skills melalui plugin manifest | [Codex setup](docs/installation.md#codex) |

Untuk OpenCode project scope:

```text
1. Buka repository ini dari OpenCode.
2. Tekan Tab.
3. Pilih agent viserys.
```

Untuk Claude Code dari checkout lokal:

```bash
claude plugin marketplace add ./
claude plugin install viserys@viserys --scope user
```

Detail platform, global setup, update, dan batas dukungan ada di [`docs/installation.md`](docs/installation.md).

## Cara memakai skill

### 1. Automatic routing

Minta pekerjaan secara natural. Agent memilih skill yang cocok dari deskripsi skill:

```text
Bantu debug test yang gagal dan cari root cause-nya.
```

```text
Buat UI dashboard yang product-specific dan jangan menghasilkan AI slop.
```

Gunakan automatic routing ketika kamu ingin Viserys memilih workflow berdasarkan intent.

### 2. Direct skill invocation

Sebut skill secara eksplisit ketika workflow tertentu wajib dipakai:

```text
Gunakan spec-driven-development untuk mendefinisikan feature ini.
```

```text
Gunakan get-design critique untuk mengevaluasi landing page ini.
```

### 3. Slash commands

Command adalah shortcut untuk workflow yang sering dipakai. Contoh:

```text
/spec
/plan
/build
/test
/review
/ship
/get-prd
/get-schema
/get-tasks
/get-design critique landing page
```

Nama command dapat berbeda antar harness. Misalnya Claude memakai `/plan`, sedangkan adapter Gemini dan Antigravity memakai `/planning`. Lihat [command catalog](docs/commands.md).

### 4. Viserys mode di OpenCode dan OMP

Pada OpenCode, pilih primary agent `viserys` dengan `Tab`.

Pada OMP, aktifkan mode satu sesi dengan:

```text
/viserys hai
```

Setelah aktif, Viserys tetap menjadi orchestrator sampai sesi berakhir: memilih skill, menjalankan workflow, dan mendelegasikan pekerjaan ke specialist bila relevan.

## Workflow yang direkomendasikan

### Feature sederhana

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
→ /test
→ /review
```

Penjelasan lengkap dan output artifact ada di [`docs/workflows.md`](docs/workflows.md).

## Skills

### DEFINE

`get-prd`, `idea-refine`, `interview-me`, `spec-driven-development`, `constraint-driven-development`

### PLAN

`get-schema`, `get-tasks`, `planning-and-task-breakdown`

### BUILD

`incremental-implementation`, `test-driven-development`, `context-engineering`, `source-driven-development`, `doubt-driven-development`, `get-design`, `frontend-ui-engineering`, `api-and-interface-design`

### VERIFY

`browser-testing-with-devtools`, `debugging-and-error-recovery`

### REVIEW

`code-review-and-quality`, `code-simplification`, `security-and-hardening`, `performance-optimization`

### SHIP

`git-workflow-and-versioning`, `ci-cd-and-automation`, `deprecation-and-migration`, `documentation-and-adrs`, `observability-and-instrumentation`, `shipping-and-launch`

Katalog trigger, boundary, command wrapper, dan output tiap skill ada di [`docs/skills.md`](docs/skills.md).

## Personas

| Persona | Fokus |
|---|---|
| `code-reviewer` | Correctness, readability, architecture, security, performance |
| `test-engineer` | Test strategy, coverage, dan prove-it pattern |
| `security-auditor` | Threat modeling dan vulnerability detection |
| `web-performance-auditor` | Core Web Vitals dan web performance |

Persona berjalan sebagai subagent hanya pada harness yang mendukung mekanisme tersebut. Lihat [`docs/personas-and-orchestration.md`](docs/personas-and-orchestration.md).

## Repository structure

| Path | Isi |
|---|---|
| `skills/` | 29 workflow skills |
| `agents/` | Reviewer personas |
| `commands/` | Adapter commands |
| `.claude/commands/` | Claude Code commands |
| `.gemini/commands/` | Gemini CLI commands |
| `.opencode/` | OpenCode agent dan command adapter |
| `references/` | Shared checklists dan orchestration guidance |
| `evals/` | Trigger dan behavioral evals |
| `scripts/` | Structural validators dan eval runner |
| `hooks/` | Optional session lifecycle hooks |

## Validation

```bash
node scripts/validate-skills.js
node scripts/validate-commands.js
node scripts/validate-artifact-paths.js
node scripts/validate-reference-links.js
node scripts/validate-versions.js
node scripts/run-evals.js --min-rank1 95
node --test scripts/*-test.js scripts/lib/*-test.js
```

## Documentation

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

Viserys menggunakan lisensi repository yang berlaku. Materi `get-design` mengadaptasi guidance Impeccable dan menyertakan atribusi serta salinan lisensi upstream di [`NOTICE.md`](NOTICE.md) dan [`LICENSES/Apache-2.0-Impeccable.txt`](LICENSES/Apache-2.0-Impeccable.txt).
