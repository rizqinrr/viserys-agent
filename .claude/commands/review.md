---
description: Conduct a five-axis code review via the maester persona — correctness, readability, architecture, security, performance
---

Invoke the viserys:code-review-and-quality skill. This command is read-only: do not edit files, run mutating shell commands, stage, commit, checkout, reset, or clean.

Collect the complete review target before delegation:

- unstaged changes from `git diff`;
- staged changes from `git diff --cached`;
- untracked paths from `git ls-files --others --exclude-standard`, then read their contents;
- deletions shown by either diff;
- or, when the user supplies a fixed comparison point, review the complete diff from that point instead.

Then spawn the plugin-scoped `viserys:maester` subagent with the complete target plus relevant task/spec context.

The `maester` pass must review all five axes:

1. **Correctness** — Does it match the spec? Are edge cases and error paths handled? Are tests adequate?
2. **Readability** — Are names clear? Is control flow straightforward? Is the code well-organized?
3. **Architecture** — Does it follow existing patterns? Are boundaries and abstractions appropriate?
4. **Security** — Is input validated? Are secrets safe? Is authorization checked?
5. **Performance** — Are there N+1 queries, unbounded operations, or avoidable rendering costs?

Use the canonical severity taxonomy:

- **Critical** — Blocks merge.
- **Required** — Must address before merge.
- **Optional** — Worth considering but not required.
- **Nit** — Minor and optional.

Return the structured review defined by the `maester` persona with specific `file:line` references and fix recommendations. If the harness cannot spawn subagents, apply the `maester` prompt in the main context and label the result as degraded single-context review.
