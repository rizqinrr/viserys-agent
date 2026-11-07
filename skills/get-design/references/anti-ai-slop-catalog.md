# AI Slop and Quality Catalog

Use this catalog during design, critique, audit, and polish. A finding is a reason to inspect the product context, not an automatic ban. Preserve a deliberate choice when the brief, established design system, platform convention, or user need earns it; document the reason.

## Design-system consistency — 4 checks

1. **Font outside the documented system** — Use an approved face or update DESIGN.md when the addition is intentional.
2. **Color outside the documented palette** — Use a semantic token or record the new role; avoid one-off raw colors.
3. **Radius outside the documented scale** — Use the shape scale or establish a new reusable form rule.
4. **Font size outside the type scale** — Use an existing role or add a deliberate scale step.

## Visual details — 8 checks

1. **Decorative grid-line background** — Grids belong to canvases, maps, blueprints, or measurement tasks; otherwise use a surface or subject-specific texture.
2. **Border accent on a rounded element** — A thick colored outline competes with content; use a quiet edge or background-defined grouping.
3. **Glassmorphism everywhere** — Blur, glass, and glow need a layering or material reason, not generic “premium” decoration.
4. **Side-tab accent border** — A thick colored side stripe signals status or alert. Remove it when no state is communicated.
5. **Hairline border with wide shadow** — Pick one depth definition: edge, tonal layering, or shadow.
6. **Repeating-gradient stripes** — Use only when stripes belong to the subject or task; otherwise they are empty-space noise.
7. **Extreme border-radius on cards** — Match the curve to size, density, content, and system hierarchy; avoid blob-like containers by reflex.
8. **Rough SVG illustrations** — Ship a finished vector, diagram, photo, or no illustration. A sketchy placeholder lowers the finish of the whole surface.

## Typography — 11 checks

1. **Label above a heading** — Remove an eyebrow/kicker that repeats the heading; integrate useful context into the heading or nearby copy.
2. **Tiny interface text** — Navigation, controls, and links must remain legible without zoom.
3. **Flat type hierarchy** — Make roles visibly distinct through size, weight, spacing, width, and placement.
4. **Icon tile stacked above heading** — Place the icon beside its label or remove the tile unless the container carries real meaning.
5. **Italic serif display headline by reflex** — Choose a display treatment from product character, not the default editorial shortcut.
6. **Badge above the main headline** — Pills look clickable and compete with the offer. Keep only information that genuinely helps the decision.
7. **Oversized hero headline** — Leave first-screen room for meaning, proof, and action; shorten or scale long display copy.
8. **Crushed letter spacing** — Keep display tracking no tighter than roughly -0.04em and test every breakpoint.
9. **Overused font** — Inter, Geist, and system defaults are valid workhorses, but a brand surface needs a deliberate reason and sufficient hierarchy.
10. **Single font with flat treatment** — One family can work; vary roles before adding another family. Add a second only when it creates useful contrast.
11. **All-caps body text** — Reserve uppercase for short labels; use sentence case for prose.

## Color and contrast — 7 checks

1. **Radial-gradient background halo** — Remove a bright ambient glow when it has no role or competes with content.
2. **Soft spotlight behind content** — Use hierarchy, spacing, and contrast to guide attention before adding a vague glow.
3. **AI-default palette** — Purple-to-blue gradients and bright cyan on dark surfaces need a product-specific reason.
4. **Dark mode with glowing accents** — Dark does not imply neon. Reduce glow so information, state, and action dominate.
5. **Gradient text** — Prefer solid color plus weight, scale, or placement for emphasis.
6. **Gray text on a colored background** — Tint secondary text from the surface hue or use a contrasting light/dark foreground; verify WCAG contrast.
7. **Cream/beige palette by reflex** — Warm neutrals are legitimate when they belong to the product world; do not use them as a substitute for art direction.

## Layout and space — 12 checks

1. **Tiny numbered section labels** — Keep numbers only when order or sequence matters.
2. **Cards flush against scroller edges** — Give the first and last item matching boundary space.
3. **Text covered by another element** — Reserve space or move the layer; readable content must remain readable.
4. **Unbalanced opening columns** — Rebalance, align by intent, or move the long content below rather than leaving accidental dead space.
5. **Heading closer to the previous section** — Give headings more space above than below so ownership is obvious.
6. **Hero metric template** — Lead with a metric only when it explains value and has enough context to mean something.
7. **Identical card grids** — Group related ideas and vary treatment according to information priority.
8. **Monotonous spacing** — Use tight groups and larger separation between distinct concepts; equal gaps erase relationships.
9. **Nested cards** — Flatten the hierarchy with spacing, type, dividers, or tonal surfaces.
10. **Line length too long** — Keep prose near 65–75 characters per line, adjusted for typeface and context.
11. **Content overflow** — Let content wrap and containers shrink; use a deliberate scrolling region when necessary.
12. **Clipped menus and popovers** — Remove the clipping ancestor or render overlays in an appropriate layer/portal.

