---
name: get-tasks
description: Breaks an approved PRD into ordered, independently verifiable tasks. Use when a PRD or spec exists and you need an executable task breakdown. Use when the user says "get tasks", "breakdown PRD", "pecah jadi task", or "bikin task list". Produces one detailed file per task with acceptance criteria, validation steps, dependencies, and rollback.
---

# Get Tasks

## Overview

`get-tasks` converts an approved PRD into an executable set of tasks. Each task is written to its own file, sized to fit a single focused session, ordered by dependency, and shipped with acceptance criteria, validation steps, a blocking list, and a rollback procedure.

The reason this exists as its own skill: **a PRD is not a plan**. A PRD states what the system does and why. It says nothing about the order of work, what can be built in parallel, where the risky parts are, or how to prove a slice is done. Turning a PRD straight into code produces either a heroic single-pass change or an arbitrary order that breaks halfway.

`get-tasks` supplies the missing layer. It reads the PRD, maps the real dependency structure, cuts the work into vertical slices, and writes each slice as a standalone artifact that an agent (or a human) can pick up without re-reading the whole PRD.

This skill draws from three sources:

1. **Dependency-first decomposition and vertical slicing** — build a dependency graph, slice vertically rather than horizontally, size each task, and place checkpoints. This is what makes the order correct.
2. **Validation-driven execution** — every task declares how it will be verified across multiple validation types, not just "tests pass", and carries a replan procedure for when a step fails.
3. **Blocking edges and tracer bullets** — each task states explicitly what blocks it, so any task whose blockers are done can start immediately.

The output is a directory of task files: `tasks/<name>/task-01.md`, `task-02.md`, and so on, numbered in dependency order. Blocker tasks get the low numbers.

## When to Use

Use this skill when:

- A PRD, spec, or requirement document exists and the work needs to become executable tasks
- The user says "get tasks", "breakdown PRD", "pecah jadi task", "bikin task list", or "turn this into tasks"
- A task feels too large to start and needs decomposing
- You need to estimate scope, order the work, or find what can run in parallel
- You are about to implement something that touches more than a handful of files and no task list exists

**When NOT to use:**

- No PRD or spec exists yet — run `get-prd` first, or `spec-driven-development`, then come back
- The change is a single task by any measure (one file, one obvious edit) — just do it
- The user wants tasks and then immediate execution in one breath — still run this skill, but hand off to `incremental-implementation` at the end rather than implementing inside `get-tasks`
- A task list already exists and the user wants to execute it — go straight to `incremental-implementation`

## The Process

`get-tasks` runs in eight phases. Each phase has an exit condition. Do not advance past a phase whose exit condition is unmet.

```
0. Locate the PRD       -> which document is the source?
1. Read and extract     -> what does the PRD commit us to?
2. Dependency graph     -> what depends on what?
3. Vertical slices      -> tracer bullets, not horizontal layers
4. Write each task      -> one file per task, fully specified
5. Order, size, checkpoint -> sequence, size, and verification gates
6. Quiz the user        -> granularity, blocking edges, merge or split
7. Write and verify     -> files on disk, todos synced, validators green
```

---

### Phase 0: Locate the PRD

Find the source document before doing anything else.

1. **Convention first.** `get-prd` saves to `docs/prd/<name>.md`. Look there first.
2. **Then the wider search.** If `docs/prd/` is empty, look for `SPEC.md`, `docs/SPEC.md`, or a PRD the user names. Accept a spec, an issue body, or a pasted requirements document — the skill is not format-bound, only the extraction in Phase 1 assumes the PRD section names.
3. **If more than one candidate exists**, do not guess. List them and ask which one governs this work.
4. **If none exists**, stop and say so. Do not invent requirements. Route the user to `get-prd` (for a full interview-to-PRD pass) or `spec-driven-development` (for a spec).

Record the exact path you are working from. Every later phase references it.

For a **multi-module initiative** where the PRD is split by module id (`docs/prd/identity.md`, `docs/prd/billing.md`), confirm which module this breakdown covers. One breakdown per module, in the build order the capability map declared.

