# Technical UI Audit

Use this reference for `/get-design audit`. Audit measurable implementation quality; do not redesign or fix files.

## Dimensions

Score each dimension 0–4.

### Accessibility

Check contrast, semantic HTML, heading order, labels, names/roles/states, keyboard navigation, focus order/visibility/traps, alt text, error association, motion sensitivity, zoom/reflow, and non-color state cues.

### Performance

Check layout thrashing, unbounded blur/filter/shadow, layout-property animation, image sizing/loading/format, font loading, unnecessary dependencies, render churn, bundle weight, layout shift, and interaction latency. Do not claim measured impact without measurements.

### Theming

Check semantic tokens, hard-coded colors, theme switching, light/dark contrast, token consistency, browser surfaces, and state colors.

### Responsive design

Check fixed widths, intermediate widths, overflow, content reordering, text scaling, touch targets, touch gestures, safe areas, orientation, and keyboard/mobile viewport behavior. A resized desktop viewport is not proof of touch behavior.

### Implementation integrity

Check the anti-slop catalog, product specificity, realistic content, complete states, working controls, design-system drift, placeholder media, misleading claims, and whether an unrelated product could reuse the structure unchanged.

## Evidence rules

- Cite file and line for source findings.
- Cite URL, viewport, element, and interaction for browser findings.
- Label static performance observations `potential impact`.
- Distinguish measured, observed, inferred, and unavailable evidence.
- Verify suspected findings and call out false positives.

## Score bands

- 18–20 Excellent.
- 14–17 Good.
- 10–13 Acceptable but significant work remains.
- 6–9 Poor.
- 0–5 Critical.

## Severity

- P0 Blocking: prevents task completion or creates severe risk.
- P1 Major: release-blocking WCAG AA failure or significant task difficulty.
- P2 Minor: contained friction or inconsistency.
- P3 Polish: low-impact finish issue.

## Report format

1. Audit Health Score table, total `/20`.
2. Implementation Integrity Verdict.
3. Executive Summary and severity counts.
4. Detailed Findings by severity; each includes location, category, impact, standard, evidence type, and concrete recommendation.
5. Patterns and Systemic Issues.
6. Positive Findings.
7. Recommended Actions using `/get-design <mode> <target>`.

Prioritize ruthlessly. Do not bury P0/P1 findings under a list of cosmetic details.

## Attribution

Adapted for Viserys from Impeccable's audit guidance by Paul Bakaus, Apache-2.0. Modifications remove upstream runtime and detector dependencies.
