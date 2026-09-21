# Viserys Documentation

Viserys memisahkan dokumentasi pengguna, maintainer, adapter, dan authoring agar setiap fakta memiliki satu tempat canonical.

## Untuk pengguna

- [`../README.md`](../README.md) — overview, quick start, workflow, dan repository map.
- [`installation.md`](installation.md) — setup dan support matrix untuk OpenCode, Claude Code, Gemini CLI, Antigravity, OMP, dan Codex.
- [`commands.md`](commands.md) — command contract, availability, aliases, output, dan fallback.
- [`workflows.md`](workflows.md) — recipes untuk app baru, feature, bug, UI, API, security, dan release.
- [`skills.md`](skills.md) — katalog 29 skills dan trigger utama.
- [`personas-and-orchestration.md`](personas-and-orchestration.md) — tujuh personas, `/review`, `/ship`, dan fallback.
- [`hooks.md`](hooks.md) — optional lifecycle hooks dan prerequisite.

## Untuk contributor

- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — contribution workflow dan validation contract.
- [`skill-anatomy.md`](skill-anatomy.md) — format dan aturan penulisan `SKILL.md`.
- [`../evals/README.md`](../evals/README.md) — deterministic dan behavioral evals.
- [`../scripts/`](../scripts/) — structural validators dan regression tests.
- [`../references/`](../references/) — shared definition-of-done, testing, security, performance, dan orchestration references.

## Untuk maintainer adapter

- [Claude commands](../.claude/commands/) dan [plugin manifest](../.claude-plugin/plugin.json).
- [Gemini commands](../.gemini/commands/).
- [Antigravity commands](../commands/).
- [OpenCode adapter](../.opencode/), [root project config](../opencode.json), dan [primary agent](../.opencode/agents/viserys.md).
- [Codex manifest](../.codex-plugin/plugin.json).
- [Persona source](../agents/).

## Orchestration reference

- [`../references/orchestration-patterns.md`](../references/orchestration-patterns.md) — universal patterns, harness mapping, Claude-specific details, dan anti-patterns.

## Core model

```text
DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP
```

Skills memberi workflow, personas memberi specialist perspective, dan commands/main agent mengatur invocation serta orchestration.