## Motion — 6 checks

1. **Pulsing status dot** — Static status stays still; pulse only for active change that deserves attention.
2. **Decorative blinking cursor** — Use a cursor only where text is editable or a terminal metaphor is real.
3. **Auto-scrolling marquee** — Keep information still or provide pause and manual controls.
4. **Bounce/elastic easing** — Routine actions should settle quickly; playful overshoot needs a product-appropriate moment.
5. **Animation that changes layout** — Prefer transforms for visual movement; when layout must change, measure and prevent shifts.
6. **Images that move on hover** — Give the actionable container feedback; keep non-action imagery stable unless motion explains interaction.

## Copy — 5 checks

1. **Same text repeated inside one container** — Keep the label once at the point of decision.
2. **Em-dash overuse** — Use full stops, commas, colons, or parentheses when they make the thought easier to follow.
3. **Generic marketing claims** — Replace “supercharge”, “world-class”, “enterprise-grade”, and “next-generation” with concrete capabilities, outcomes, and proof.
4. **Forced contrast slogan** — Avoid repetitive “Not X. Y.” constructions; explain the useful distinction directly.
5. **Calling things “theater”** — Name the ineffective behavior and explain why rather than dismissing it with attitude.

## Imagery — 4 checks

1. **Placeholder-style illustrations** — Generic circles and blocks say little. Use imagery specific to the product or omit it.
2. **Jagged image masks** — Use a prepared alpha matte or clean crop for organic subjects rather than a crude polygon/radial cutout.
3. **Images hidden under overlays** — Reduce the overlay until the image contributes, or remove an image with no purpose.
4. **Broken or placeholder image source** — Add the intended asset and verify loading, or remove the element.

## General quality — 10 checks

1. **JavaScript errors on load** — Fix runtime errors before visual polish.
2. **Content stuck waiting to appear** — Content must be visible by default and remain usable when animation fails.
3. **Cramped padding** — Separate text and controls from edges using the spacing scale.
4. **Body text touching the viewport edge** — Add responsive horizontal containment.
5. **Justified text without careful hyphenation** — Prefer start alignment when justification produces rivers and uneven gaps.
6. **Low-contrast text** — Meet WCAG AA: 4.5:1 normal text, 3:1 large text.
7. **Skipped heading level** — Match headings to document structure for scanning and assistive navigation.
8. **Tight line-height** — Start body copy around 1.5 and tune for face, size, and measure.
9. **Tiny body text** — Start around 16px for ordinary web prose and verify on actual mobile and desktop rendering.
10. **Wide letter spacing on body text** — Keep prose near the font's default tracking; reserve wide tracking for short labels.

## Craft floor

A design is not complete until it also clears these cross-cutting checks:

- **Contrast:** body/placeholder ≥4.5:1; large text ≥3:1.
- **Depth:** an offset plus soft blur can express elevation; a zero-offset colored halo is decoration.
- **Spacing:** related groups are tight, distinct groups have room, and headings have more space above than below.
- **Type:** readable measure, visible scale steps, bounded display size, tracking floor, real copy at every breakpoint.
- **Motion:** one coherent grammar, visible defaults, smooth bounded effects, meaningful reduced-motion behavior.
- **States:** default, hover, focus, active, disabled, loading, error, empty, success, permission, and offline where relevant.
- **Browser surfaces:** selection, caret, scrollbar, focus ring, underline offset, and tabular numerals should not accidentally contradict the system.
- **Copy:** controls state their action; errors state problem and recovery.
- **Coverage:** every brief requirement is present and findable within seconds.

## Category defaults to challenge

Challenge these when the brief leaves the axis open:

- Generic hero plus feature grid plus metrics plus CTA.
- Same-size cards with icon, heading, and paragraph as the page scaffold.
- Big number plus tiny label and supporting stats as the hero.
- Eyebrow labels and numbered sections with no informational purpose.
- Modal-by-reflex.
- Gradient text, decorative glass, side stripes, hard offset shadows outside an actual neobrutalist system.
- Progress rings, sparklines, and rounded soft-shadow rectangles standing in for content.
- Monospace as a costume for “technical”.
- System display faces as a brand voice without intent.
- Emoji/Unicode glyphs as the icon system.
- Geometric masks pretending to be organic cutouts.
- Light/dark selected from category stereotype rather than the use scene.

## Attribution

Adapted and expanded for Viserys from Impeccable's Slop catalog and craft-floor guidance by Paul Bakaus. Upstream: https://github.com/pbakaus/impeccable and https://impeccable.style/slop. Apache License 2.0; modifications were made for native Viserys workflow and terminology.
