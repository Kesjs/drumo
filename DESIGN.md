---
name: Drumo
description: Administratif moderne — platformă de pregătire și examinare teoretică auto pentru România.
colors:
  asphalt: "#18202b"
  chalk: "#f5f6f3"
  surface: "#ffffff"
  signal: "#f2b705"
  sign: "#0b4ea2"
  line: "#d9dcd6"
  mute: "#4a5461"
  ok: "#1f7a4d"
  danger: "#b42318"
typography:
  display:
    fontFamily: "IBM Plex Sans Condensed, IBM Plex Sans, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "IBM Plex Sans Condensed, IBM Plex Sans, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  title:
    fontFamily: "IBM Plex Sans Condensed, IBM Plex Sans, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.3
  mono:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.asphalt}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.asphalt}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
  card-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.asphalt}"
    rounded: "{rounded.md}"
    padding: "24px"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.asphalt}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
---

# Design System: Drumo

## Overview

**Creative North Star: "Administratif moderne"**

Drumo adopts the clarity and quiet authority of European road signage and official public-service stationery. Surfaces sit on warm chalk paper (`#f5f6f3`) and crisp white sheets (`#ffffff`), anchored by deep asphalt ink (`#18202b`). A single signal-yellow accent (`#f2b705`) marks primary actions, active progress, and key highlights—never decorative gradients. Sign blue (`#0b4ea2`) appears strictly in small informational touches, links, and focus rings.

In Persuade mode (public landing and category pages), condensed headlines carry strong editorial authority paired with live product mockups and real Romanian road photography. In Operate and Read modes (candidate workspace, lessons, exam room, and admin), the visual voice steps back into calm, predictable precision: high-contrast tabular numerals, explicit state indicators, and zero distraction during timed assessments.

**Key Characteristics:**
- Warm chalk canvas (`#f5f6f3`) with high-contrast asphalt ink (`#18202b`) and crisp 1px–2px structural rules.
- Signal yellow (`#f2b705`) reserved exclusively for primary actions, active progress bars, and selection markers, always paired with dark asphalt text.
- Condensed display headings paired with humanist sans body copy and tabular monospace codes/timers, all supporting full Romanian diacritics (`ș`, `ț`).
- Real Romanian road sign photography with explicit public attribution—never vector clip-art, 3D renders, or AI-generated illustrations.

## Colors

A restrained, road-signage-inspired palette anchored in neutral chalk and asphalt with one active signal accent.

### Primary
- **Signal Yellow** (`colors.signal`): Used as background fill for primary CTAs, active progress bars, and the "Permis" wordmark badge. Never used as text color on light surfaces due to contrast; always paired with asphalt (`colors.asphalt`) foreground text.
- **Sign Blue** (`colors.sign`): Used in restrained touches for informational links, step numerals, secondary progress indicators, and the 3px keyboard focus ring.

### Neutral
- **Asphalt Ink** (`colors.asphalt`): Primary foreground text, 2px structural borders, active navigation pills, and dark high-contrast bands (trust strip, final CTA).
- **Chalk Ground** (`colors.chalk`): Default page background across public and app shells, mimicking unbleached administrative paper.
- **Paper Surface** (`colors.surface`): Elevated sheet background for product frames, lesson cards, payment panels, and tables.
- **Muted Slate** (`colors.mute`): Secondary explanatory text, metadata, and inactive navigation labels (maintaining >= 4.5:1 contrast on chalk and white).
- **Hairline Rule** (`colors.line`): Subtle 1px dividers between table rows, FAQ items, and sidebar borders.

### Semantic
- **Status OK** (`colors.ok`): Unlocked courses, completed chapters (100%), active camera badge, and passing exam results.
- **Status Danger** (`colors.danger`): Validation errors, held/rejected KYC or certificate alerts, and critical timer warnings (< 10s).

### Named Rules
**The One Signal Rule.** Signal yellow (`colors.signal`) appears only on primary actions, active progress indicators, and focus highlights (under 10% of the viewport). Its scarcity makes every action unambiguous.
**The Asphalt Text Rule.** Never place white or light text on Signal Yellow. All Signal Yellow surfaces carry Asphalt Ink (`colors.asphalt`) text.

## Typography

**Display Font:** `IBM Plex Sans Condensed` (weights 600, 700, `latin-ext` subset)
**Body Font:** `IBM Plex Sans` (weights 400, 500, 600, `latin-ext` subset)
**Label/Mono Font:** `IBM Plex Mono` (weight 500, `latin-ext` subset)

**Character:** Engineered clarity with administrative discipline. Condensed headlines pack authoritative Romanian phrasing into tight vertical columns without losing legibility; regular sans handles long-form highway-code explanations comfortably; monospace enforces tabular alignment for timers, scores, RON/EUR amounts, and `DR-XXXX-XXXX` certificate codes.

### Hierarchy
- **Display** (700, `3rem`–`4.5rem`, line-height `1.02`, tracking `-0.02em`): Hero headline only.
- **Headline** (700, `2.25rem`–`3rem`, line-height `1.08`, tracking `-0.015em`): Section titles and primary app page headings.
- **Title** (700, `1.25rem`–`1.5rem`, line-height `1.2`): Card titles, step headings, and chapter headers.
- **Body** (400, `1rem`–`1.125rem`, line-height `1.6`): Lesson prose, explanations, and FAQ answers, capped at `60ch`–`72ch` measure.
- **Label** (600, `0.875rem`, line-height `1.3`): Buttons, form labels, badges, and table headers.
- **Mono** (500, `0.875rem`–`1.5rem`, tabular-nums): Exam countdown timer, certificate codes, payment amounts, and step indices.

