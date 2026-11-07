# AGENTS.md

Guidance for AI coding agents working in the `viserys` repository.

---

## 0. Distribution Preference (read this first)

When the user mentions Viserys, asks how to activate it, or asks whether it works in another project, do NOT assume. Follow these steps:

1. **Check the global scope.** Look for an agent file at:
   - `~/.config/opencode/agents/viserys.md`

2. **If it does not exist**, explain that there are two ways to use Viserys, then **ask the user which they want**:
   - **Project scope** — already active automatically. In this repository, press `Tab` and select `viserys`. Nothing to install.
   - **Global scope** — copy `.opencode/agents/viserys.md` into `~/.config/opencode/agents/`, and register `skills.paths` in the user's global config. This activates Viserys in every project the user opens.

3. **If the user chooses global scope**, print the exact commands for them to run. Do **not** modify the user's global configuration yourself unless they explicitly ask you to.

4. **Never touch configuration outside this repository** without explicit permission.

If the global agent already exists, say so and confirm it is active. Do not offer to reinstall it.

---

## 1. Identity

`viserys` is a self-contained engineering workflow pack for AI coding agents. It packages the planning, decomposition, verification, and review discipline that senior engineers apply, so an agent follows the same process on every task instead of improvising.

- Version: `0.1.0`
- Plain Markdown plus a small set of validator scripts
- Core skills have no runtime or network dependency; adapters, hooks, browser tooling, and installation flows may have prerequisites
- 3 core skills, 7 personas, 7 shared checklists

The pack does not generate code by itself. It gives agents a process. Your job when working here is to keep that process intact and consistent.

---

## 2. Repository Structure

| Path | Purpose |
|---|---|
| `skills/` | 3 core `SKILL.md` workflows (`get-prd`, `get-tasks`, `get-design`), plus per-skill `references/` where needed |
| `agents/` | 7 specialist personas (not active in OpenCode — see section 7) |
| `references/` | 7 shared checklists pulled in by skills on demand |
| `.claude/commands/` | Slash commands (Claude Code adapter) |
| `commands/` | TOML commands (Antigravity adapter) |
| `.gemini/commands/` | TOML commands (Gemini CLI adapter) |
| `.opencode/` + `opencode.json` | OpenCode primary agent/command adapters plus root project config for instructions and `skills.paths` |
| `.claude-plugin/`, `.codex-plugin/`, `.agents/plugins/` | Plugin and marketplace manifests for other harnesses |
| `evals/` | Eval cases and fixtures for the active skills |
| `scripts/` | Structural validators, the eval runner, and their test suites |
| `hooks/` | Session lifecycle hooks (Claude Code) |
| `docs/` | Installation, commands, workflows, skills, personas, hooks, and skill-authoring documentation |
| `tasks/` | Generated task artifacts, ignored by git |

`plugin.json` at the root is the generic plugin manifest. The harness-specific manifests live inside their adapter directories.

---

## 3. Core Lifecycle and Skills

The engineering workflow centers on three focused, user-friendly skills producing clear markdown artifacts:

```
get-prd (docs/PRD.md) ──→ get-tasks (tasks/*.md) ──→ get-design (docs/design.md)
```

| Skill | Deliverable | Use when |
|---|---|---|
| `get-prd` | `docs/PRD.md` | Starting a new application, system, or feature. Conducts a deep structured interview covering problem definition, intent extraction, constraints, and core data entities. |
| `get-tasks` | `tasks/<feature>/plan.md` & `task-*.md` | An approved PRD exists. Decomposes requirements into vertical slices with explicit dependency ordering, acceptance criteria, and TDD verification gates. |
| `get-design` | `docs/design.md` | Establishing UI/UX aesthetics, design tokens, responsive breakpoints, component states, and an anti-AI-slop visual point of view before implementation. |

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
5. Update the phase/count summary in `README.md` when needed and the canonical catalog in `docs/skills.md`.
6. Run `node scripts/validate-skills.js` and `node scripts/run-evals.js --min-rank1 95`.

Missing case files, incomplete case counts, unknown `kind` values, invalid fixture paths, and absent required fixtures are validation errors, not warnings.

---

## 6. Validation

Run these before declaring any change complete:

```bash
node scripts/validate-skills.js
node scripts/validate-commands.js
node scripts/validate-personas.js
node scripts/validate-artifact-paths.js
node scripts/validate-reference-links.js
node scripts/validate-versions.js
node scripts/run-evals.js --min-rank1 95
node --test scripts/*-test.js scripts/lib/*-test.js
```

Notes:

- `validate-versions.js` reads `git describe --tags --abbrev=0` and compares it to the `version` field in every manifest. Tags must have **no** `v` prefix (use `0.1.0`, not `v0.1.0`).
- `run-evals.js` is the free, deterministic Tier-2 check. `--behavioral` spends tokens and runs only on request.
- Structural validators are covered by regression suites under `scripts/` and `scripts/lib/`; `validate-skills.js` uses `scripts/lib/skill-lint-test.js`.
- The canonical local/CI validation matrix lives in `CONTRIBUTING.md#validasi`.

---

## 7. Hard Boundaries

- Do not modify files outside this repository without explicit permission.
- Do not install, copy, or implement Viserys skills, personas, or configurations into local Antigravity settings (`~/.gemini/config/`) or other local agent environments; Viserys is an independent product being developed for publishing.
- Do not run `git push` unless the user asks.
- Do not delete or restructure `docs/`, `evals/`, or `scripts/` without being asked.
- Do not modify a user's global OpenCode configuration without explicit permission.
- Do not commit secrets, API keys, or tokens.

### Note on personas

The seven files in `agents/` (`maester`, `kingsguard`, `prover`, `racer`, `strategist`, `artisan`, `chronicler`) are **not active** in OpenCode. OpenCode discovers project agents under `.opencode/agents/`, not root `agents/`, and these files also lack an explicit `mode: subagent` field. They are Markdown persona prompts, usable by copying them into a supported location. Do not assume they can be invoked as subagents.

### Note on `tasks/`

`tasks/` holds internal working documents and is not tracked in git. Do not treat its contents as pack documentation, and do not reference it from `README.md` or `docs/`.
