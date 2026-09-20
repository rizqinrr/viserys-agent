---
name: get-design
description: Creates visual direction and removes generic AI aesthetics from product interfaces. Use when a user asks to design a UI or dashboard, get design, redesign a surface, establish a distinct visual direction, critique AI slop, or refine visual hierarchy, typography, color, imagery, motion, or layout. Use before frontend implementation when the look is unresolved; use frontend-ui-engineering instead when an approved design exists and the task is component code, state, accessibility mechanics, or responsive implementation.
---

# Get Design

## Overview

Run a product-grounded UI design workflow. The goal is not merely polished CSS: it is an interface with a clear job, a recognizable visual point of view, content that carries the design, hierarchy that reflects user priorities, and interaction states that work in the real usage scene.

This skill is a native Viserys adaptation of the Impeccable design playbook and anti-slop catalog. It contains no runtime dependency on Impeccable, its CLI, hooks, binaries, or external detector. The rulebook is advisory evidence; a deliberate choice can override a default when the product brief, brand, platform, or accessibility requirement earns it.

## When to Use

- Creating a new page, screen, component, landing page, dashboard, checkout, settings flow, docs surface, portfolio, or mobile UI.
- Redesigning an existing visual world rather than only fixing a local defect.
- Reviewing a UI that feels generic, templated, “AI-generated”, or disconnected from its product.
- Improving hierarchy, layout, spacing, typography, color, imagery, motion, copy, responsive behavior, states, or design-system consistency.
- Auditing a rendered interface for usability, accessibility, performance, responsive behavior, or implementation integrity.
- Documenting or extracting an existing design system.

**When NOT to use:** Use `frontend-ui-engineering` for component architecture, state management, semantic implementation, and accessibility mechanics when visual direction is already settled. Use `browser-testing-with-devtools` for runtime browser evidence. Use `performance-optimization` for non-visual performance work.

## The Design Workflow

Choose the route from the user's request. If the request is ambiguous, ask before editing. Load [routing](references/routing.md) for mode selection and the context-aware menu. Load the complete [anti-AI-slop catalog](references/anti-ai-slop-catalog.md) for every mode, including `new`, `shape`, `critique`, `audit`, focused refinements, `document`, and `extract`; it is the baseline before any design decision, edit, critique, or audit. For deep review use [critique](references/critique.md) or [audit](references/audit.md); for a focused refinement use the matching section in [focused playbooks](references/focused-playbooks.md).

1. **Context** → establish product truth, audience, task, platform, constraints, existing visual authority, and the evidence available.
2. **Direction** → choose the surface mode and visual direction before implementation.
3. **Build** → implement the chosen direction as a coherent system, not as disconnected decorations.
4. **Inspect** → review the whole path at representative viewports and states.
5. **Finish** → fix the highest-impact issues, verify again once, and document durable system decisions.

### Route A: `new` or `shape`

1. Read `PRODUCT.md`, `DESIGN.md`, surface briefs, existing tokens, components, copy, assets, and neighboring flows when present.
2. Classify the surface: **Persuade** (decide and act), **Operate** (complete a task), **Read** (understand), or **Experience** (explore the work).
3. Decide what is already true:
   - Extend an established surface by inheriting its visual world.
   - Create a surface inside an established world without inventing a new identity.
   - Redesign only when the user explicitly asks to replace the visual world.
   - Create a new world when no visual authority exists.
4. Ask two or three focused questions about success, must-keep constraints, content/proof, interaction, and what would feel wrong. Never ask the user to pick CSS values as a substitute for design reasoning.
5. Derive at least five materially different structures from the product's content and audience world for an open-ended surface. Reject category-default layouts before selecting one.
6. Commit a direction with:
   - THESIS: what the surface owns and which default arrangement it refuses.
   - OWN-WORLD: palette, type character, shape, depth, imagery, and component language.
   - STORY: what the visitor understands, believes, and does.
   - FIRST VIEWPORT: exact composition, proof, hierarchy, and primary action.
   - FORM: why this structure fits the task and audience.
   - FINISH: evidence required before calling it complete.
