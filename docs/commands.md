# Command Catalog

Commands adalah prompt wrappers untuk workflow yang sering dipakai. Skills tetap dapat dipanggil otomatis atau disebut langsung walaupun tidak memiliki command wrapper.

## Adapter contract

| Adapter | Directory | Format | Status |
|---|---|---|---|
| Claude Code | `.claude/commands/` | Markdown frontmatter + prompt | Plugin adapter |
| Gemini CLI | `.gemini/commands/` | TOML | Available, structurally tested |
| Antigravity | `commands/` | TOML | Available, structurally tested |
| OpenCode | `.opencode/command/` | Markdown | Optional; repository currently exposes `/get-design` |

`validate-commands.js` memeriksa command parity dan description sync antara tiga adapter utama. Prompt body boleh berbeda karena setiap harness memiliki syntax dan capability berbeda; invariant behavior harus tetap sama.

## Availability

| Command | Claude Code | Gemini CLI | Antigravity | OpenCode repo adapter | OMP/Codex |
|---|---|---|---|---|---|
| `get-prd` | `/get-prd` | `/get-prd` | `/get-prd` | Automatic routing | Skill/direct prompt |
| `get-schema` | `/get-schema` | `/get-schema` | `/get-schema` | Automatic routing | Skill/direct prompt |
| `get-tasks` | `/get-tasks` | `/get-tasks` | `/get-tasks` | Automatic routing | Skill/direct prompt |
| `spec` | `/spec` | `/spec` | `/spec` | Automatic routing | Skill/direct prompt |
| `plan` | `/plan` | `/planning` | `/planning` | Automatic routing | Skill/direct prompt |
| `build` | `/build` | `/build` | `/build` | Automatic routing | Skill/direct prompt |
| `test` | `/test` | `/test` | `/test` | Automatic routing | Skill/direct prompt |
| `review` | `/review` | `/review` | `/review` | Automatic routing | Specialist/direct prompt |
| `ship` | `/ship` | `/ship` | `/ship` | Automatic routing | Specialist/direct prompt |
| `constraints` | `/constraints` | `/constraints` | `/constraints` | Automatic routing | Skill/direct prompt |
| `code-simplify` | `/code-simplify` | `/code-simplify` | `/code-simplify` | Automatic routing | Skill/direct prompt |
| `webperf` | `/webperf` | `/webperf` | `/webperf` | Automatic routing | Specialist/direct prompt |
| `get-design` | `/get-design` | `/get-design` | `/get-design` | `/get-design` | Prompt template |

Runtime command availability depends on how the adapter directory is installed into the harness. Structural parity is not an end-to-end runtime guarantee.

## Command behavior

### `/get-prd`

Melakukan interview, restate, gap check, dan approval sebelum menulis:

```text
docs/prd/<name>.md
```

Setelah approval, hand off ke `/plan` atau `/planning`, yang menjalankan planning workflow melalui persona `strategist`.

### `/get-schema`

Menerjemahkan PRD approved menjadi schema document:

```text
docs/schema/<name>.md
```

### `/get-tasks`

Memecah PRD/spec menjadi task files dengan dependency, acceptance criteria, dan verification.

### `/spec`

Membuat specification untuk feature yang sudah cukup jelas. Jangan gunakan untuk aplikasi baru yang masih membutuhkan discovery mendalam; gunakan `/get-prd`.

### `/plan` atau `/planning`

Menjalankan `planning-and-task-breakdown` melalui persona `strategist` dan menghasilkan:

```text
tasks/plan.md
tasks/todo.md
```

Pass ini read-only sampai plan disetujui human. Built-in planner primitive milik harness dapat tetap tersedia, tetapi `strategist` adalah planner canonical Viserys.

### `/build`

Mengimplementasikan task berikutnya secara incremental. `/build auto` menjalankan seluruh plan setelah approval tunggal, tetapi tetap mempertahankan test dan verification per task.

### `/test`

Menjalankan test-driven workflow atau prove-it test untuk bug. Persona `prover` dapat digunakan bila explicit delegation tersedia.

### `/review`

Menjalankan `code-review-and-quality` lalu dispatch persona `maester` untuk review lima axis. Review mencakup staged, unstaged, dan untracked changes, atau fixed comparison point yang diberikan user.

1. Correctness
2. Readability
3. Architecture
4. Security
5. Performance

Taxonomy output canonical:

- **Critical** — blocks merge.
- **Required** — must address before merge.
- **Optional** — worth considering.
- **Nit** — minor and optional.

Claude plugin memakai scoped identifier `viserys:maester`. Pada harness lain, persona harus diregistrasikan sesuai mekanisme harness. Jika subagent/task capability tidak tersedia, gunakan prompt `agents/maester.md` dalam main context dan tandai hasil sebagai degraded single-context review.

### `/ship`

Menjalankan pre-launch fan-out. Empat persona wajib dijalankan paralel:

```text
maester + kingsguard + prover + chronicler
```

`artisan` ditambahkan hanya bila perubahan menyentuh UI/web. Main session menggabungkan laporan menjadi GO/NO-GO dan rollback plan. `/ship` tidak menjalankan `racer`; gunakan `/webperf` untuk measured web performance.

### `/webperf`

Menjalankan web performance audit melalui persona `racer`. Gunakan hanya untuk browser-facing applications. `racer` membedakan quick source analysis dari deep mode berbasis Lighthouse, CrUX, PageSpeed, atau DevTools evidence.

### `/get-design`

Router UI/design native Viserys:

```text
/get-design new dashboard
/get-design shape checkout
/get-design critique landing page
/get-design audit src/pages/Home.tsx
/get-design polish settings
/get-design layout dashboard
/get-design typeset docs
/get-design colorize pricing
/get-design harden checkout
```

Persona `artisan` dapat digunakan untuk specialist design perspective dan conditional `/ship` review.

Mode tersedia:

`new`, `shape`, `critique`, `audit`, `polish`, `layout`, `typeset`, `colorize`, `animate`, `bolder`, `quieter`, `distill`, `clarify`, `adapt`, `harden`, `onboard`, `optimize`, `delight`, `overdrive`, `document`, `extract`.

Tanpa mode, `/get-design` menampilkan rekomendasi berdasarkan konteks; command tidak memilih mode secara diam-diam.

## Skills tanpa command

Skill berikut biasanya dipilih oleh automatic routing atau dipanggil langsung:

```text
debugging-and-error-recovery
source-driven-development
doubt-driven-development
security-and-hardening
observability-and-instrumentation
documentation-and-adrs
```

## Invariant versus adapter-specific behavior

Invariant yang harus sama:

- command intent dan output contract;
- required persona dispatch;
- severity taxonomy;
- approval dan rollback gates;
- artifact paths;
- command description.

Adapter-specific:

- Markdown versus TOML syntax;
- `$ARGUMENTS` dan namespace plugin;
- cara custom subagent diekspos sebagai tool;
- fallback ketika harness tidak memiliki task/subagent capability.

## Side effects dan gates

- Commands yang menghasilkan dokumen harus menunggu approval bila workflow skill mensyaratkannya.
- `/build` dapat membuat commit hanya bila user atau command contract mengizinkan.
- `/review` menghasilkan report dan tidak mengedit code secara default.
- `/critique` dan `/audit` pada `get-design` bersifat read-only.
- `/ship` wajib menyertakan rollback plan sebelum verdict GO.
- Command availability bergantung pada adapter; skill tetap dapat digunakan tanpa command wrapper.
