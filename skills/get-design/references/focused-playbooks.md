# Focused Design Playbooks

Load only the section matching `/get-design <mode>`.

## layout

1. Identify the primary task, reading order, and information priority.
2. Map groups by relationship; use proximity before containers.
3. Establish a spacing scale with tight internal gaps and larger inter-group gaps.
4. Balance density and quiet; vary section rhythm without breaking the grammar.
5. Build fluid responsive composition at narrow, intermediate, and wide widths.
6. Check optical alignment, heading ownership, scroll boundaries, overflow, and overlay layers.

## typeset

1. Inventory actual fonts, sizes, weights, line-heights, widths, and roles.
2. Choose type character from product, mode, platform, and reading need.
3. Create visible hierarchy steps; avoid labels and badges that repeat headings.
4. Set body measure near 65–75ch and body line-height near 1.5 as a starting point.
5. Keep display tracking above roughly -0.04em and display size within the viewport's content needs.
6. Test real copy, long words, localization, zoom, font loading, and every breakpoint.

## colorize

1. Identify semantic roles: background, surface, foreground, muted, action, border, success, warning, error, focus.
2. Pick a strategy: restrained, committed, full palette, or drenched.
3. Choose light/dark from the usage scene, not category habit.
4. Use color in meaningful regions and states, not scattered decoration.
5. Tint secondary text from colored surfaces and verify contrast.
6. Check every interactive/state combination and both themes when supported.

## animate

1. Name the state change, relationship, feedback, or narrative moment.
2. Choose one motion grammar and one authored moment.
3. Keep content visible by default and interactions interruptible.
4. Prefer performant properties; bound blur/filter/shadow and avoid layout shifts.
5. Design a reduced-motion alternative that preserves meaning.
6. Test keyboard, touch, rapid repeated input, cancellation, and low-performance behavior.

## bolder

1. Preserve product truth and working behavior.
2. Increase hierarchy contrast, compositional commitment, type scale, imagery confidence, or page-scale color—not all indiscriminately.
3. Replace timid symmetry and repeated cards with one stronger structural idea.
4. Add one memorable product-specific moment.
5. Verify the result remains clear, accessible, and usable.

## quieter

1. Identify competing emphasis, redundant decoration, and unnecessary motion.
2. Reduce the number of accents, depth signals, type voices, and simultaneously loud elements.
3. Preserve one clear primary action and the incumbent identity.
4. Remove glow, gradients, glass, stripes, pills, badges, and shadows that carry no task or state.
5. Verify hierarchy remains strong rather than becoming flat.

## distill

1. Identify the user's primary decision or action.
2. Remove duplicate labels, repeated explanation, redundant cards, and decorative chrome.
3. Group secondary actions and progressively disclose advanced options.
4. Flatten nested surfaces and reduce visible choices to manageable groups.
5. Verify required information, recovery, and accessibility remain intact.

## clarify

1. Identify what the user must understand and do next.
2. Replace jargon and generic claims with concrete actions and outcomes.
3. Make controls name their action; make errors name problem and recovery.
4. Remove repeated copy, forced contrast slogans, and em-dash-heavy phrasing.
5. Test labels in context, including destructive actions and empty/error states.

## adapt

1. Preserve product truth, visual world, and task.
2. Recompose rather than merely scale: reorder, collapse, pin, scroll, or disclose according to the target device.
3. Respect platform-native navigation, controls, safe areas, input methods, and density.
4. Test intermediate sizes, orientation, text scaling, touch, keyboard, and reduced motion.
5. Verify no content or capability disappears without an intentional alternative.

## harden

Design and test default, loading, empty, error, success, disabled, permission, offline, slow, missing-data, long-content, localization, and concurrent-action states. Make recovery explicit, preserve entered data, prevent duplicate actions, handle interrupted navigation, and verify screen-reader announcements.

## onboard

1. Define the first useful result, not a tour completion.
2. Teach through action with realistic defaults or sample data.
3. Use empty states as activation paths.
4. Defer optional setup and advanced configuration.
5. Preserve skip, back, resume, and recovery paths.
6. Measure whether users reach value, not whether slides were viewed.

## optimize

1. Establish a baseline from browser measurements or profiler evidence.
2. Prioritize user-visible bottlenecks: loading, LCP, INP, CLS, long tasks, images, fonts, and render churn.
3. Fix the cause at the narrowest level.
4. Re-measure under the same conditions.
5. Report before/after evidence; label anything unmeasured as potential impact.

## delight

1. Find a meaningful moment: completion, discovery, mastery, collaboration, or recovery.
2. Tie delight to product language, data, assets, or interaction—not generic confetti.
3. Keep it brief, optional, accessible, and repeat-safe.
4. Ensure it never delays the task or obscures state.

## overdrive

1. Confirm the brief permits experimental expression.
2. Choose one technically ambitious mechanism rooted in the product world.
3. Build the real technique rather than a static imitation.
4. Budget performance, input compatibility, fallbacks, reduced motion, and accessibility.
5. Keep task, content, and action legible; spectacle cannot become the only interface.

## polish

1. Read the incumbent system and preserve its identity.
2. Classify each issue: missing token, one-off implementation, conceptual mismatch, or local defect.
3. Triage task blockers and missing states before visual details.
4. Fix the whole path at representative viewports and input methods.
5. Run one batched inspection, one fix batch, and one confirmation round.
6. Finish with a clean diff and no temporary artifacts.

## document

1. Extract observed tokens and component patterns from source and rendered output.
2. Ask before replacing an existing DESIGN.md.
3. Write canonical sections: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts.
4. Keep token values normative and prose contextual.
5. Record only durable, evidenced decisions.

## extract

1. Inventory repeated visual patterns and their semantics.
2. Merge only patterns with the same purpose and behavior; similarity alone is insufficient.
3. Promote stable primitives to tokens and stable behavior to shared components.
4. Preserve variants that express real state or task differences.
5. Migrate usages incrementally and verify visual/behavioral parity.

## Attribution

Adapted for Viserys from Impeccable command guidance by Paul Bakaus, Apache-2.0. Modifications consolidate command playbooks and remove upstream-specific runtime mechanics.
