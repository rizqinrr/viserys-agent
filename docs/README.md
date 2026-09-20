# Viserys Documentation

## Mulai menggunakan Viserys

- [`../README.md`](../README.md) — overview dan quick start.
- [`installation.md`](installation.md) — OpenCode, Claude Code, OMP, dan Codex.
- [`commands.md`](commands.md) — command catalog, availability, output, dan side effects.
- [`workflows.md`](workflows.md) — recipes untuk app baru, feature, bug, UI, API, dan release.
- [`skills.md`](skills.md) — katalog 29 skills dan trigger utamanya.
- [`personas-and-orchestration.md`](personas-and-orchestration.md) — personas, fan-out, dan fallback.
- [`hooks.md`](hooks.md) — optional hooks dan dependencies.

## Mengembangkan Viserys

- [`skill-anatomy.md`](skill-anatomy.md) — format dan aturan penulisan `SKILL.md`.
- [`../evals/README.md`](../evals/README.md) — deterministic dan behavioral evals.
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — contribution workflow dan validation commands.
- [`../references/orchestration-patterns.md`](../references/orchestration-patterns.md) — internal orchestration reference.

## Core model

```text
DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP
```

Skills memberi workflow, personas memberi perspektif, dan commands/main agent mengatur kapan workflow atau persona dijalankan.
