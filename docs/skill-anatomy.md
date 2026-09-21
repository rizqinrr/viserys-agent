# Skill Anatomy

The single source of truth for how a `SKILL.md` file in this pack is structured.

## Location and naming

- One skill per directory: `skills/<kebab-case-name>/SKILL.md`.
- The directory name and the frontmatter `name` must match exactly.
- Names are lowercase, hyphen-separated, and describe the workflow, not the deliverable (`planning-and-task-breakdown`, not `planner`).
- Prefer a noun phrase that reads naturally when a user says it: "use the planning and task breakdown skill".

## Frontmatter

Every `SKILL.md` opens with YAML frontmatter containing exactly two fields:

```yaml
---
name: planning-and-task-breakdown
description: Breaks work into ordered tasks. Use when you have a spec or clear requirements and need to break work into implementable tasks. Use when a task feels too large to start, when you need to estimate scope, or when parallel work is possible.
---
```

### `name`

Must equal the directory name. Lowercase, hyphen-separated, no spaces.

### `description`

This is the only text the agent sees when deciding whether to load the skill, so it does the routing work.

- First sentence: what the skill does.
- Following sentences: `Use when ...` triggers written in the vocabulary a user would actually type.
- State the negative boundary where a nearby skill could collide.
- Keep it under roughly 1024 characters so it survives aggressive context compaction.

The description carries trigger vocabulary on purpose. The eval suite ranks prompts against descriptions, so a description missing the words users say is a false negative waiting to happen.

## Required sections

Sections appear in this order.

| Section | Contains |
|---|---|
| `# Title` | Human-readable name |
| `## Overview` | What the skill does and why it matters, one or two paragraphs |
| `## When to Use` | Triggering conditions as bullets, plus a **When NOT to use** line |
| `## The <Process>` | A level-two process/workflow section when the skill is sequential; reference-style skills may organize equivalent actionable guidance under domain sections |
| `## Common Rationalizations` | Two-column table: the excuse an agent makes, and the rebuttal |
| `## Red Flags` | Observable signs the skill is being skipped or misapplied |
| `## Verification` | Checklist of evidence required before the skill counts as complete |

A `## See Also` section at the end is optional and links to related references.

### Writing the Process section

- Number the steps. Each step is an action, not a description.
- Say what the output of each step is and where it lands.
- Include a template where the output has a fixed shape (a task record, a plan document, a report).
- Mark the point where the agent must stop and ask a human, if there is one.

### Writing the Rationalizations table

Every skill ends up fighting the same shortcuts, so name them directly. The left column is the sentence an agent tells itself; the right column is why it is wrong and what to do instead.

```markdown
| Rationalization | Reality |
|---|---|
| "I'll figure it out as I go" | That's how you end up with a tangled mess and rework. |
```

### Writing the Verification section

Verification is evidence, not confidence. Each item is something a reviewer could check without reading the agent's mind: a command that ran, a file that exists, a test that passed. "Looks right" is never a verification item.

## Supporting files

A skill is Markdown-only by default. Extend it only when the content does not belong inline.

| Path | When to add it | How it loads |
|---|---|---|
| `references/<topic>.md` | Detail too long or too situational for `SKILL.md` | Read on demand, linked from `SKILL.md` |
| `scripts/<name>.<ext>` | A runnable helper the skill invokes | Executed, never loaded into context |

Rules:

- Add a supporting file only when the `SKILL.md` grows past a comfortable read or repeats the same large block.
- Link it explicitly from `SKILL.md` so the agent knows it exists and when to open it.
- Scripts must be non-interactive and print what they did.

## Pack-level files

These live outside a skill directory and are shared by many skills:

| Path | Purpose |
|---|---|
| `references/definition-of-done.md` | The standing bar every change clears |
| `references/testing-patterns.md` | Test structure, naming, mocking, anti-patterns |
| `references/security-checklist.md` | Pre-commit and OWASP checks |
| `references/performance-checklist.md` | Core Web Vitals targets and measurement commands |
| `references/accessibility-checklist.md` | Keyboard, screen reader, ARIA, and visual checks |
| `references/observability-checklist.md` | Logging, metrics, tracing, alerting |
| `references/orchestration-patterns.md` | How personas and skills compose |

Skills reference these with a relative path, for example `../../references/definition-of-done.md`.

## Adding a skill

1. Confirm the workflow is not already covered by an existing skill. Prefer extending an existing skill over a near-duplicate.
2. Create `skills/<name>/SKILL.md` with the frontmatter and the required sections.
3. Add `evals/cases/<name>.json` with at least 3 positive triggers, 2 negative triggers, and 1 behavioral eval.
4. If the eval is `execution` kind, add its fixture under `evals/fixtures/<name>/`.
5. Update the phase/count summary in `README.md` when needed and the canonical skill catalog in `docs/skills.md`.
6. Run `node scripts/validate-skills.js` and `node scripts/run-evals.js`.

Missing case files, incomplete case counts, unknown `kind` values, invalid fixture paths, and absent required fixtures are validation errors, not warnings.

## Writing principles

- **Process, not prose.** A skill is a workflow to execute, not a document to read.
- **Specific.** Actionable steps beat general advice.
- **Verifiable.** Every skill ends with evidence requirements.
- **Minimal.** Include only what changes agent behavior. Cut anything an agent already does by default.
