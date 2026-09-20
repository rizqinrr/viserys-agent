# Design Review Framework

Use this reference for `/get-design critique`. Review one concrete target. The report is the deliverable; do not change files.

## Independent assessments

### A. Design judgment

Assess before reading mechanical findings:

- Product specificity: authored for this product or category-interchangeable?
- Information architecture and hierarchy.
- Task discoverability and primary-action clarity.
- Typography, color, composition, imagery, motion, copy, states, edge cases.
- Cognitive load and working-memory demand.
- Emotional journey: reassurance, high-stakes valleys, and the final impression.
- Accessibility and platform conventions.

### B. Evidence

Inspect source and rendered output when available. Use a fresh browser context/tab and representative desktop/mobile viewports. Check console, DOM semantics, computed layout, keyboard path, touch behavior where applicable, and the anti-slop catalog. Report unavailable evidence explicitly.

When subagents exist, run A and B independently so one does not anchor the other. Otherwise write:

`DEGRADED: single-context (<reason>)`

## Nielsen scoring

Score each applicable heuristic 0–4. `4` means excellent, not merely acceptable. Mark genuinely irrelevant rows `n/a` and adjust the denominator.

1. Visibility of system status.
2. Match between system and real world.
3. User control and freedom.
4. Consistency and standards.
5. Error prevention.
6. Recognition rather than recall.
7. Flexibility and efficiency.
8. Aesthetic and minimalist design.
9. Error recognition, diagnosis, and recovery.
10. Help and documentation.

Rating uses the percentage of the applicable maximum:

- 90–100%: Excellent.
- 70–89%: Good.
- 50–69%: Significant work needed.
- 30–49%: Poor.
- Below 30%: Critical.

## Cognitive-load assessment

Count failed checks:

- One obvious primary focus.
- Information chunked into manageable groups.
- Related material visually grouped.
- Visual hierarchy is immediately legible.
- One decision at a time where possible.
- No decision point presents more than four ungrouped choices.
- The user does not carry hidden information between steps.
- Complexity appears progressively.

0–1 failures is low load, 2–3 moderate, 4+ high. Do not confuse necessary domain complexity with avoidable interface complexity.

## Severity

- **P0 Blocking:** prevents task completion, causes data loss, or creates a severe accessibility barrier.
- **P1 Major:** materially harms comprehension, trust, conversion, or task efficiency.
- **P2 Minor:** noticeable friction with a workaround.
- **P3 Polish:** finish issue with limited user impact.

## Report format

1. Method.
2. Design Health Score table.
3. Design Specificity Verdict.
4. Overall Impression.
5. What's Working (2–3 concrete strengths).
6. Priority Issues (3–5, ordered; each includes severity, why, location, and concrete fix).
7. Persona Red Flags (2–3 relevant user perspectives walking the primary task).
8. Minor Observations.
9. Questions to Consider.

If there are at least three priority issues, end with 2–4 targeted questions with concrete options. If fewer, end with:

`Questions skipped: fewer than 3 priority issues`

## Attribution

Adapted for Viserys from Impeccable's critique guidance by Paul Bakaus, Apache-2.0. Modifications replace Impeccable-specific runtime, persistence, overlay, and command mechanics with native Viserys workflows.
