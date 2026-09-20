# Get Design Router

Resolve `/get-design <mode> <target>` into one workflow. Never run every branch.

## Modes

| Mode | Purpose | Writes files? |
|---|---|---|
| `new` | Create or replace a surface and visual direction, then implement when requested | Yes |
| `shape` | Resolve UX, composition, and visual direction before code | Only design artifacts |
| `critique` | Design-director review of specificity, usability, cognition, and emotional fit | No |
| `audit` | Technical review of accessibility, performance, theming, responsive behavior, and integrity | No |
| `polish` | Finish an existing interface while preserving its identity | Yes |
| `layout` | Improve hierarchy, grouping, rhythm, density, and responsive composition | Yes |
| `typeset` | Improve type character, hierarchy, measure, wrapping, and readability | Yes |
| `colorize` | Improve palette roles, contrast, states, and thematic coherence | Yes |
| `animate` | Add purposeful state and relationship motion | Yes |
| `bolder` | Increase presence while preserving product truth and system coherence | Yes |
| `quieter` | Reduce noise and competing emphasis without erasing identity | Yes |
| `distill` | Remove clutter, redundant chrome, explanation, and actions | Yes |
| `clarify` | Improve labels, instructions, errors, empty states, and calls to action | Yes |
| `adapt` | Adapt an existing surface to another viewport, device, or platform | Yes |
| `harden` | Complete failure, edge, data, content, localization, and permission states | Yes |
| `onboard` | Design first-run, activation, empty state, and learning-by-doing flows | Yes |
| `optimize` | Measure and improve UI performance | Yes |
| `delight` | Add a product-specific meaningful moment | Yes |
| `overdrive` | Push visual/technical ambition without sacrificing clarity or accessibility | Yes |
| `document` | Capture the existing design system in DESIGN.md | Design artifacts |
| `extract` | Consolidate repeated visual patterns into tokens/components when semantics match | Yes |

## No mode supplied

Inspect available context and present 2–3 recommendations followed by the compact mode table. Do not auto-run a mode.

Prefer:

- Missing product context → ask for audience, task, success, constraints.
- New or replacement surface → `new` or `shape`.
- Generic or confusing existing page → `critique`.
- Accessibility/responsive/runtime concern → `audit`.
- Known issues and desired fixes → focused mode, then `polish`.
- Repeated visual drift with no DESIGN.md → `document` or `extract`.

## Composition with Viserys

- Before implementation: `spec-driven-development` or `get-prd` supplies product requirements; `get-design shape/new` supplies visual direction.
- During implementation: `frontend-ui-engineering` supplies component architecture, state, accessibility mechanics, and responsive code.
- Verification: `browser-testing-with-devtools` supplies runtime evidence.
- Performance: `performance-optimization` applies when measurement reveals a bottleneck.
- Review: `code-review-and-quality` checks code-level correctness after design verification.

## Rule loading

Every mode uses `anti-ai-slop-catalog.md` as a review baseline. Load it immediately before design edits or a critique/audit pass. Apply the craft floor and relevant category checks, but preserve explicit product and design-system decisions.