7. If the user asks only for `shape`, present the direction and stop before implementation. If building, continue with the chosen direction.

### Route B: `critique`

1. Resolve one concrete target and identify whether source, rendered page, or both are available.
2. Run an independent design review before looking at automated findings. Evaluate specificity, hierarchy, IA, emotional journey, cognitive load, Nielsen's ten heuristics, accessibility, states, copy, and edge cases.
3. If a browser or subagent is available, delegate independent implementation/evidence checks without letting one assessment anchor the other. If unavailable, state the degraded method explicitly.
4. Synthesize rather than concatenate. Start with method, health score, specificity verdict, what works, three to five prioritized issues, persona red flags, minor observations, and targeted questions.
5. Questions are last. Ask only questions tied to findings; if fewer than three priority issues exist, write `Questions skipped: fewer than 3 priority issues`.
6. Do not change files during critique unless the user explicitly asks to act on the findings.

### Route C: `audit`

1. Audit implementation, not taste alone, across Accessibility, Performance, Theming, Responsive Design, and Implementation Integrity.
2. Score each dimension from 0–4 and report a total out of 20.
3. Tag findings P0 Blocking, P1 Major, P2 Minor, or P3 Polish. Include location, impact, standard when applicable, and a concrete fix.
4. Separate deterministic evidence from design judgment. Verify each suspected issue against the target and call out false positives.
5. Include systemic patterns, positive findings, and prioritized next actions. Do not fix files inside the audit route.

### Route D: `polish`

1. Preserve the incumbent visual world, content, behavior, and scope. Polish is not a concealed redesign.
2. Read DESIGN.md, tokens, shared components, neighboring flows, and any prior critique. Classify each gap as missing token, one-off implementation, conceptual mismatch, or local defect.
3. Triage in this order: blocked tasks/data loss/inaccessible paths; missing states; flow/hierarchy/responsive/design-system drift; visual/motion inconsistency; cleanup.
4. Walk the actual path at desktop, mobile, intermediate, and wide sizes with mouse, keyboard, and touch where applicable.
5. Fix the narrowest correct cause. Preserve factual copy and ask before changing claims.
6. Run one batched final inspection. Finish only when the path, states, responsive behavior, and design system agree.

### Route E: focused refinements

- `layout`: fix spatial hierarchy, rhythm, grouping, density, optical alignment, and responsive composition.
- `typeset`: fix type character, hierarchy, measure, line-height, weight, wrapping, localization expansion, and font loading.
- `colorize`: establish palette roles, contrast, semantic states, theme behavior, and intentional color at page scale.
- `animate`: add one or a few purposeful moments tied to state, relationship, or feedback; preserve reduced motion and visible defaults.
- `bolder`: amplify a bland but coherent design without replacing its product truth.
- `quieter`: reduce noise, competing emphasis, glow, decoration, and unnecessary motion while retaining personality.
- `distill`: remove clutter, duplicate explanation, redundant chrome, and competing actions.
- `clarify`: rewrite labels, instructions, errors, empty states, and calls to action around the user's next decision.
- `adapt`: preserve the world while adapting composition, interaction, and density to another viewport or platform.
- `harden`: handle loading, empty, error, success, disabled, permission, offline, slow, long-content, missing-content, and localization states.
- `onboard`: design first-run, activation, empty-state, and learning-by-doing flows around the first useful result.
- `optimize`: measure and improve UI performance without adding speculative micro-optimizations.
- `delight`: add a product-specific, useful moment rather than decorative novelty.
- `overdrive`: push ambition only when the brief permits it; keep performance, clarity, accessibility, and product truth intact.

### Route F: `document`

1. Scan CSS variables, theme files, token files, component primitives, global styles, and representative rendered output.
2. Extract only observed colors, typography, spacing, radius, depth, breakpoint, component, state, and responsive values. Never invent tokens to fill a template.
3. Write or update `DESIGN.md` only after checking whether one already exists. If it exists, ask whether to refresh, overwrite, or merge.
4. Keep the canonical sections: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts.
5. Distinguish durable design-system rules from route-specific strategy. Record a decision only when the implementation or user explicitly supports it.

