---
name: get-schema
description: Designs a database schema from an approved PRD and writes it as a Markdown document with tables, columns, types, relationships, indexes, and constraints. Use when a PRD exists and the data model needs designing before implementation. Use when the user says "get schema", "bikin schema", "rancang database", "rancang tabel", "desain tabel", "struktur tabel", or "relasi tabel". Produces docs/schema/<name>.md, not SQL.
---

# Get Schema

## Overview

`get-schema` turns an approved PRD into a documented database schema. It reads the PRD, derives the entities the product actually needs, defines their columns and relationships, and writes the result to `docs/schema/<name>.md` as tables a developer can read without opening a migration file.

The reason this exists as its own step: **a PRD describes behaviour, not tables.** It says "a user can record a signal against an experiment". It does not say whether a signal is a row, a column, or an event stream, and it should not — that is a data modeling decision. When nobody makes that decision explicitly, it gets made implicitly by whoever writes the first migration, and every later feature inherits it.

The schema document sits between the PRD and the task breakdown:

```
get-prd    -> docs/prd/<name>.md       (what and why)
get-schema -> docs/schema/<name>.md    (what the data looks like)   <- this skill
get-tasks  -> tasks/<name>/*.md        (in what order to build it)
```

It exists before `get-tasks` because tasks need to know the shape of the data they read and write. A task that says "store the signal" is not useful until "signal" has columns.

The output is a Markdown document with entity tables, a relationship table, an index table, and a constraints section. It is deliberately **not** SQL. DDL goes stale the moment an ORM is chosen or a migration is refactored; a table describing intent survives.

## When to Use

Use this skill when:

- A PRD or spec exists and the data model needs to be designed before implementation starts
- The user says "get schema", "bikin schema", "rancang database", "desain tabel", or "what tables do we need"
- You are about to create the first migration and no written model exists
- A new feature in an existing system needs its tables designed and recorded

**When NOT to use:**

- No PRD or spec exists — run `get-prd` first. Deriving tables from an unwritten product is guessing
- The schema already exists and the user wants a small column added — edit the migration, then update `docs/schema/` to match
- The user wants SQL DDL — this skill produces the model, not the DDL. Write the migration separately, ideally alongside `incremental-implementation`
- The user wants an ADR about *why* a data decision was made — that is `documentation-and-adrs`. This skill records the shape; the ADR records the argument
- A single-table change with no relationships and no ambiguity — just make the change

## The Process

`get-schema` runs in eight phases. Each phase has an exit condition. Do not advance past a phase whose exit condition is unmet.

```
0. Locate the PRD      -> which document is the source?
1. Identify entities   -> what nouns does the product actually persist?
2. Choose the engine   -> which database, and why?
3. Define attributes   -> what columns does each entity have?
4. Relationships       -> how do entities connect, and what happens on delete?
5. Indexes and constraints -> what must be fast, and what must be impossible?
6. Quiz the user       -> entities, engine, relationships, naming
7. Write and verify    -> docs/schema/<name>.md, then check it
```

**Designing is read-only.** Phases 0 through 6 produce a document and questions, not migrations or code. Do not create a table, write a migration, or edit an ORM schema file during those phases. Writing `docs/schema/<name>.md` is the only filesystem change.

---

### Phase 0: Locate the PRD

Find the source document before doing anything else.

1. **Convention first.** `get-prd` saves to `docs/prd/<name>.md`. Look there first.
2. **Then the wider search.** If `docs/prd/` is empty, look for `SPEC.md`, `docs/SPEC.md`, or a document the user names.
3. **If more than one candidate exists**, do not guess. List them and ask which governs.
4. **If none exists**, stop and route the user to `get-prd`. Deriving a schema from a vague request produces tables nobody asked for.

Also check whether `docs/schema/<name>.md` already exists. If it does, this is a revision, not a first pass — read it before continuing so the new version is a deliberate change rather than a rewrite.

Record the exact path. Every later phase references it.

**Exit condition:** a single source document is identified, and the existing schema state (none, or a path) is on the record.

---

### Phase 1: Identify Entities

Derive the entity list from the PRD. Do not invent entities and do not copy a generic starter schema.

Read the PRD's **User Stories** and **Objective** first. Entities are the nouns the product persists, extracted from behaviour:

```
"as a user, I want to see all my running experiments in one place"
    -> Experiment

"as a user, I want to record an early signal against an experiment"
    -> Signal, with a link to Experiment
```