**Exit condition:** a single source document is identified, and its path is on the record.

---

### Phase 1: Read and Extract

Read the PRD in full. Then extract, explicitly, the material that drives decomposition:

| PRD section | What you extract from it |
|---|---|
| Objective | The end state every task ultimately serves |
| User Stories | The observable behaviours that must work, candidate acceptance criteria |
| Technical Decisions | Modules, interfaces, schema changes, contracts — these define real boundaries between tasks |
| Project Structure | Where artifacts land, which constrains "files likely touched" |
| Commands | The concrete verification commands each task will cite |
| Testing Strategy | What counts as a good test here, and where tests belong |
| Boundaries | Always / Ask First / Never — Never items become hard constraints on every task |
| Out of Scope | Explicit non-goals; nothing here becomes a task |
| Success Criteria | The final gate; the last checkpoint verifies against it |

Rules:

- **Do not start slicing yet.** Extraction first, decomposition second. Slicing while reading produces tasks shaped by the order you happened to read the document in.
- **Convert vague items into checkable statements.** If the PRD says "the dashboard should be fast", the task's acceptance criterion is a number, and if the PRD gave no number, surface it as a blocker rather than choosing one silently.
- **Flag gaps.** If a Needed section is missing or empty, name it. A missing Testing Strategy means every task's verification block will be invented later; raise it now.
- **Never invent requirements.** If the PRD does not say it, it is not a task.

**Exit condition:** the extraction table is populated, and any gap has been raised with the user.

---

### Phase 2: Map the Dependency Graph

Before writing a single task, map what depends on what. This is the phase that determines the order and prevents the most expensive class of mistake: building a consumer before its producer exists.

Draw the graph. Concrete, not abstract:

```
Database schema
    |
    +-- API models and types
    |       |
    |       +-- API endpoints
    |       |       |
    |       |       +-- Frontend API client
    |       |               |
    |       |               +-- UI components
    |       |
    |       +-- Validation logic
    |
    +-- Seed data and migrations
```

Rules:

- **Edges point producer to consumer.** An arrow means "the target needs the source first".
- **No cycles.** If two things each need the other, they are one task, or the interface between them must be defined first as its own task.
- **Interfaces are boundaries.** When two tasks meet at a contract (a type, an endpoint shape, a schema), define the contract in the earlier task and consume it in the later one. Never let both tasks invent it independently.
- **Find the frontier.** The frontier is every task whose blockers are all done. It is what can start now. For a linear chain the frontier is one task wide; for a wide project it may be several.
- **Name the parallel opportunities and the hard sequences.** Independent slices can run in parallel. Migrations, shared state changes, and anything touching the same contract must be sequential.

**Exit condition:** a dependency graph exists, with a clear frontier, and no cycles.

---

### Phase 3: Slice Vertically

Cut the work into **tracer bullets**: narrow but complete paths through every layer the feature needs.

**Horizontal slicing is the default mistake.** It looks tidy and produces nothing runnable until the last task:

```
Bad (horizontal):
Task 1: Build the entire database schema
Task 2: Build all API endpoints
Task 3: Build all UI components
Task 4: Connect everything
```

At the end of Task 3, nothing works. Nobody can demo anything. A wrong assumption in Task 1 is discovered in Task 4.

**Vertical slicing produces working software at every step:**

```
Good (vertical):
Task 1: A user can create an account   (schema + API + UI for registration)
Task 2: A user can log in              (auth schema + API + UI for login)
Task 3: A user can create a task       (task schema + API + UI for creation)
Task 4: A user can view the task list  (query + API + UI for list view)
```

Rules for a good slice:

- **It cuts through every layer the behaviour needs** — data, logic, interface, test.
- **It is demoable or verifiable on its own.** If you cannot describe how to confirm it works, it is not a slice.
- **It fits in one focused session** — roughly one fresh context window.
- **It delivers behaviour, not structure.** "Add the users table" is not a slice; "a user can register" is.

**Wide refactors are the exception.** A wide refactor is one mechanical change (rename a column, retype a shared symbol) whose blast radius fans across the whole codebase, so no vertical slice can land green. Do not force it into a tracer bullet. Sequence it as **expand, migrate, contract**:

1. **Expand** — add the new form beside the old so nothing breaks.
2. **Migrate** — move call sites over in batches sized by blast radius (per package, per directory), each batch its own task blocked by the expand, keeping the build green batch to batch because the old form still exists.
3. **Contract** — delete the old form once no caller remains, in a task blocked by every migrate batch.

When even the batches cannot stay green alone, keep the same sequence but let them share an integration branch that all block a final integrate-and-verify task, where green is promised.

**Exit condition:** every piece of work belongs to exactly one task, and every task is a vertical slice or a declared wide-refactor step.

---

### Phase 4: Write Each Task

Write each task as its own file. One task per file, always — never a single combined document with all tasks inside.

**Output path:** `tasks/<name>/task-NN.md`, where `<name>` matches the PRD's name (so a PRD at `docs/prd/billing.md` produces `tasks/billing/task-01.md`). Number from `01`, in dependency order — blockers get the low numbers.

**Task file template:**

```markdown
# Task NN: <Short descriptive title>

**Source:** docs/prd/<name>.md — <PRD section this task implements>

**What to build:** The end-to-end behaviour this task makes work, from the
user's perspective. Not a layer-by-layer implementation list. If you cannot
describe it as behaviour a user or caller can observe, reshape the task.

## Acceptance criteria

- [ ] <specific, testable condition>
- [ ] <specific, testable condition>

Every criterion must be checkable by someone who did not write the task.
"Works correctly" is not a criterion. "A user can register with an email and
password and is redirected to the dashboard" is.

## Verification

- [ ] Tests pass: <the repository's focused-test command>
- [ ] Build succeeds: <the repository's build command>
- [ ] Output matches: <expected pattern or artefact that must exist>
- [ ] No regressions: <the full suite or the relevant subset>
- [ ] Manual check: <what a human confirms by looking or clicking>

Run these in order. Do not mark the task complete on a partial pass.

## Blocked by

<Task numbers that must be complete first, or "None — can start immediately">

## Files likely touched

- `path/to/file`
- `path/to/test`

This list is an estimate, not a boundary. Discovering a file outside it is
expected; silently editing an unrelated one is not.

## Estimated scope

<XS: 1 file | S: 1-2 files | M: 3-5 files | L: 5-8 files | XL: too large, split>

## Rollback

<How to undo this task if it turns out wrong: the revert command, the feature
flag to disable, or the migration's down direction. If there is no rollback,
say so explicitly — that is a risk worth surfacing.>

## Notes

<Optional. Decisions taken during breakdown, open questions, links to the PRD
sections that constrain this task.>
```

Rules for filling it:

- **Source line is mandatory.** It makes the task auditable: every task must trace to a PRD section. A task that traces to nothing is scope creep.
- **Acceptance criteria are per-task and testable.** They answer "did we build the right thing?", while the project-wide `../../references/definition-of-done.md` answers "is it done to our standard?". Both apply.
- **Verification lists all five types, not just tests.** A task that only runs tests can still ship broken output; the manual check and the output-match check catch what tests miss.
- **Rollback is not optional.** Writing "not applicable" is fine; leaving it blank is not.
- **No code snippets and no specific line numbers.** They go stale. Exception: if a decision is more precisely expressed as a type shape, schema, or state machine than as prose, inline just that fragment and note it encodes a decision.
- **Never reference another task file by path.** Reference it by number (`Task 03`) so a rename does not break the chain.

**Exit condition:** every task from Phase 3 has a complete file, with no blank template sections.

---

### Phase 5: Order, Size, and Checkpoint

Arrange the tasks so the sequence is correct and the risk is early.

**Ordering rules:**

1. **Dependencies are satisfied.** Producer tasks come before consumer tasks. This is the graph from Phase 2, not perceived importance.
2. **Each task leaves the system in a working state.** Nothing lands half-migrated into a broken build unless it is a declared wide-refactor step sharing an integration branch.
3. **High-risk tasks go early.** Fail fast: a risky assumption discovered in Task 2 is cheap; discovered in Task 12 it is expensive.
4. **Prefactoring goes first.** "Make the change easy, then make the easy change." A task that prepares the ground gets a low number.