### Route G: `extract`

1. Inventory repeated visual patterns and confirm that they have the same semantic purpose and behavior.
2. Separate true shared patterns from merely similar-looking elements; preserve meaningful variants.
3. Promote stable values to tokens and stable behavior to shared components.
4. Migrate usages incrementally, preserving content, states, accessibility, and visual parity.
5. Verify all affected surfaces and document the extracted boundary.

## Core Design Rules

### Product specificity

- Start from the user's task, content, audience, and operating scene—not a category template.
- The first viewport must communicate the product's mechanism or primary task, not only its mood.
- Use proof, realistic content, and authored details. Demonstration data may be synthetic, but label it honestly; never invent commercial or factual claims.
- Every visual choice needs a reason connected to product identity, audience recognition, hierarchy, state, or interaction.
- Familiar and effective is valid when chosen deliberately. Familiar by reflex is the problem.

### Structure and hierarchy

- Use content priority to determine composition; do not give every section the same weight.
- Prefer purposeful grouping and varied density over identical repeated blocks.
- Keep related items close and separate unrelated groups generously.
- Use progressive disclosure for complexity and keep visible decisions manageable.
- Use a modal only for interruption, protected focus, or a task that genuinely benefits from isolation.
- Use numbered labels only when sequence carries information.
- Treat the first viewport as a thesis, not a generic header.

### Typography

- Choose type for character, reading need, platform, and product world. Preserve an established brand face when it is intentional.
- Establish visible steps between display, heading, title, body, and label roles.
- Keep body measure near 65–75 characters where appropriate; use enough line-height for comfortable reading.
- Use sentence case for prose. Reserve uppercase and tracking for short labels.
- Prefer weight, size, spacing, and placement for emphasis before decorative gradient text.
- Test real copy, long labels, localization expansion, zoom, and font loading at every breakpoint.

### Color, depth, and shape

- Choose light/dark from the use scene, not category habit.
- Define semantic roles and use color at page scale where the surface owns it; do not scatter accent color as decoration.
- Meet WCAG contrast: 4.5:1 normal text and 3:1 large text; tint secondary text from the surface hue rather than default gray on color.
- Declare elevation once: border, tonal layering, or shadow. A hairline border plus broad shadow usually defines the same edge twice.
- Keep radii proportional to the element. Pills belong to compact controls; large rounded blobs are not a universal card language.
- Use gradients, glass, blur, glow, hard shadows, stripes, and grids only when the chosen world or function gives them a clear job.

### Imagery and icons

- Use real, verified imagery when the subject or brief calls for it; one decisive image beats several generic substitutes.
- Prefer an authored illustration, diagram, photo, or no image over placeholder circles and blocks.
- Use a consistent icon library or authored SVG with coherent stroke, fill, optical size, and alignment. Do not use emoji or arbitrary Unicode glyphs as an icon system.
- Use prepared transparent cutouts or clean crops; do not approximate photographic contours with geometric masks.
- Do not hide useful imagery beneath opaque overlays or ship broken/placeholder sources.
- Give every shipped raster provenance: source, license, or generation prompt.

### Motion and interaction

- Motion must explain change, relationship, status, or feedback. Author one coherent motion grammar instead of scattering effects.
- Keep content visible by default; entrance animation must not be the only path to visibility.
- Use transform/opacity and bounded effects where appropriate; avoid animating layout properties that shift nearby content.
- Provide a meaningful reduced-motion alternative that preserves state and hierarchy.
- Keep static status dots static; pulse only when the motion communicates active change.
- Do not use automatic marquee, decorative blinking cursors, image hover zoom, or bounce/elastic easing without a strong product-specific reason.
- Make controls interruptible, keyboard accessible, touch-safe, and predictable.

### Copy and credibility

- Write the product's language. Name what the person can do and what changes for them.
- Replace generic claims such as “world-class”, “next-generation”, or “supercharge” with concrete outcomes and proof.
- Avoid repeated labels, slogan-like forced contrasts, and em-dash-heavy prose.
- Errors name the problem and recovery. Controls name their action. Empty states explain what happened and the next useful step.
- Never change factual claims, prices, availability, customer proof, or capabilities without confirmation.

