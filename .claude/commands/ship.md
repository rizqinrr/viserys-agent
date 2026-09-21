---
description: Run the pre-launch checklist via parallel fan-out to specialist personas, then synthesize a go/no-go decision
---

Invoke the viserys:shipping-and-launch skill.

`/ship` is a **fan-out orchestrator**. It runs four core specialist personas in parallel against the current change, adds `artisan` when the change affects a web-facing interface, then merges their reports into a single go/no-go decision with a rollback plan.

## Phase A — Determine the fan-out

Always include:

1. **`viserys:maester`** — Run a five-axis review (correctness, readability, architecture, security, performance) on all staged, unstaged, and untracked changes, or the fixed comparison point supplied by the user.
2. **`viserys:kingsguard`** — Run a vulnerability and threat-model pass. Check OWASP Top 10, secrets handling, auth/authz, dependency CVEs.
3. **`viserys:prover`** — Analyze test coverage. Identify gaps in happy paths, edge cases, error paths, and concurrency scenarios.
4. **`viserys:chronicler`** — Review documentation readiness: public contracts, README, ADRs, changelog, compatibility, and migration notes.

Also include **`viserys:artisan`** when the change touches browser routes, UI components, CSS, design-system tokens, frontend accessibility, or responsive behavior. In `/ship`, `artisan` is review-only.

## Phase B — Parallel fan-out

Spawn all selected subagents concurrently using the Agent tool. Issue every Agent tool call in a single assistant turn so they execute in parallel. Each call uses the plugin-scoped identifier `viserys:<persona-name>` as `subagent_type`.

In harnesses without an Agent tool, apply each selected persona prompt separately in the main context, explicitly mark the process as degraded single-context review, and preserve independent passes before merging.

Constraints:
- Viserys personas do not delegate to other personas, even if the installed Claude version supports bounded nested delegation.
- Each subagent gets its own context and returns only its report.
- Keep the orchestration flat; the main session performs the merge.
- For collaborative investigation where teammates must challenge each other, use Agent Teams as documented in `references/orchestration-patterns.md`.

**Persona resolution.** Plugin personas use scoped identifiers (`viserys:<persona-name>`). Project or user agents with bare names are separate definitions and do not override those scoped identifiers; customize plugin behavior by editing/forking the plugin or by changing this command to invoke the desired project/user agent explicitly.

## Phase C — Merge in main context

Once all selected reports are back, the main agent synthesizes them:

1. **Code Quality** — Aggregate Critical/Required findings from `maester` and failing tests, lint, typecheck, or build output.
2. **Security** — Promote Critical/High `kingsguard` findings to launch blockers. Cross-reference `maester` without duplicating findings.
3. **Testing** — Treat missing proof for core behavior from `prover` as a release-readiness gap.
4. **Documentation** — Promote required public-contract, migration, or operational documentation from `chronicler`.
5. **UI and Accessibility** — When `artisan` ran, include its required visual, responsive, and accessibility findings. Otherwise verify applicable non-visual accessibility concerns directly.
6. **Performance** — Pull source-level concerns from `maester`; use `/webperf` and `racer` for a dedicated measured web-performance audit.
7. **Infrastructure** — Verify env vars, migrations, monitoring, feature flags, and rollback prerequisites directly.

## Phase D — Decision and rollback

Produce a single output:

```markdown
## Ship Decision: GO | NO-GO

### Blockers (must fix before ship)
- [Source persona: Critical/High finding + file:line]

### Recommended fixes (should fix before ship)
- [Source persona: Required/Medium finding + file:line]

### Acknowledged risks (shipping anyway)
- [Risk + mitigation]

### Rollback plan
- Trigger conditions: [signals that prompt rollback]
- Rollback procedure: [exact steps]
- Recovery time objective: [target]

### Specialist reports (full)
- [maester report]
- [kingsguard report]
- [prover report]
- [chronicler report]
- [artisan report, when applicable]
```

## Rules

1. All selected Phase B personas run in parallel, never sequentially when the harness supports parallel calls.
2. Personas do not call each other. The main agent merges their output.
3. The rollback plan is mandatory before any GO decision.
4. Any Critical finding defaults the verdict to NO-GO unless the user explicitly accepts the risk.
5. All four core personas run for every `/ship` invocation. Only `artisan` is conditional on UI/web scope.
