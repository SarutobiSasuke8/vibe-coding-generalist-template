---
version: alpha
name: vibe-coding-generalist
description: A practical, high-trust design system for AI-assisted product builds. It gives coding and design agents a durable visual contract for useful, reliable, polished interfaces: calm work surfaces, clear hierarchy, compact controls, accessible states, and enough character to feel intentional without overwhelming the product.
colors:
  primary: "#176B5B"
  primary-active: "#0F5447"
  primary-soft: "#DDEBE7"
  accent: "#3F6FD9"
  accent-warm: "#C95F4A"
  signal: "#B88418"
  canvas: "#F7F8F4"
  surface: "#FFFFFF"
  surface-raised: "#F0F3EE"
  surface-inset: "#E7ECE6"
  surface-dark: "#151A18"
  surface-dark-raised: "#202724"
  border: "#D9E0D8"
  border-strong: "#B8C4BA"
  ink: "#151A18"
  body: "#34413D"
  muted: "#66736F"
  muted-soft: "#8A9691"
  on-primary: "#FFFFFF"
  on-dark: "#F7F8F4"
  success: "#1F7A5C"
  warning: "#B88418"
  error: "#B5473F"
  focus: "#3F6FD9"
typography:
  display-xl:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 56px
    fontWeight: 650
    lineHeight: 1.05
    letterSpacing: 0
  display-lg:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 40px
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: 0
  title-lg:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 24px
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: 0
  title-md:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0
  title-sm:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  caption:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0
  code:
    fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, Liberation Mono, ui-monospace, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 10px
  pill: 9999px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 72px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    height: 40px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    height: 40px
  button-icon:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    size: 40px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 10px 12px
    height: 40px
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  work-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px
  code-panel:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: 16px
  badge:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-active}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
---

## Overview

This design system is the default visual contract for projects created from the Vibe Coding Generalist Template. It is intentionally product-first: interfaces should feel calm, useful, reliable, and quietly distinctive. The first screen should expose the real workflow whenever possible, not a marketing shell.

The visual language is built around a light working canvas, crisp white surfaces, deep ink text, restrained viridian primary actions, cobalt focus states, and a small warm accent for warnings, priority, or human emphasis. It should suit dashboards, internal tools, AI products, dev utilities, planning systems, lightweight SaaS, and prototypes that need to become real.

This file does not replace the design persona. `DESIGN.md` is the durable contract. `personas/design-director-vibe-coding.md` is the judgement layer that interprets the product brief, challenges weak UX, and decides when the contract should be adapted.

## How Agents Should Use This File

Read this file before generating, reviewing, or refactoring UI.

- Use frontmatter tokens for concrete values.
- Use the body sections for intent, constraints, component behavior, and anti-patterns.
- Cross-check `docs/PROJECT_BRIEF.md` for the product's desired feeling before making visual choices.
- Ask the Design Director persona to adapt this file when the project has a stronger domain-specific aesthetic.
- Keep `AGENTS.md` focused on how to build; keep `DESIGN.md` focused on how the product should look, feel, and behave.

## Colors

### Brand and Action

- `primary` (`#176B5B`): Main action color. Use for primary buttons, selected states, key progress, and small moments of confidence.
- `primary-active` (`#0F5447`): Pressed or active primary state.
- `primary-soft` (`#DDEBE7`): Quiet primary background for selected rows, badges, or subtle callouts.
- `accent` (`#3F6FD9`): Focus rings, keyboard states, data highlights, and links when link behavior matters more than brand tone.
- `accent-warm` (`#C95F4A`): Sparse human emphasis, destructive confirmation lead-ins, and editorial highlights.
- `signal` (`#B88418`): Warnings, pending states, attention markers, and review-needed badges.

### Surfaces

- `canvas` (`#F7F8F4`): App background. It is light, soft, and slightly natural without becoming beige.
- `surface` (`#FFFFFF`): Main panels, sheets, form groups, and cards.
- `surface-raised` (`#F0F3EE`): Secondary panels, table headers, and grouped controls.
- `surface-inset` (`#E7ECE6`): Inset areas, disabled zones, and recessed code-adjacent surfaces.
- `surface-dark` (`#151A18`): Code panels, terminal previews, dense command surfaces, and footer-like closures.
- `surface-dark-raised` (`#202724`): Raised elements inside dark surfaces.

### Text and Borders

- `ink` (`#151A18`): Headings, labels, and primary interface text.
- `body` (`#34413D`): Paragraphs, descriptions, and table body text.
- `muted` (`#66736F`): Secondary labels, helper text, timestamps.
- `muted-soft` (`#8A9691`): Captions, disabled text, low-priority metadata.
- `border` (`#D9E0D8`): Default hairline border.
- `border-strong` (`#B8C4BA`): Active borders, table outlines, and drag/drop boundaries.