### Shipping floor

Every UI route must account for default, hover, focus-visible, active, disabled, loading, error, empty, success, and permission states where relevant. Verify keyboard focus, semantic structure, screen-reader names, contrast, responsive composition, touch targets, overflow, console errors, image loading, and reduced motion.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| “The brief is only ‘make it modern’.” | Ask for the user's task, audience, scene, and success. A vague adjective is not a visual direction. |
| “The category uses this template.” | Category convention is a candidate, not a reason. Derive structure from content and behavior. |
| “The gradient/glow/card makes it feel premium.” | Decoration is not hierarchy. Name the product job or remove the effect. |
| “I will use placeholder copy and fix it later.” | Realistic content exposes wrapping, hierarchy, and overflow problems now. |
| “Everything can be a card.” | Cards flatten relationships and create depth noise. Use grouping, type, spacing, and dividers. |
| “A clean screenshot proves it.” | A screenshot misses keyboard, states, overflow, loading, errors, and runtime failures. Walk the path. |
| “The animation makes the page feel alive.” | Motion without a state or relationship is attention tax. Give it a job and a reduced-motion path. |
| “Accessibility is separate from design.” | Accessibility changes hierarchy, content, controls, motion, and error recovery. Design it from the start. |
| “The design system can be documented later.” | Undocumented decisions drift. Record durable choices after the world is coherent and before reuse. |

## Red Flags

- The page could be reskinned for an unrelated product without changing its structure or copy.
- A generic hero, oversized headline, eyebrow badge, metric block, or identical card grid carries the whole page.
- Purple/blue gradients, cyan neon, cream/editorial defaults, glass panels, glow halos, stripes, or grid backgrounds appear without a product job.
- Inter/Geist/system display type is selected without a character or usage reason.
- Icons, illustrations, or data are placeholders, decorative, or inconsistent.
- Every section has the same padding, density, animation, and card treatment.
- The primary action is unclear, buried, duplicated, or visually equal to secondary actions.
- Real copy causes wrapping, overflow, clipped menus, or broken hierarchy.
- No visible focus, reduced-motion behavior, loading/error/empty states, or touch-safe interaction exists.
- Review relies on memory or one desktop screenshot rather than rendered evidence across sizes.

## Verification

- [ ] The route, surface mode, audience, primary task, success, constraints, and visual authority are explicit.
- [ ] The chosen direction has THESIS, OWN-WORLD, STORY, FIRST VIEWPORT, FORM, and FINISH blocks when creating or replacing a surface.
- [ ] The composition is driven by content and task; it is not a category template with renamed copy.
- [ ] Typography, palette, spacing, shape, depth, imagery, icons, and motion have documented reasons and follow the design system.
- [ ] Realistic content, assets, and factual claims were checked; no broken or placeholder media ships.
- [ ] Default, hover, focus, active, disabled, loading, error, empty, success, and permission states are handled where relevant.
- [ ] Desktop, mobile, intermediate, and wide layouts were inspected; no overflow, clipping, or collapsed hierarchy remains.
- [ ] Keyboard navigation, focus visibility, semantics, labels, contrast, touch targets, and reduced motion were checked.
- [ ] Browser console, image loading, layout shift, and interaction behavior were checked when runtime evidence is available.
- [ ] The final pass is bounded: one batched inspection, one fix batch, and at most one confirmation round.
- [ ] Durable visual decisions are recorded in `DESIGN.md`; task-specific strategy remains in a surface brief.

## See Also

- `frontend-ui-engineering` for component architecture and accessible implementation.
- `browser-testing-with-devtools` for browser runtime evidence.
- `performance-optimization` for measured performance work.
- `../../references/accessibility-checklist.md` for the shared accessibility baseline.

## Attribution

This skill is a native Viserys adaptation of the Impeccable design guidance and anti-pattern catalog by Paul Bakaus, derived from https://github.com/pbakaus/impeccable and https://impeccable.style/. The upstream work is Apache-2.0 licensed. Viserys does not include the upstream runtime, binary, hooks, detector, or extension.