**Sizing rules:**

| Size | Files | Scope | Example |
|---|---|---|---|
| **XS** | 1 | Single function or config change | Add a validation rule |
| **S** | 1-2 | One component or endpoint | Add a new API endpoint |
| **M** | 3-5 | One feature slice | User registration flow |
| **L** | 5-8 | Multi-component feature | Search with filtering and pagination |
| **XL** | 8+ | **Too large — split it** | — |

An agent performs best on S and M. Break any task that is L or larger.

**When to split a task further:**

- It would take more than one focused session (roughly two hours of agent work).
- You cannot state the acceptance criteria in three bullet points or fewer.
- It touches two or more independent subsystems (for example auth and billing).
- You wrote "and" in the title — that is two tasks.

**Checkpoints.** Insert a checkpoint after every two to three tasks. A checkpoint is not a task; it is a gate. Write it as its own file `tasks/<name>/checkpoint-NN.md`:

```markdown
# Checkpoint NN: after Tasks <a>-<b>

- [ ] All tests pass
- [ ] The build succeeds with no errors
- [ ] The core flow works end-to-end
- [ ] No task left half-done
- [ ] Human review before proceeding

If any item fails, stop and fix before continuing. Checkpoints exist so a wrong
assumption costs one checkpoint instead of the whole plan.
```

Place a final checkpoint that verifies the PRD's **Success Criteria** directly, section by section.

**Exit condition:** every task has a number, a size, and a place in the sequence; checkpoints are placed; the final checkpoint maps to the PRD's success criteria.

---

### Phase 6: Quiz the User

Present the proposed breakdown before writing anything to disk. Show a compact table, not the full task files:

```markdown
| # | Task | Size | Blocked by | What it delivers |
|---|---|---|---|---|
| 01 | User registration | M | — | A user can create an account |
| 02 | Login and session | M | 01 | A user can log in and stay logged in |
| 03 | Password reset | S | 02 | A user can recover access |
```

Then ask:

- **Is the granularity right?** Too coarse (tasks that hide real work) or too fine (tasks that are not worth their own file)?
- **Are the blocking edges correct?** Does each task depend only on tasks that genuinely gate it? A wrong blocker either serializes work that could run in parallel or lets a task start before its foundation exists.
- **Should anything be merged or split?** Adjacent XS tasks might be one task; an M that hides two subsystems might be two.
- **Is anything missing?** Compare against the PRD's User Stories and Success Criteria once more.

Iterate until the user approves. Do not write files before approval — the table is cheap to change, the files are not.

**Exit condition:** the user has approved the breakdown, explicitly.

---

### Phase 7: Write, Sync, and Verify

Write the approved breakdown.

1. **Create `tasks/<name>/` and write one file per task**, numbered from `01` in dependency order. Write checkpoints as their own files.
2. **Optionally write `tasks/<name>/index.md`** listing the tasks with their sizes and blockers. Keep it as an index only — never duplicate the task bodies there.
3. **Sync the todo list.** Mirror the tasks into `todowrite`, one item per task, in order. Mark the first task and any blocking tasks `high`, parallel tasks `medium`, and optional tasks `low`. Keep the todo list and the task files in step; drift between them is a red flag.
4. **Do not overwrite an approved breakdown of different work.** Before writing, check whether `tasks/<name>/` already exists with unchecked tasks:
   - Same work being revised -> update in place.
   - Different work -> **stop and ask.** The existing tasks may be mid-execution. Present the conflict and let the user decide.
5. **Verify what you wrote:**
   - Every task file exists and has no blank sections
   - Every `Blocked by` value names a task that exists, or says None
   - Task numbers start at `01` and are contiguous
   - The final checkpoint references the PRD's success criteria
   - The todo list matches the task files

**Exit condition:** files written, todos synced, verification checks all pass, and the user knows the next step.

## Handing Off

`get-tasks` produces tasks, not code. After approval, hand off explicitly:

- **To `incremental-implementation`** — the default. It works the frontier, one slice at a time, landing each as a working change.
- **To `test-driven-development`** — when the PRD's Testing Strategy calls for test-first work on specific tasks.
- **To `planning-and-task-breakdown`** — only if the user specifically wants the older spec-to-plan flow instead.

Name the first task to start with, and say which task is blocked by it.

## Replanning When a Task Fails

Breakdown is a living document. When a task fails during execution, follow this procedure rather than pushing through.

### Diagnose

- What failed? Exact error, file, line.
- Why? Wrong assumption, missing dependency, tool limitation, or a PRD gap.
- Can it be fixed inline?

### Decide

| Situation | Action |
|---|---|
| Minor fix (typo, wrong path) | Fix inline, re-run the task's verification |
| The task needs rework | Revise that task file, re-run |
| A new dependency surfaced | Insert new task(s), renumber downstream, update `Blocked by` values |
| The plan is fundamentally wrong | Re-run Phases 2 to 5 rather than patching |
| The PRD itself is wrong | Stop. Amend the PRD first, then re-derive the tasks |

### Update

- Edit the task files, not just the todo list.
- Re-sync `todowrite`.
- Report the change: "Task 04 failed: <reason>. Added Task 04a to <fix>; Tasks 05-07 renumbered."

Never silently reorder tasks or drop one. A dropped task is a dropped requirement.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The PRD is already detailed, I can jump straight to code" | A PRD says what, not in-what-order. Skipping the graph produces work that cannot be verified until the end. |
| "Horizontal slicing is tidier" | Tidy and unverifiable. Nothing runs until the last task, and every wrong assumption is discovered late. |
| "This task is obvious, no need for a file" | Then it takes 60 seconds to write. The file is what survives context loss. |
| "Acceptance criteria are overhead" | Without them, "done" means "the agent stopped typing". They are the only defence against a task marked complete but not working. |
| "I'll add the rollback later" | There is no later. A task with no undo path is a risk you have chosen not to see. |
| "One big task file is easier than many files" | It is easier to write and harder to execute. Work is picked up one task at a time; the file granularity should match. |
| "I'll write the files before checking with the user" | The table costs seconds to change. Rewriting twenty files after a granularity objection costs a session. |
| "The blockers are obvious from the order" | Then writing them costs nothing, and anyone reading a single task file out of order still knows what gates it. |
| "Numbering can be fixed later" | Renumbering breaks every `Blocked by` reference. Get the order right before writing, or accept the churn knowingly. |
| "This is too small to be its own task" | Then fold it into a neighbour — do not leave it implicit. Implicit work is the work that gets forgotten. |
| "I'll skip the checkpoint, tests pass anyway" | Checkpoints catch the class of failure tests do not: two tasks that each pass but do not compose. |
| "I'll reference the task file path" | Renames break paths. Reference by number. |

## Red Flags

- Starting to write task files before the dependency graph exists
- A task with no acceptance criteria
- A task with no verification steps
- A task with an empty Rollback section
- A task whose Source line points at nothing in the PRD
- Tasks that are all XL, or a breakdown where nothing is smaller than L
- Horizontal slicing presented as a plan (all schema, then all API, then all UI)
- Blockers written as "obvious" or inferred from position rather than stated
- Checkpoints missing entirely, or a final checkpoint that does not map to the PRD's Success Criteria
- A single combined task file instead of one file per task
- Task numbers that do not start at 01, or are not contiguous
- A `Blocked by` value naming a task that does not exist
- Overwriting an existing `tasks/<name>/` directory that still has unchecked tasks, without asking
- Writing files before the user approved the table

## Verification

Before declaring `get-tasks` complete:

- [ ] The source PRD is identified by path and recorded in every task's Source line
- [ ] A dependency graph exists, with no cycles and a clear frontier
- [ ] Every task is a vertical slice, or a declared wide-refactor step
- [ ] One file per task, written under `tasks/<name>/`, numbered from `01`
- [ ] Every task has acceptance criteria that a third party could check
- [ ] Every task's Verification block lists tests, build, output, regressions, and manual check
- [ ] Every task has a non-empty Rollback section
- [ ] Every task has a size, and none is XL
- [ ] Every `Blocked by` value names an existing task or says None
- [ ] Checkpoints are placed every two to three tasks
- [ ] A final checkpoint maps directly to the PRD's Success Criteria
- [ ] The user approved the breakdown table before any file was written
- [ ] No pre-existing breakdown for different work was overwritten without asking
- [ ] `todowrite` is synced with the task files
- [ ] The handoff skill and the first task to start are stated

