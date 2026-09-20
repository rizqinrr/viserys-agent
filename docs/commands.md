# Command Catalog

Commands adalah prompt wrappers untuk workflow yang sering dipakai. Skills tetap dapat dipanggil otomatis atau disebut langsung walaupun tidak punya command.

## Availability

| Command | Claude Code | OpenCode repo adapter | OMP | Fungsi |
|---|---|---|---|---|
| `get-prd` | `/get-prd` | Automatic skill routing | Skill/direct prompt | Interview mendalam dan PRD |
| `get-schema` | `/get-schema` | Automatic skill routing | Skill/direct prompt | Desain database schema |
| `get-tasks` | `/get-tasks` | Automatic skill routing | Skill/direct prompt | Task files executable |
| `spec` | `/spec` | Automatic skill routing | Skill/direct prompt | Feature specification |
| `plan` | `/plan` | Automatic skill routing | Skill/direct prompt | Implementation plan |
| `build` | `/build` | Automatic skill routing | Skill/direct prompt | Incremental implementation |
| `test` | `/test` | Automatic skill routing | Skill/direct prompt | TDD dan verification |
| `review` | `/review` | Automatic skill routing | Specialist/direct prompt | Multi-axis review |
| `ship` | `/ship` | Automatic skill routing | Specialist/direct prompt | GO/NO-GO dan rollback |
| `constraints` | `/constraints` | Automatic skill routing | Skill/direct prompt | Quality constraints |
| `code-simplify` | `/code-simplify` | Automatic skill routing | Skill/direct prompt | Simplifikasi tanpa perubahan behavior |
| `webperf` | `/webperf` | Automatic skill routing | Specialist/direct prompt | Web performance audit |
| `get-design` | `/get-design` | `/get-design` | Prompt template | Design router dan anti-AI-slop workflow |

Adapter Gemini dan Antigravity juga tersedia dalam repository; command planning mereka bernama `/planning`, bukan `/plan`.

## Command behavior

### `/get-prd`

Melakukan interview, restate, gap check, dan approval sebelum menulis:

```text
docs/prd/<name>.md
```

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

Membuat:

```text
tasks/plan.md
tasks/todo.md
```

### `/build`

Mengimplementasikan task berikutnya secara incremental. `/build auto` menjalankan seluruh plan setelah approval tunggal, tetapi tetap mempertahankan test dan verification per task.

### `/test`

Menjalankan test-driven workflow atau prove-it test untuk bug.

### `/review`

Menjalankan `code-review-and-quality`. Ini berbeda dari persona `code-reviewer`: command adalah orchestrator prompt, persona adalah perspektif subagent yang hanya tersedia bila harness mendukungnya.

### `/ship`

Menjalankan pre-launch review. Pada harness dengan subagent support, command dapat fan-out ke `code-reviewer`, `security-auditor`, dan `test-engineer`, lalu menggabungkan laporan menjadi GO/NO-GO dan rollback plan.

### `/webperf`

Menjalankan web performance audit. Gunakan hanya untuk browser-facing applications.

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

Contoh:

```text
Gunakan debugging-and-error-recovery untuk melokalisasi test failure ini.
```

## Side effects dan gates

- Commands yang menghasilkan dokumen harus menunggu approval bila workflow skill mensyaratkannya.
- `/build` dapat membuat commit hanya bila user atau command contract mengizinkan.
- `/critique` dan `/audit` pada `get-design` bersifat read-only.
- `/ship` wajib menyertakan rollback plan sebelum verdict GO.
- Command availability bergantung pada harness adapter; skill tetap dapat digunakan tanpa command wrapper.
