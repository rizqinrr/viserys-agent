# AGENTS.md

Guidance for AI coding agents working in the `viserys` repository.

---

## 0. Distribution Preference (read this first)

When the user mentions Viserys, asks how to activate it, or asks whether it works in another project, do NOT assume. Follow these steps:

1. **Check the global scope.** Look for an agent file at any of:
   - `~/.config/opencode/agent/viserys.md`
   - `~/.config/opencode/agents/viserys.md`

2. **If it does not exist**, explain that there are two ways to use Viserys, then **ask the user which they want**:
   - **Project scope** — already active automatically. In this repository, press `Tab` and select `viserys`. Nothing to install.
   - **Global scope** — copy `.opencode/agent/viserys.md` into `~/.config/opencode/agent/`, and register `skills.paths` in the user's global config. This activates Viserys in every project the user opens.

3. **If the user chooses global scope**, print the exact commands for them to run. Do **not** modify the user's global configuration yourself unless they explicitly ask you to.

4. **Never touch configuration outside this repository** without explicit permission.

If the global agent already exists, say so and confirm it is active. Do not offer to reinstall it.

---

## 1. Identity

`viserys` is a self-contained engineering workflow pack for AI coding agents. It packages the planning, decomposition, verification, and review discipline that senior engineers apply, so an agent follows the same process on every task instead of improvising.

- Version: `0.1.0`
- Plain Markdown plus a small set of validator scripts
- No runtime dependency, no network dependency
- 25 skills, 4 personas, 7 shared checklists

The pack does not generate code by itself. It gives agents a process. Your job when working here is to keep that process intact and consistent.

---

## 2. Repository Structure

| Path | Purpose |
|---|---|
| `skills/` | 25 `SKILL.md` workflows, plus per-skill `references/` and `scripts/` where needed |
| `agents/` | 4 reviewer personas (not active in OpenCode — see section 7) |
| `references/` | 7 shared checklists pulled in by skills on demand |
| `.claude/commands/` | 9 slash commands (Claude Code adapter) |
| `commands/` | 9 TOML commands (Antigravity adapter) |
| `.gemini/commands/` | 9 TOML commands (Gemini CLI adapter) |
| `.opencode/` | OpenCode adapter: the `viserys` primary agent and `skills.paths` registration |
| `.claude-plugin/`, `.codex-plugin/`, `.agents/plugins/` | Plugin and marketplace manifests for other harnesses |
| `evals/` | 25 eval cases and their fixtures |
| `scripts/` | 5 structural validators, the eval runner, and their test suites |
| `hooks/` | Session lifecycle hooks (Claude Code) |
| `docs/` | `README.md` (pack overview) and `skill-anatomy.md` (the `SKILL.md` spec) |
| `tasks/` | Internal working documents, not tracked in git |

`plugin.json` at the root is the generic plugin manifest. The harness-specific manifests live inside their adapter directories.

---

## 3. Lifecycle and Skills

The skills map onto six phases:

```
DEFINE -> PLAN -> BUILD -> VERIFY -> REVIEW -> SHIP
```

### DEFINE

| Skill | Use when |
|---|---|
| `idea-refine` | A concept is still vague and needs structured exploration |
| `interview-me` | The ask is underspecified and requirements must be extracted one question at a time |
| `spec-driven-development` | Starting a project, feature, or significant change with no spec yet |
| `constraint-driven-development` | No quality bar is written down, or checks are being silenced to get green |

### PLAN

| Skill | Use when |
|---|---|
| `planning-and-task-breakdown` | You have a spec and need ordered, verifiable tasks with acceptance criteria |

### BUILD

| Skill | Use when |
|---|---|
| `incremental-implementation` | A change touches more than one file and should land in thin slices |
| `test-driven-development` | Implementing logic, fixing a bug, or changing behavior |
| `context-engineering` | Setting up a session, switching tasks, or output quality drops |
| `source-driven-development` | Correctness depends on current official documentation |
| `doubt-driven-development` | Stakes are high and a confident answer is cheaper to verify now than to debug later |
| `frontend-ui-engineering` | Building or modifying user-facing interfaces |
| `api-and-interface-design` | Designing APIs, module boundaries, or public interfaces |

### VERIFY