## Worked Example

A PRD for an "experiment tracker" exists at `docs/prd/experiment-tracker.md`. Its Technical Decisions section names three modules: storage, list view, signal capture. Its User Stories include "as a user, I want to see all my running experiments in one place" and "as a user, I want to record an early signal against an experiment".

**Phase 2 dependency graph:**

```
Storage and schema
    |
    +-- Experiment list query
    |       |
    |       +-- List view UI
    |
    +-- Signal model
            |
            +-- Signal capture UI
                    |
                    +-- Signal display in list
```

**Phase 3 slices:** four vertical cuts. Note the third slice is not "build the signal UI" (horizontal) but "a user can record a signal against an experiment" (vertical).

**Phase 4, the second task file, in full:**

```markdown
# Task 02: A user can see all running experiments

**Source:** docs/prd/experiment-tracker.md — User Stories, Objective

**What to build:** A user opens the app and sees a list of every experiment
currently running, with its name and its latest signal. The list is populated
from stored data, not fixtures.

## Acceptance criteria

- [ ] Opening the app shows every stored experiment with status "running"
- [ ] Each row shows the experiment name and its most recent signal value
- [ ] An experiment with no signals yet still appears, showing "no signal"
- [ ] The list is empty-state aware: with no experiments, it says so

## Verification

- [ ] Tests pass: npm test -- experiments/list
- [ ] Build succeeds: npm run build
- [ ] Output matches: rendered list contains one row per running experiment
- [ ] No regressions: npm test
- [ ] Manual check: create two experiments, one with a signal, confirm both appear

## Blocked by

Task 01 — storage and schema

## Files likely touched

- `src/experiments/list.ts`
- `src/experiments/list.test.ts`
- `src/ui/ExperimentList.tsx`

## Estimated scope

M — 3 files

## Rollback

Revert the commit. The list view is additive; no data is written.

## Notes

Empty-state behaviour is not specified in the PRD. Defaulting to an explicit
"no experiments yet" message; flagged as a PRD gap.
```

**Phase 5:** Task 02 is M, blocked by Task 01, ordered second. A checkpoint is placed after Task 03.

**Phase 6 table shown to the user:**

```markdown
| # | Task | Size | Blocked by | What it delivers |
|---|---|---|---|---|
| 01 | Storage and schema | M | — | Experiments can be stored and read |
| 02 | Experiment list view | M | 01 | A user can see all running experiments |
| 03 | Signal capture | M | 01 | A user can record a signal |
| 04 | Signal display in list | S | 02, 03 | The list shows each experiment's latest signal |
```

Only after the user approves this table do the task files get written.

## Interaction with Other Skills

- **`get-prd`**: upstream and the normal source. Its output at `docs/prd/<name>.md` is this skill's default input.
- **`spec-driven-development`**: upstream alternative. Its spec satisfies the same role; `get-tasks` reads whichever exists.
- **`planning-and-task-breakdown`**: overlapping by design. It serves the older spec-to-plan flow and writes `tasks/plan.md` and `tasks/todo.md`. Both may coexist; choose per project, not per task. Where their guidance diverges, this skill's task-file format is authoritative for `tasks/<name>/` output.
- **`incremental-implementation`**: downstream and the default handoff. It executes one task at a time.
- **`test-driven-development`**: downstream, conditional on the PRD's Testing Strategy.
- **`context-engineering`**: alongside. Before starting a large task, load only the PRD sections and source files that task needs rather than the entire PRD.
- **`../../references/definition-of-done.md`**: complements this skill. Per-task acceptance criteria answer "did we build the right thing"; the Definition of Done answers "does it meet our standing bar". Both apply to every task.