### Named Rules
**The Proper Diacritic Rule.** Always use Romanian comma-below characters (`ș`/`Ș`, `ț`/`Ț`, U+0218..U+021B) loaded via `latin-ext`, never Turkish cedillas (`ş`, `ţ`).
**The Measure Cap Rule.** Lesson and FAQ paragraphs never exceed `65ch` so reading remains calm on wide screens.

## Layout

Centered single-column and asymmetric two-column grids constrained to `max-w-6xl` (`1152px`) with `px-5` (`20px`) horizontal gutters on mobile. Section vertical rhythm alternates `py-16` to `py-20` (`64px`–`80px`), separating clean chalk bands from crisp white bordered bands.

- **Public pages:** Sticky `64px` header (`border-b border-line`), editorial asymmetric Hero (`1fr_1.05fr` on `lg`), sticky-visual 7-step journey on desktop collapsing to inline steps on mobile, and clean 3-column legal footer.
- **App shell (Operate mode):** Fixed `240px` left sidebar on desktop (`lg:`) with mobile top drawer/bottom nav; content area uses generous white sheets (`max-w-4xl` for lessons, `max-w-3xl` centered for exam room with zero distractions).
- **Exam room:** Distraction-free full-height layout—top status bar (question progress, camera indicator, server-synced countdown), single centered question + real photo, explicit action bar, no back navigation.

## Elevation & Depth

Surfaces rely primarily on crisp `1px` (`colors.line`) and `2px` (`colors.asphalt`) structural borders rather than ambient drop shadows. Product preview frames on the public landing page carry a distinct `8px 8px 0` Signal Yellow offset plate (`shadow-[8px_8px_0_#f2b705]`) that anchors mockups as physical dossiers. Inside the authenticated Operate/Read workspace, elevation is completely flat—depth is communicated strictly by `chalk` vs `surface` tonal contrast and hairline borders.

## Shapes

- **Buttons & Inputs:** Crisp `4px` (`rounded`) corners with solid `2px` asphalt borders on primary and secondary buttons.
- **Panels & Mockups:** `8px` (`rounded-lg`) corners with `2px` asphalt or `1px` hairline borders.
- **Progress Bars & Badges:** `9999px` pill tracks (`h-1.5` or `h-2`) for linear progress; `4px` rectangular tags (`rounded`) for status chips—never oversized pills for layout cards.
- **Sign Photographs:** Square or `4:3` containers with `object-contain` or clean `object-cover` framing and caption/credit attribution.

## Components

### Buttons
- **Shape:** `4px` radius (`rounded`), `2px` solid `colors.asphalt` border.
- **Primary:** Signal Yellow fill (`colors.signal`), Asphalt Ink text (`colors.asphalt`), `14px 24px` padding (`px-6 py-3.5`), `1px` downward press (`active:translate-y-px`).
- **Secondary:** Transparent fill, `2px` solid `colors.asphalt` border, Asphalt Ink text, subtle chalk/white hover tint.
- **Focus:** `3px` solid Sign Blue (`colors.sign`) outline with `3px` offset (`:focus-visible`).

### Cards / Containers
- **Corner Style:** `8px` radius (`rounded-lg`).
- **Background:** Crisp white (`colors.surface`) over chalk ground (`colors.chalk`).
- **Border:** `1px` `colors.line` inside app workspace; `2px` `colors.asphalt` for key action/payment containers.
- **Internal Padding:** `24px` (`p-6`) on public cards, `16px`–`24px` inside app workspace.

### Inputs / Fields
- **Style:** `4px` radius (`rounded`), `1px`–`2px` solid `colors.asphalt` or `colors.line` border, `colors.surface` background, `44px` minimum touch height.
- **Focus:** `3px` Sign Blue (`colors.sign`) focus-visible ring.
- **Error:** `colors.danger` border with explicit Romanian inline recovery message below the field.

### Navigation
- **Public Header:** `64px` sticky bar (`bg-chalk/95`, `border-b border-line`), wordmark with Signal-highlighted "Permis", concise horizontal links on `md+`, single primary CTA button.
- **App Sidebar:** Chalk/surface contrast panel with active item highlighted in solid Asphalt Ink (`bg-asphalt text-white`) and clear lock/status badges.

## Do's and Don'ts

### Do:
- **Do** keep Signal Yellow (`#f2b705`) strictly under 10% of any viewport and always pair it with Asphalt Ink (`#18202b`) text.
- **Do** use real Romanian road photographs from `credits.json` with proper `alt` text in Romanian.
- **Do** respect `prefers-reduced-motion` on all Framer Motion transitions and keep Operate-mode transitions crisp (`150–250ms`).
- **Do** enforce `44px` minimum touch targets on mobile for all exam answers, audio controls, and navigation links.

### Don't:
- **Don't** use purple gradients, neon accents, or gratuitous glassmorphism blur cards.
- **Don't** use emojis or Unicode symbols as UI icons—always use Lucide icons with consistent stroke weight.
- **Don't** add eyebrow kickers above headings, decorative section numbers (`01 / 02`), or identical 3-column icon-heading-text SaaS grids.
- **Don't** replace real road sign photographs with simplified vector drawings or AI-generated imagery.
- **Don't** ever label the platform document "permis" or "permis de conducere"—use "atestat de reușită Drumo".