### Semantic

- `success` (`#1F7A5C`): Completion, healthy status, connected state.
- `warning` (`#B88418`): Needs attention, partial state, review risk.
- `error` (`#B5473F`): Errors, failed validation, destructive action.
- `focus` (`#3F6FD9`): Visible keyboard focus and accessible focus rings.

## Typography

Use a single highly legible sans stack by default. The system should feel modern and precise, not editorial or ornamental. Use mono only for code, commands, IDs, logs, and machine output.

| Token | Size | Weight | Line height | Use |
|---|---:|---:|---:|---|
| `{typography.display-xl}` | 56px | 650 | 1.05 | Rare app-level hero or launch screen |
| `{typography.display-lg}` | 40px | 650 | 1.1 | Major page title |
| `{typography.title-lg}` | 24px | 650 | 1.2 | Section title, modal title |
| `{typography.title-md}` | 18px | 600 | 1.35 | Panel title, card title |
| `{typography.title-sm}` | 16px | 600 | 1.4 | Dense surface title |
| `{typography.body-md}` | 16px | 400 | 1.55 | Reading text, form descriptions |
| `{typography.body-sm}` | 14px | 400 | 1.5 | Default UI body, tables, sidebars |
| `{typography.label}` | 13px | 600 | 1.3 | Buttons, labels, tabs |
| `{typography.caption}` | 12px | 500 | 1.35 | Metadata, badges, helper text |
| `{typography.code}` | 13px | 400 | 1.55 | Code, terminal, logs |

Principles:

- Do not scale type fluidly with viewport width.
- Keep letter spacing at `0` unless a project-specific brand requires otherwise.
- Use size, weight, spacing, and placement for hierarchy before adding color.
- Use display type sparingly inside real tools; compact work surfaces should stay compact.

## Layout

### Spacing System

Use a 4px base grid. Prefer `8`, `12`, `16`, `24`, `32`, `48`, and `72` px values. Dense operational UI should use `12` to `16` px internal spacing. Marketing-like pages may use `48` to `72` px section spacing, but only when a true hero or narrative page is appropriate.

### Structure

- App shells should prioritize the core workflow: navigation, working surface, details, and status.
- Dashboards should be dense but breathable: grouped information, visible filters, persistent controls, and scan-friendly tables.
- Avoid nested cards. Use panels for large regions and cards for repeated items.
- Use max-widths intentionally: reading content can cap at 720px, tool surfaces can span the available workspace.
- Align controls to a predictable grid; do not float important actions in decorative empty space.

## Elevation and Depth

Depth should come from surface changes, borders, and purposeful layering. Shadows are allowed but should be subtle and rare.

| Level | Treatment | Use |
|---|---|---|
| Canvas | `{colors.canvas}` | Page floor |
| Surface | `{colors.surface}` with `1px {colors.border}` | Panels, cards, forms |
| Raised | `{colors.surface}` with small shadow and border | Menus, popovers, active draggable items |
| Inset | `{colors.surface-inset}` | Disabled zones, grouped filters, recessed code controls |
| Dark utility | `{colors.surface-dark}` | Terminals, logs, code, command previews |

Recommended shadow: `0 8px 24px rgba(21, 26, 24, 0.08)` for popovers and dialogs only.

## Shapes

- `xs` 4px: Tiny tags, progress segments, code chips.
- `sm` 6px: Compact controls and table affordances.
- `md` 8px: Standard buttons, inputs, cards, menus.
- `lg` 10px: Larger panels and dialogs.
- `pill` 9999px: Badges, segmented control tracks, status pills.

Avoid large rounded decorative cards. The default radius should feel engineered, not bubbly.

## Components

### Buttons

- `button-primary`: Main action. Use once per surface when possible. Default height 40px.
- `button-secondary`: Supporting action. White surface, border, ink text.
- `button-icon`: 40px square icon button for common tools. Use recognizable icons with tooltips.
- Destructive actions should use ink text until confirmation, then `error` for the final destructive button.
- Disabled buttons must look disabled and remain legible.

### Inputs and Forms

- Inputs use white surface, 1px border, 40px height, and clear labels.
- Focus state uses a cobalt ring: `0 0 0 3px rgba(63, 111, 217, 0.22)`.
- Validation appears below the field in body-sm or caption size; do not rely on color alone.
- Required fields should be clear through label or form structure, not visual noise.

### Panels and Cards

- `panel`: Primary grouped work surface. Use for forms, settings, detail panes, and major content regions.
- `work-card`: Repeated object preview. Keep the title, status, primary metadata, and next action visible.
- Cards should not contain other cards. If hierarchy is needed, use dividers, sections, or inset rows.
- Repeated cards should have stable dimensions or responsive grid constraints so content changes do not cause layout jumps.