| Skill | Use when |
|---|---|
| `browser-testing-with-devtools` | Building or debugging anything that runs in a browser |
| `debugging-and-error-recovery` | A test fails, a build breaks, or behavior is unexpected |

### REVIEW

| Skill | Use when |
|---|---|
| `code-review-and-quality` | Before merging any change |
| `code-simplification` | Code works but is harder to read or maintain than it should be |
| `security-and-hardening` | Handling user input, auth, data storage, or external integrations |
| `performance-optimization` | Performance requirements exist or a regression is suspected |

### SHIP

| Skill | Use when |
|---|---|
| `git-workflow-and-versioning` | Making any code change |
| `ci-cd-and-automation` | Setting up or modifying build and deploy pipelines |
| `deprecation-and-migration` | Removing old systems or migrating users |
| `documentation-and-adrs` | Recording architectural decisions or changing public APIs |
| `observability-and-instrumentation` | Adding logging, metrics, tracing, or alerting |
| `shipping-and-launch` | Preparing to deploy to production |

### Meta

| Skill | Use when |
|---|---|
| `using-agent-skills` | Deciding which workflow applies to the current request |

When multiple skills apply, follow lifecycle order. Not every task needs every skill.

---

## 4. Skill Conventions

- One skill per directory: `skills/<kebab-case-name>/SKILL.md`.
- The directory name and the frontmatter `name` must match exactly.
- Frontmatter requires exactly two fields: `name` and `description`.
- The `description` carries the routing load. It must state what the skill does, then `Use when ...` triggers in the vocabulary a user would actually type.
- Required sections, in order: `# Title`, `## Overview`, `## When to Use`, `## The <Process>`, `## Common Rationalizations`, `## Red Flags`, `## Verification`.
- A skill is Markdown-only by default. Add `references/` or `scripts/` only when content does not belong inline.
- Skills link shared checklists with a relative path: `../../references/<file>.md`.

The full specification lives in `docs/skill-anatomy.md`. Read it before writing or restructuring a skill. Do not restate it here.

---

## 5. Adding a Skill

1. Confirm the workflow is not already covered by an existing skill. Prefer extending an existing skill over adding a near-duplicate.
2. Create `skills/<name>/SKILL.md` with the frontmatter and the required sections.
3. Add `evals/cases/<name>.json` with at least 3 positive triggers, 2 negative triggers, and 1 behavioral eval.
4. If the eval `kind` is `execution`, add its fixture under `evals/fixtures/<name>/`.
5. Update the skill list in `README.md` and `docs/README.md`.
6. Run `node scripts/validate-skills.js` and `node scripts/run-evals.js`.

Missing case files, incomplete case counts, unknown `kind` values, invalid fixture paths, and absent required fixtures are validation errors, not warnings.

---

## 6. Validation

Run these before declaring any change complete:

```bash
node scripts/validate-skills.js
node scripts/validate-commands.js
node scripts/validate-artifact-paths.js
node scripts/validate-reference-links.js
node scripts/validate-versions.js
node scripts/run-evals.js
```

Notes:

- `validate-versions.js` reads `git describe --tags --abbrev=0` and compares it to the `version` field in every manifest. Tags must have **no** `v` prefix (use `0.1.0`, not `v0.1.0`).
- `run-evals.js` is the free, deterministic Tier-2 check. `--behavioral` spends tokens and runs only on request.
- Every validator has a matching `*-test.js` suite under `scripts/`.

---

## 7. Hard Boundaries

- Do not modify files outside this repository without explicit permission.
- Do not run `git push` unless the user asks.
- Do not delete or restructure `docs/`, `evals/`, or `scripts/` without being asked.
- Do not modify a user's global OpenCode configuration without explicit permission.
- Do not commit secrets, API keys, or tokens.

### Note on personas

The four files in `agents/` (`code-reviewer`, `test-engineer`, `security-auditor`, `web-performance-auditor`) are **not active** in OpenCode. OpenCode discovers agents under `.opencode/agent/`, not `agents/`, and these files also lack an explicit `mode: subagent` field. They are Markdown reviewer prompts, usable by copying them into a supported location. Do not assume they can be invoked as subagents.

### Note on `tasks/`

`tasks/` holds internal working documents and is not tracked in git. Do not treat its contents as pack documentation, and do not reference it from `README.md` or `docs/`.
