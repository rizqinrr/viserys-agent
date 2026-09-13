---
description: Break an approved PRD into ordered, verifiable task files
---

Invoke the viserys:get-tasks skill.

This skill turns an approved PRD into executable tasks: one detailed file per task, ordered by dependency, each with acceptance criteria, verification steps, and a rollback note.

Follow the skill's eight phases in order:

0. Locate the PRD — default to docs/prd/<name>.md; if several candidates exist, ask which one governs the work. If none exists, route the user to get-prd instead.
1. Read and extract — pull Objective, User Stories, Technical Decisions, Project Structure, Commands, Testing Strategy, Boundaries, Out of Scope, and Success Criteria. Flag gaps rather than inventing requirements.
2. Map the dependency graph — producer before consumer, no cycles, name the frontier and the parallel opportunities.
3. Slice vertically — tracer bullets, not horizontal layers. Wide refactors use expand, migrate, contract.
4. Write each task — one file per task under tasks/<name>/task-NN.md, numbered from 01 in dependency order.
5. Order, size, and checkpoint — high-risk early, prefactoring first, no task larger than L, checkpoints every two to three tasks, final checkpoint maps to the PRD Success Criteria.
6. Quiz the user — show the breakdown table and ask about granularity, blocking edges, and merge or split. Iterate until approved.
7. Write and verify — write the files, sync todowrite, and run the verification checks.

Do not write task files before the user approves the breakdown table. Do not overwrite an existing tasks/<name>/ directory with unchecked tasks without asking.

After approval, hand off to incremental-implementation and name the first task to start.
