# Viserys

Viserys is a self-contained engineering workflow pack for AI coding agents. It packages the planning, decomposition, verification, and review discipline that senior engineers apply, so an agent follows the same process on every task instead of improvising.

The pack is plain Markdown plus a small set of validator scripts. It carries no runtime dependency and no network dependency.

## Contents

| Path | Purpose |
|---|---|
| `skills/` | 25 `SKILL.md` workflows with steps, exit criteria, and anti-rationalization tables |
| `agents/` | 4 reviewer personas (`code-reviewer`, `test-engineer`, `security-auditor`, `web-performance-auditor`) |
| `references/` | Shared checklists pulled in by skills only when needed |
| `commands/` | Lifecycle command definitions (`spec`, `plan`, `build`, `test`, `review`, `ship`, and more) |
| `evals/` | Eval cases and fixtures that verify each skill triggers and behaves correctly |
| `scripts/` | Structural validators and the eval runner |
| `hooks/` | Session lifecycle hooks |
| `docs/` | Internal documentation for this pack |
| `.opencode/` | OpenCode adapter: the `viserys` primary agent and skill path registration |

## Lifecycle

The skills map onto six phases:

```
DEFINE -> PLAN -> BUILD -> VERIFY -> REVIEW -> SHIP
```

| Phase | Skills |
|---|---|
| DEFINE | `idea-refine`, `interview-me`, `spec-driven-development`, `constraint-driven-development` |
| PLAN | `get-tasks`, `planning-and-task-breakdown` |
| BUILD | `incremental-implementation`, `test-driven-development`, `context-engineering`, `source-driven-development`, `doubt-driven-development`, `frontend-ui-engineering`, `api-and-interface-design` |
| VERIFY | `browser-testing-with-devtools`, `debugging-and-error-recovery` |
| REVIEW | `code-review-and-quality`, `code-simplification`, `security-and-hardening`, `performance-optimization` |
| SHIP | `git-workflow-and-versioning`, `ci-cd-and-automation`, `deprecation-and-migration`, `documentation-and-adrs`, `observability-and-instrumentation`, `shipping-and-launch` |

The `using-agent-skills` meta-skill decides which workflow applies to an incoming request.

## How to use

**With skill-aware agents** (Claude Code, OpenCode, Cursor, and others): point the agent at `skills/`, or copy the directory into the agent's native skills location. The agent then invokes a skill when the task matches.

**As plain context**: every skill is a standalone Markdown file. Read the relevant one and follow its process manually.

**Personas**: the files in `agents/` work as subagent definitions where the host supports them, or as reviewer prompts otherwise.

## Validating the pack

```bash
node scripts/validate-skills.js
node scripts/validate-commands.js
node scripts/validate-artifact-paths.js
node scripts/validate-reference-links.js
node scripts/validate-versions.js
```

## Evaluating the skills

```bash
node scripts/run-evals.js                        # deterministic trigger and collision checks
node scripts/run-evals.js --min-rank1 95         # enforce the routing floor
node scripts/run-evals.js --behavioral <skill>   # behavioral eval, spends tokens
```

See `docs/skill-anatomy.md` for the `SKILL.md` format, and `evals/README.md` for the eval tiers.