Rules:

- **Every entity traces to a User Story or Objective.** If you cannot name the story an entity serves, it does not belong. A junction table is the exception — it traces to a relationship, not a story.
- **Nouns that are not persisted are not entities.** "Report" may be a query over experiments, not a table. Decide explicitly and say so.
- **Nouns that are enums are not entities.** "Status" is usually a column with a fixed set of values, not a table, unless the product lets users define new ones.
- **Name entities in the singular.** `experiment`, not `experiments`. The table name is a separate decision.
- **Use the PRD's vocabulary, not a synonym.** If the PRD says "signal", the entity is `signal`. Introducing "event" here creates two names for one thing.
- **Prefer the smallest entity set that satisfies the stories.** A premature table is harder to remove than to add.

List the entities before moving on, with the story each one serves. If a story needs an entity you are unsure about, note it as an open question rather than deciding silently.

**Exit condition:** every entity is listed, and each names the PRD story or objective it serves.

---

### Phase 2: Choose the Engine

The database engine shapes types, index options, and constraint support. Do not assume one.

**If the PRD already names an engine, use it and say so.** Do not re-litigate a settled decision.

**If it does not, ask the user, with a recommendation and a reason.** Never pick silently. Present it like this:

```
The PRD does not name a database. My recommendation is <engine>, because
<reason tied to this product's actual needs>.

Q: <engine choice>?

Options:
- <engine A> - <when it fits, and the cost>
- <engine B> - <when it fits, and the cost>
```

What makes a recommendation good:

- **Tie it to the product, not to fashion.** "Postgres because the signal payloads vary per experiment and a JSONB column avoids a schema migration per signal type" is a reason. "Postgres is standard" is not.
- **Name the trade-off you are accepting.** Every engine choice costs something: operational complexity, hosting cost, query limitations, or migration friction.
- **Consider what the project already uses.** If the repo has a migration folder for one engine, a second engine is almost never the answer. Check before recommending.
- **Ask once.** The engine is not the subject of this document; it is a precondition.

If the user has no preference and genuinely does not know, offer the smallest set of options that covers their likely deployment, with one clearly marked as the default.

Record the chosen engine and the reason at the top of the document. The reason is what lets a future reader re-evaluate the choice.

**Exit condition:** the engine is chosen and the reason is recorded, or explicitly inherited from the PRD.

---

### Phase 3: Define Attributes

For each entity, define its columns.

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | uuid | no | generated | primary key |
| name | text | no | - | user-facing label |
| created_at | timestamptz | no | now() | |

Rules:

- **Every table gets a primary key.** Name it once per document and be consistent. If the project already has a convention, follow it.
- **Types are the engine's types.** `timestamptz`, not `datetime`; `text`, not `string`. If the engine is undecided, use logical types and say so.
- **Say why a column is nullable.** Nullable is a decision, not a default. A column that is nullable "just in case" invites bugs that treat null as a value.
- **Every column traces to behaviour.** A column no story reads or writes is either future-proofing you have not been asked for, or a leftover.
- **Timestamps come in pairs.** If a row can change, it needs `created_at` and `updated_at`. If it is append-only, say so, and skip `updated_at`.
- **Foreign keys are named as columns here, defined in Phase 4.** `<entity>_id`, not `owner` or `parent`.
- **Mark enum-like columns explicitly.** A status column with a fixed set of values gets a constraints entry in Phase 5, not a free-text type.
- **Do not add a `deleted_at` unless the PRD requires soft delete.** It is a product decision with real cost, not a default.

For anything the PRD leaves open — an optional field, a length limit, a precision — record it as an open question rather than choosing silently.

**Exit condition:** every entity has a complete column table, and every nullable or defaulted column has a stated reason.

---

### Phase 4: Define Relationships

Describe how entities connect.

```markdown
| From | To | Cardinality | On delete | Notes |
|---|---|---|---|---|
| signal | experiment | many-to-one | cascade | deleting an experiment removes its signals |
| experiment | user | many-to-one | restrict | an experiment cannot outlive its owner |
```

Rules:

- **Every relationship names its cardinality**, one of one-to-one, one-to-many, many-to-one, many-to-many. "Related" is not a relationship.
- **Many-to-many is two one-to-many edges through a junction entity.** Name the junction, and give it the two foreign keys plus any attributes the relationship itself carries (a role, a joined-at timestamp).
- **On-delete behaviour is mandatory, not optional.** Every foreign key declares `cascade`, `restrict`, `set null`, or `no action`. Omitting it means choosing the most dangerous default. Deleting a user should not silently delete their billing history — say so here.
- **On-update behaviour follows the same rule** if it is not the engine default.
- **A foreign key implies an index.** Note it here, confirm it in Phase 5.
- **Self-references get an explicit note.** A tree of comments is a self-referencing one-to-many; say so, and name the column.
- **No cycles in ownership.** If two entities each require the other, either one is optional or they are one entity.

**Exit condition:** every foreign key is declared with cardinality and on-delete behaviour, and every junction entity is named.

---

### Phase 5: Indexes and Constraints

Write down what must be fast and what must be impossible.

**Indexes:**

```markdown
| Table | Columns | Type | Rationale |
|---|---|---|---|
| signal | (experiment_id, created_at desc) | btree | list view reads the latest signal per experiment |
| experiment | (owner_id, status) | btree | dashboard filters running experiments by owner |
```

Rules:

- **Every index names the query it serves.** An index with no named query is a guess, and guesses cost write throughput forever. If you cannot name the query, do not add the index.
- **Every foreign key gets an index** unless one is already implied by a composite index that leads with it.
- **Unique constraints are constraints, not indexes.** Record them in the constraints section and note that the engine may index them implicitly.
- **Composite column order is a decision.** State the leftmost column and why it leads.
- **Do not index everything.** Each index slows writes and costs storage. The default is no index until a query proves it needs one.

**Constraints:**

```markdown
| Table | Constraint | Type | Definition |
|---|---|---|---|
| experiment | status is a known value | check | status in ('running', 'paused', 'done') |
| signal | one signal per experiment per minute | unique | (experiment_id, minute_bucket) |
| experiment | name is required | not null | name |
```

Rules:

- **Encode business rules the database can enforce.** If the product says "an experiment name is unique per owner", that is a unique constraint, not a validation note. Application-level checks are the backup, not the primary defence.
- **Enum-like columns get a check constraint** listing the valid values.
- **State referential actions here too** if the engine models them outside foreign keys.
- **Every constraint is testable.** If you cannot describe a failing case, it is not a constraint.

**Exit condition:** every index names its query, and every business rule the database can enforce is written as a constraint.

---

### Phase 6: Quiz the User

Present the model before writing the file. Show the entity list, the engine, the relationships, and the indexes — not the full column tables:

```markdown
**Engine:** PostgreSQL - JSONB for per-experiment signal payloads

**Entities**

| Entity | Serves |
|---|---|
| experiment | "see all my running experiments" |
| signal | "record an early signal" |

**Relationships**

| From | To | Cardinality | On delete |
|---|---|---|---|
| signal | experiment | many-to-one | cascade |

**Indexes**: signal(experiment_id, created_at desc), experiment(owner_id, status)
```

Then ask:

- **Are these the right entities?** Anything the product persists that is missing? Anything here that is actually a query, not a table?
- **Is the engine right?** Any constraint on deployment that changes it?
- **Are the relationships right?** Especially: is every on-delete behaviour the one you want? Cascading deletes are the most common data-loss accident.
- **Is the naming consistent?** Agent or human, whoever reads this next should not wonder whether "signal" and "event" are the same thing.

Iterate until approved. Do not write the file before approval — the table is cheap to change, the document is not.

**Exit condition:** the user has approved the model, explicitly.

---

### Phase 7: Write, and Verify

Write the document to `docs/schema/<name>.md`, where `<name>` matches the PRD's name. Create `docs/schema/` if it does not exist.

**Document template:**

```markdown
# Schema: <Name>

**Source:** docs/prd/<name>.md
**Database:** <engine> - <reason for this choice>

## Overview

One paragraph. What this data model supports, and which part of the PRD
motivated it.

## Entities

### <entity>

Serves: <the PRD user story or objective this entity exists for>

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | uuid | no | generated | primary key |
| <column> | <type> | <yes/no> | <default> | <why, when not obvious> |

## Relationships

| From | To | Cardinality | On delete | On update | Notes |
|---|---|---|---|---|---|
| <entity> | <entity> | many-to-one | cascade | - | <why> |

## Indexes

| Table | Columns | Type | Rationale |
|---|---|---|---|
| <table> | (<columns>) | btree | <the query it serves> |

## Constraints

| Table | Constraint | Type | Definition |
|---|---|---|---|
| <table> | <what it enforces> | check / unique / not null | <expression or rule> |

## Migration Notes

- <Anything the implementer must know: backfill requirements, ordering
  constraints, columns that must be added in a separate deploy, whether
  expand/contract applies>

## Open Questions

- <What the PRD did not settle, and which area it affects>
```

