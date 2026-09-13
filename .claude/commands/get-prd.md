---
description: Run a deep interview and produce an approved PRD in one pass
---

Invoke the viserys:get-prd skill.

This single skill covers the full path from a vague request to an approved PRD: design-tree interviewing, intent extraction, capability mapping, gap checking, and PRD authoring.

Follow the skill's eight phases in order:

0. Scope gate — decide whether the request is one capability or several; if several, propose a capability map and get it approved first.
1. Hypothesis seed — state your read of the ask and a confidence number before asking anything.
2. Build the design tree — map decisions and identify the frontier.
3. Round questions — ask the whole frontier per round, numbered, each with a recommendation attached.
4. Intent probe — surface want-vs-should-want when the user answers with buzzwords or convention.
5. Restate — say the intent back in the user's words and get confirmation.
6. Gap check — compare against the nine mandatory PRD areas and report gaps rather than inventing answers.
7. Write and gate — fill the PRD template, save to docs/prd/<name>.md, and get an explicit yes.

Do not move to PRD authoring before the restate is confirmed. Do not ask the user for facts you can look up yourself. Save the PRD only after the explicit yes.

After approval, hand off to planning-and-task-breakdown.
