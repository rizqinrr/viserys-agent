```
.---------------------------------------------------------------.
|'||'  '|' '||'  .|'''.|  '||''''|  '||''|.   '||' '|'  .|'''.| |
| '|.  .'   ||   ||..  '   ||  .     ||   ||    || |    ||..  ' |
|  ||  |    ||    ''|||.   ||''|     ||''|'      ||      ''|||. |
|   |||     ||  .     '||  ||        ||   |.     ||    .     '|||
|    |     .||. |'....|'  .||.....| .||.  '|'   .||.   |'....|' |
'---------------------------------------------------------------'
```

# Viserys

Engineering workflow skills for AI coding agents.

Viserys is a self-contained pack of Markdown workflows, reviewer personas, and validation scripts. It gives an agent a consistent process across the full development lifecycle instead of letting it improvise on every task.

```
DEFINE -> PLAN -> BUILD -> VERIFY -> REVIEW -> SHIP
```

## What is inside

| Path | Contents |
|---|---|
| `skills/` | 28 `SKILL.md` workflows with steps, exit criteria, and anti-rationalization tables |
| `agents/` | 4 reviewer personas |
| `references/` | Shared checklists loaded on demand |
| `commands/` | Lifecycle command definitions |
| `evals/` | Eval cases and fixtures for the skills |
| `scripts/` | Validators and the eval runner |
| `hooks/` | Session lifecycle hooks |
| `docs/` | Internal documentation |

## Skills

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
| `get-schema` | An approved PRD exists and the database schema needs designing before implementation |
| `get-tasks` | An approved PRD or spec exists and needs executable task files |
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

## Personas

| Agent | Perspective |
|---|---|
| `agents/code-reviewer.md` | Five-axis review with a "would a staff engineer approve this?" standard |
| `agents/test-engineer.md` | Test strategy, coverage analysis, and the prove-it pattern |
| `agents/security-auditor.md` | Vulnerability detection, threat modeling, OWASP assessment |
| `agents/web-performance-auditor.md` | Core Web Vitals audit in quick and deep modes |

## Viserys mode in OpenCode

This repo ships an OpenCode agent definition at `.opencode/agent/viserys.md` and registers its skills through `.opencode/opencode.json`.

To activate it:

1. Clone this repository.
2. Open the repository folder with OpenCode.
3. Press `Tab` and select `viserys`.

The `viserys` agent runs in primary mode, so it appears in the agent list. Its prompt routes every request through the lifecycle skills and enforces the check-for-a-skill-first rule. The skill paths are registered by `.opencode/opencode.json`, so the pack's 28 skills load without any global configuration.

## Usage

**Skill-aware agents** (Claude Code, OpenCode, Cursor, and others): point the agent at `skills/`, or copy that directory into the agent's native skills location. The agent invokes a skill when a task matches.

**Plain context**: every skill is a standalone Markdown file. Read the relevant one and follow its process.

## Validation

```bash
node scripts/validate-skills.js
node scripts/validate-commands.js
node scripts/validate-artifact-paths.js
node scripts/validate-reference-links.js
node scripts/validate-versions.js
node scripts/run-evals.js
```

## Documentation

- `docs/README.md` — pack overview and lifecycle map
- `docs/skill-anatomy.md` — the `SKILL.md` format specification
- `evals/README.md` — how skill evaluation works