Rules:

- **Every section is filled or marked "Not applicable" with a reason.** Never leave a heading with nothing under it.
- **No SQL DDL.** The document describes intent; the migration is written separately.
- **No Mermaid diagram.** The tables are the diagram.
- **Migration Notes are not optional when there is existing data.** A new table is easy; a column added to a populated table is a deploy sequence, and the implementer needs to know that here rather than in production.
- **Open Questions name the area they affect.** A question no one can act on is noise.

Then verify what you wrote:

- [ ] Every entity traces to a PRD story or objective
- [ ] Every entity has a primary key
- [ ] Every column names its type, and every nullable column names a reason
- [ ] Every foreign key has a cardinality and an on-delete behaviour
- [ ] Every junction entity is named and carries both foreign keys
- [ ] Every index names the query it serves
- [ ] Every business rule the database can enforce is a constraint
- [ ] Migration Notes are present, or explicitly "Not applicable"
- [ ] No SQL, no diagram, no blank sections
- [ ] The document names its source PRD and the chosen engine with a reason

**Exit condition:** the file exists, the checklist passes, and the handoff is stated.

## Handing Off

`get-schema` produces a document, not a database. After approval:

- **To `get-tasks`** — the usual next step. Tasks that touch data should cite the schema document and reference entity names, not invent their own.
- **To `documentation-and-adrs`** — if a data decision needs its reasoning recorded permanently (why JSONB, why soft delete, why this cardinality), the schema records the shape and the ADR records the argument.
- **To `deprecation-and-migration`** — when the schema document describes a change to a populated table rather than a new one.
- **To `incremental-implementation`** — to actually write the migration. Never write DDL inside this skill.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The PRD has user stories, the schema writes itself" | Stories describe behaviour. Turning "record a signal" into columns, types, and an on-delete rule is a set of decisions the PRD deliberately did not make. |
| "I'll pick Postgres, everyone uses it" | Engine choice determines types, index options, and constraint support. A one-line question is cheaper than a migration you cannot run. |
| "Nullable everywhere, we can tighten later" | Tightening a column requires a backfill and a deploy. Permissive defaults are deferred work that lands in production. |
| "Cascade delete is simplest" | It is also how deleting one row silently removes another team's data. Choose on-delete deliberately, per foreign key. |
| "I'll add indexes as we find slow queries" | Correct as a default. The exception: every foreign key needs one, and any query the PRD explicitly calls out as a core flow is worth indexing up front. |
| "Constraints can live in the application layer" | The application has many entry points and one database. Put the rule where it cannot be bypassed, and let the app validate for better error messages. |
| "I'll write the SQL now, it is the same thing" | DDL binds you to an engine and goes stale on the first migration refactor. The document describes intent; the migration implements it. |
| "No schema doc needed, the migration is the doc" | A migration is a diff. Nobody reads twelve diffs to learn what an entity is. |
| "The names are obvious, I'll skip the glossary discipline" | Half of schema confusion is two names for one thing. Use the PRD's vocabulary and say so. |
| "I'll skip migration notes, it is all new tables" | Then say that explicitly. Blank is indistinguishable from forgotten. |
| "Open questions can be resolved during implementation" | Then they are decisions made by whoever writes the migration, under time pressure, without the PRD in front of them. |

## Red Flags

- An entity that traces to no PRD story
- A table with no primary key
- A column whose type is a language type (`string`, `int`) rather than a database type
- A foreign key with no declared on-delete behaviour
- A many-to-many relationship modeled directly instead of through a junction entity
- An index with no named query
- Enum-like column values living only in prose, with no check constraint
- Business rules that exist only in the PRD and not in the constraints table
- Any SQL DDL in the document
- A blank section with no "Not applicable" note
- Migration Notes missing when the change touches a populated table
- A schema document that uses vocabulary different from the PRD
- Writing the document before the user approved the model
- Editing a migration or ORM file during this skill

## Verification

Before declaring `get-schema` complete:

