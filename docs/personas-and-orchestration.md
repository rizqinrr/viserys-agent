# Personas and Orchestration

Skills menentukan **bagaimana** pekerjaan dilakukan. Personas menentukan **perspektif siapa** yang melakukan review atau analisis. Commands/main agent menentukan **kapan** beberapa persona dijalankan.

## Personas

| Persona | Fokus | Default posture |
|---|---|---|
| `code-reviewer` | Correctness, readability, architecture, security, performance | Read-only review |
| `test-engineer` | Test strategy, coverage gaps, prove-it tests | Review atau test authoring |
| `security-auditor` | Threat boundaries, exploitability, OWASP | Read-only security pass |
| `web-performance-auditor` | Core Web Vitals, loading, rendering, network | Quick/deep audit |

## Direct invocation

Jika harness mendukung named subagents, panggil persona dengan nama exact:

```text
Use the code-reviewer subagent to review the current branch.
```

```text
Use the security-auditor to inspect the authentication changes.
```

## Parallel fan-out

`/ship` menggunakan pola fan-out:

```text
main session
├── code-reviewer
├── security-auditor
└── test-engineer
```

Ketiga persona bekerja independen. Main session menggabungkan report, menghapus duplikasi, dan menetapkan GO/NO-GO serta rollback plan.

Aturan:

- Personas tidak memanggil persona lain.
- Main session adalah orchestrator.
- Independent reviews dijalankan paralel bila harness mendukungnya.
- Small/trivial changes tidak perlu fan-out penuh.
- Findings Critical/High menjadi launch blockers kecuali risk diterima eksplisit.

## Harness support

| Harness | Persona behavior |
|---|---|
| Claude Code | Plugin personas dan fan-out paling lengkap |
| OpenCode | `agents/` root tidak otomatis menjadi OpenCode subagents; copy/adapt ke `.opencode/agents/` bila diperlukan |
| OMP | Copy persona Markdown ke `.omp/agents/` atau user agent directory |
| Codex | Persona adapter belum terverifikasi; gunakan skills atau review prompt langsung |

## Commands versus personas

- `/review` menjalankan workflow `code-review-and-quality`; ia bukan jaminan bahwa persona `code-reviewer` di-spawn pada setiap harness.
- `/test` menjalankan `test-driven-development`; persona `test-engineer` digunakan ketika explicit delegation atau orchestration membutuhkannya.
- `/webperf` ditujukan untuk `web-performance-auditor` pada harness yang mendukung persona.
- `/ship` adalah command utama untuk fan-out multi-persona.

## Fallback

Jika harness tidak menyediakan subagent/task capability:

1. Main agent memuat persona prompt yang relevan.
2. Jalankan perspektif secara terpisah dan jangan saling meng-anchor.
3. Tandai bahwa review berjalan dalam degraded single-context mode.
4. Gabungkan hasil dengan format output yang sama.

Referensi internal lebih detail: [`../references/orchestration-patterns.md`](../references/orchestration-patterns.md).