### Navigation

- Primary navigation should be boring in the best way: stable position, clear labels, visible active state.
- Sidebars work well for tools, projects, settings, and agent workflows.
- Tabs are for switching views inside one object or workspace. Do not use tabs as hidden primary navigation.
- Breadcrumbs are useful when objects nest deeply.

### Tables and Lists

- Tables should support scanning: sticky or clear headers, consistent alignment, muted metadata, and row hover/focus.
- Row actions should be visible on focus and hover, with an accessible fallback for touch.
- Empty tables need a useful next action, not just "No data".

### Code, Logs, and Agent Output

- Use `code-panel` for code, command output, logs, and agent traces.
- Code panels should allow horizontal scroll on mobile instead of wrapping important syntax.
- Agent output should distinguish reasoning summary, action taken, tool output, verification, and next action.
- Long logs should collapse by default with a clear expand control.

### Status and Feedback

- Loading states should preserve layout when possible.
- Empty states should explain what happened and offer the next useful action.
- Error states should say what failed, whether data is safe, and how to recover.
- Success states should be brief unless the user needs a receipt, share link, or next step.

## Responsive Behavior

Breakpoints:

| Name | Width | Behavior |
|---|---:|---|
| Mobile | < 768px | Single-column, bottom-safe actions, sidebars collapse to drawers |
| Tablet | 768-1024px | Two-column where useful, compact nav, tables may become card lists |
| Desktop | 1024-1440px | Full shell, sidebars, tables, multi-column workspaces |
| Wide | > 1440px | Expand work surfaces, cap reading content, avoid stretched paragraphs |

Rules:

- Touch targets should be at least 40px, with 44px preferred for mobile-first controls.
- Core actions must remain reachable without horizontal page scrolling.
- Tables can scroll horizontally only when preserving column meaning is better than converting to cards.
- Dialogs become full-screen sheets on small screens when content or keyboard interaction is complex.

## Content and Microcopy

- Prefer specific labels over clever labels.
- Use verbs for commands: "Create task", "Run check", "Invite member".
- Avoid generic filler such as "seamless", "powerful", "unlock", and "supercharge".
- Error copy should be calm and concrete.
- Empty-state copy should orient the user and offer one next action.

## Accessibility

- Meet WCAG AA contrast for text and controls.
- Never rely on color alone for status; pair color with icon, label, or placement.
- Every interactive element needs a keyboard-visible focus state.
- Icon-only buttons need accessible labels and hover/focus tooltips when helpful.
- Motion should be subtle, purposeful, and respect reduced-motion preferences.

## Do's and Don'ts

### Do

- Build the real product surface first.
- Use `{colors.primary}` with restraint so important actions stay important.
- Use `{colors.accent}` for focus and link behavior.
- Keep operational screens dense, ordered, and easy to scan.
- Document any project-specific visual departure by updating this file.
- Ask the Design Director persona for a UX pass before large UI rewrites.

### Don't

- Do not default to a landing page when the user asked for an app, tool, or game.
- Do not use decorative gradient backgrounds, floating blobs, or ornamental card stacks to create personality.
- Do not bury primary workflows below marketing copy.
- Do not make every component a card.
- Do not introduce a brand color without assigning it a role.
- Do not copy a public brand's full visual identity into a commercial project without review.

## Agent Prompt Guide

Use this file with prompts like:

```text
Use DESIGN.md as the visual and interaction contract. Build the core workflow first, using the tokens and component rules here. Cross-check docs/PROJECT_BRIEF.md for the product's desired feeling.
```

For design review:

```text
Act as the Design Director persona. Review this UI against DESIGN.md, docs/PROJECT_BRIEF.md, and the actual rendered screen. Return the highest-impact fixes with concrete component, layout, state, and responsive changes.
```

For adaptation:

```text
Adapt DESIGN.md for this product domain without weakening usability. Preserve the token structure, component rules, accessibility bar, and agent guidance. Change only the visual language that the project brief justifies.
```

## Iteration Guide

When changing the design system:

1. Update tokens first when the change is value-level.
2. Update component entries when behavior or state changes.
3. Update body guidance when the design rationale changes.
4. Keep token names semantic, not visual-only.
5. Add known gaps instead of pretending uncertain design decisions are settled.
6. Run the agent doc check after changing references to this file.

## Known Gaps

- This template does not know the final product domain, so brand-specific imagery, illustration, and motion are intentionally undefined.
- Inter and JetBrains Mono are recommended defaults, but each project should confirm font loading and licensing.
- Chart, map, game, 3D, and rich media systems need project-specific additions.
- Native mobile apps may need platform-specific navigation, input, and safe-area rules.