- [ ] The source PRD is identified by path and named in the document
- [ ] The engine is named, with a reason, or explicitly inherited from the PRD
- [ ] Every entity traces to a PRD story or objective, and states which
- [ ] Every entity has a primary key
- [ ] Every column has a type; every nullable column has a stated reason
- [ ] Every foreign key has cardinality, on-delete, and on-update behaviour
- [ ] Every junction entity is named and carries both foreign keys
- [ ] Every index names the query it serves; no index exists without one
- [ ] Every database-enforceable business rule appears as a constraint
- [ ] Migration Notes are present, or explicitly marked not applicable
- [ ] Open Questions name the area each one affects
- [ ] No SQL DDL and no diagram appear in the document
- [ ] The document is saved at `docs/schema/<name>.md`
- [ ] The user approved the model before the file was written
- [ ] No migration, ORM schema file, or source file was edited
- [ ] The handoff (usually `get-tasks`) is stated

## Worked Example

A PRD exists at `docs/prd/experiment-tracker.md`. Its User Stories include "as a user, I want to see all my running experiments in one place" and "as a user, I want to record an early signal against an experiment".

**Phase 1, entities:** `experiment` (serves the list story), `signal` (serves the record story). "Signal" is a row, not a column — the PRD's user stories imply many signals per experiment and history matters, so it is its own entity.

**Phase 2, engine:** the PRD does not name one. The agent asks:

```
The PRD does not name a database. My recommendation is PostgreSQL, because
signal payloads differ per experiment - a JSONB column holds them without a
migration per signal type.

Q: PostgreSQL?

Options:
- PostgreSQL - flexible JSONB, strong constraints, easy hosting. Cost: heavier
  than SQLite for a single-user tool.
- SQLite - zero ops, one file. Cost: no JSONB operators, weaker concurrency,
  painful if this ever becomes multi-user.
```

**Phase 6, the table shown to the user:**

```markdown
**Engine:** PostgreSQL - JSONB for per-experiment signal payloads

**Entities**

| Entity | Serves |
|---|---|
| experiment | "see all my running experiments" |
| signal | "record an early signal against an experiment" |

**Relationships**

| From | To | Cardinality | On delete |
|---|---|---|---|
| signal | experiment | many-to-one | cascade |

**Indexes:** signal(experiment_id, created_at desc) for the latest-signal read
```

**Phase 7, an excerpt of the written document:**

```markdown
# Schema: Experiment Tracker

**Source:** docs/prd/experiment-tracker.md
**Database:** PostgreSQL - signal payloads vary per experiment, so a JSONB
column avoids a migration per new signal type.

## Entities

### signal

Serves: "record an early signal against an experiment"

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | uuid | no | generated | primary key |
| experiment_id | uuid | no | - | foreign key, see Relationships |
| payload | jsonb | no | - | shape differs per experiment type |
| recorded_at | timestamptz | no | now() | append-only, no updated_at |

## Relationships

| From | To | Cardinality | On delete | On update | Notes |
|---|---|---|---|---|---|
| signal | experiment | many-to-one | cascade | - | deleting an experiment removes its signals |

## Indexes

| Table | Columns | Type | Rationale |
|---|---|---|---|
| signal | (experiment_id, created_at desc) | btree | list view reads the latest signal per experiment |

## Constraints

| Table | Constraint | Type | Definition |
|---|---|---|---|
| experiment | status is a known value | check | status in ('running', 'paused', 'done') |

## Migration Notes

All tables are new; no backfill required.

## Open Questions

- Should finished experiments be hidden by default? Affects whether `status`
  needs an index of its own.
```

## Interaction with Other Skills

- **`get-prd`**: upstream and the normal source. Its output at `docs/prd/<name>.md` is this skill's default input.
- **`get-tasks`**: downstream and the usual handoff. Tasks that touch data cite this document rather than re-deriving the model.
- **`documentation-and-adrs`**: alongside. This skill records the data shape; the ADR records why the shape was chosen when the reasoning needs to outlive the document.
- **`deprecation-and-migration`**: downstream when the model changes an existing populated table — expand/contract sequencing belongs there.
- **`api-and-interface-design`**: adjacent. The schema informs API shape; the API does not define the schema. Design the data first, then expose it.
- **`incremental-implementation`**: downstream. The migration is written there, not here.
- **`spec-driven-development`**: upstream alternative when no PRD exists but a spec does. This skill reads whichever is present.
- **`../../references/definition-of-done.md`**: applies to the migration that follows, not to this document.
