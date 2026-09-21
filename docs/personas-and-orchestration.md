# Personas and Orchestration

Skills menentukan **bagaimana** pekerjaan dilakukan. Personas menentukan **perspektif siapa** yang melakukan planning, review, atau analisis. Commands/main session menentukan **kapan** persona dijalankan dan bagaimana hasilnya digabungkan.

## Universal rules

- User atau command adalah orchestrator.
- Persona tidak memanggil persona lain.
- Main session melakukan merge ketika beberapa report dikumpulkan.
- Skills tetap menjadi workflow wajib di dalam persona atau command.
- Subagent fallback harus diberi label degraded single-context bila harness tidak mendukung task/subagent capability.

## Canonical personas

| Persona | Fokus | Default posture |
|---|---|---|
| `strategist` | Full planning, dependency graph, task slicing, acceptance criteria | Read-only planning |
| `maester` | Correctness, readability, architecture, security, performance | Read-only review |
| `kingsguard` | Threat boundaries, exploitability, OWASP | Read-only security pass |
| `prover` | Test strategy, coverage gaps, prove-it tests | Review atau test authoring |
| `racer` | Core Web Vitals, loading, rendering, network | Quick/deep audit |
| `artisan` | Product UI, visual hierarchy, accessibility, responsive behavior | Design/review; read-only dalam `/ship` |
| `chronicler` | ADR, API docs, migration notes, changelog, release documentation | Documentation review atau authoring |

## Direct invocation

Jika harness mendukung named subagents, gunakan nama exact:

```text
Use the strategist subagent to turn this approved spec into an executable plan.
```

```text
Use the maester subagent to review the current branch.
```

```text
Use the kingsguard to inspect the authentication changes.
```

## `/review` — single-persona review

`/review` menjalankan workflow `code-review-and-quality`, kemudian dispatch `maester` dengan context perubahan dan spec/task yang relevan.

Flow canonical:

```text
/review → code-review-and-quality → maester → structured report
```

Output menggunakan severity:

- `Critical`
- `Required`
- `Optional`
- `Nit`

Jika subagent tidak tersedia, main session menerapkan prompt `maester` secara terpisah dan menandai hasil sebagai degraded single-context review.

## `/ship` — parallel fan-out with merge

Empat persona inti selalu dijalankan paralel:

```text
main session
├── maester
├── kingsguard
├── prover
└── chronicler
```

`artisan` conditional:

```text
main session
├── maester
├── kingsguard
├── prover
├── chronicler
└── artisan (hanya bila perubahan menyentuh UI/web)
```

`artisan` digunakan bila diff menyentuh browser route, UI component, CSS, design-system token, frontend accessibility, atau responsive behavior. `racer` tidak masuk `/ship`; gunakan `/webperf` untuk audit web performance khusus.

Main session menggabungkan report, menghapus duplikasi, menetapkan GO/NO-GO, dan wajib menyertakan rollback plan.

## Planning

`strategist` adalah planner canonical Viserys:

```text
/plan atau /planning → planning-and-task-breakdown → strategist → tasks/plan.md + tasks/todo.md
```

Built-in planner primitive milik harness tetap dapat tersedia, tetapi workflow Viserys mengarahkan planning melalui `strategist`.

## Harness mapping

| Harness | Persona behavior | Status |
|---|---|---|
| Claude Code | Plugin personas, `/review`, `/ship`, dan Agent Teams | Paling lengkap |
| Gemini CLI | Root personas dan TOML command adapters bila custom-agent support tersedia | Available, structurally tested; runtime E2E belum diverifikasi |
| Antigravity | Root personas dan TOML command adapters bila custom-agent support tersedia | Available, structurally tested; runtime E2E belum diverifikasi |
| OpenCode | Root `agents/` tidak otomatis menjadi subagents; hanya `.opencode/agents/viserys.md` primary adapter disediakan | Skills/routing adapter; persona root manual |
| OMP | Copy persona Markdown ke scope OMP | Native compatibility |
| Codex | Persona adapter belum terverifikasi | Skills-only |

## Fallback

Jika harness tidak menyediakan subagent/task capability:

1. Main session memuat prompt persona yang relevan.
2. Jalankan setiap perspective secara terpisah agar tidak saling meng-anchor.
3. Tandai output sebagai degraded single-context review/planning.
4. Gabungkan hasil dengan format output canonical.

Detail pattern dan batas harness: [`../references/orchestration-patterns.md`](../references/orchestration-patterns.md).
