---
description: Turn an approved PRD into tracked, verifiable task files and a plan
---

Invoke the viserys:get-tasks skill.

This skill converts an approved PRD into a tracked set of artifacts: one detailed task file per task, plus a plan document that indexes them and records design decisions, risks, and open questions.

Follow the skill's nine phases in order:

0. Locate the PRD — default to docs/prd/<name>.md; if several candidates exist, ask which one governs the work. If none exists, route the user to get-prd instead.
1. Read and extract — pull Objective, User Stories, Technical Decisions, Project Structure, Commands, Testing Strategy, Boundaries, Out of Scope, and Success Criteria. Flag gaps rather than inventing requirements.
2. Map the dependency graph — producer before consumer, no cycles, name the frontier and the parallel opportunities.
3. Slice vertically — tracer bullets, not horizontal layers. Wide refactors use expand, migrate, contract.
4. Write each task — one file per task under tasks/<name>/task-NN.md, numbered from 01 in dependency order.
5. Order, size, and checkpoint — high-risk early, prefactoring first, no task larger than L, no task over ~5 files, checkpoints every two to three tasks, final checkpoint maps to the PRD Success Criteria.
6. Write the plan document — tasks/<name>/plan.md with Overview, Architecture Decisions, Phases, Parallelization, Risks and Mitigations, Open Questions, and Task Index.
7. Quiz the user — show the breakdown table and ask about granularity, blocking edges, parallelization categories, and merge or split. Iterate until approved.
8. Write and verify — write the files, sync todowrite, and run the verification checks.

Planning is read-only. Do not edit source code during phases 0 through 7.

Do not write task files before the user approves the breakdown table. Do not overwrite an existing tasks/<name>/ directory with unchecked tasks without asking, and never bulk-close another plan's tracker items.

If the project designates an issue tracker, publish one item per task and declare the target in plan.md. Use one target, not both.

After approval, hand off to incremental-implementation and name the first task to start.
