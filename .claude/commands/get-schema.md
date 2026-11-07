---
description: Design a database schema from a PRD and write it as a Markdown document
---

Invoke the viserys:get-schema skill.

This skill designs a data model from an approved PRD and records it as a Markdown document: entities, columns, types, relationships, indexes, and constraints. It produces a document, not SQL.

Follow the skill's eight phases in order:

0. Locate the PRD — default to docs/prd/<name>.md. If several candidates exist, ask which one governs. If none exists, route the user to get-prd. Check whether docs/schema/<name>.md already exists; if so this is a revision.
1. Identify entities — derive them from the PRD's User Stories and Objective. Every entity names the story it serves. Nouns that are not persisted are not entities.
2. Choose the engine — if the PRD names one, inherit it. Otherwise ask the user with a recommendation and a reason tied to this product's needs, and name the trade-off.
3. Define attributes — column, type, nullable, default, notes. Every table gets a primary key. Every nullable column states why.
4. Define relationships — cardinality and on-delete behaviour for every foreign key. Many-to-many goes through a named junction entity.
5. Indexes and constraints — every index names the query it serves; every foreign key gets an index; every database-enforceable business rule becomes a constraint.
6. Quiz the user — show entities, engine, relationships, and indexes. Ask about missing entities, wrong on-delete behaviour, and naming consistency. Iterate until approved.
7. Write and verify — save docs/schema/<name>.md and run the verification checklist.

Designing is read-only. Do not edit a migration, an ORM schema file, or any source file during phases 0 through 6.

Do not write the schema document before the user approves the model.

After approval, hand off to get-tasks. For a change to a populated table, point the user at deprecation-and-migration.
