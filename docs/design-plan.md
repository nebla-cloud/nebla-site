# Nebla site design plan

Direction: Aurora light. Owner-approved, 2026-11-20.

## Palette

| Name | Hex | Role |
| --- | --- | --- |
| Page | `#FBFCFD` | Light background |
| Ink | `#15181D` | Text, primary buttons, terminal surface |
| Mint glow | `#B9F1DC` | Hero glow, left |
| Sky glow | `#BFDDFB` | Hero glow, centre |
| Rose glow | `#FFD2DE` | Hero glow, right |
| Arch gradient | `#2FC795` → `#4C9BEA` → `#EE6F95` | Logo only, plus the one "running" pulse in the hero mockup |
| Night | `#14171C` | Dark background. The glow drops to deep teal `#1E5A49`, navy `#1F3F66` and wine `#5A2A3B` |

Status colours inside mockups use Nuxt UI semantics (success, neutral). They never become brand accents.

## Type

Onest only: 800 for display, 700 for headings, 400 for body.

| Role | Size | Leading | Tracking |
| --- | --- | --- | --- |
| Display h1 | clamp(2.6rem, 6vw, 4.5rem) | 1.02 | −0.035em |
| h2 | clamp(1.9rem, 3.4vw, 2.6rem) | 1.1 | −0.025em |
| h3 | 1.25rem | 1.3 | −0.01em |
| Body | 1.0625rem | 1.6 | none |
| Small | 0.875rem | none | none |

Line length is capped at 62ch for prose and 36ch for the hero subline. Sentence case everywhere, with no all-caps labels.

## Layout

The container is left-aligned at a maximum of 1200px. Sections use different shapes: no two neighbouring sections share a layout.

```
HERO        [ h1 / sub / 2 buttons      ][  create-server mock, tilted 0°, on glow ]
HOW         1 ── 2 ── 3  (one horizontal rail, short text + tiny visual under each)
BOTH WAYS   [ terminal: nebla server create web1 ][ server detail: web1 running ]
PATHS       Homelab half (light)  |  Resellers half (ink surface)  -- two halves, not cards
OPEN        one large sentence set in display type + 3 plain facts in a row
COMPOSE     short code block (left) + "the full guide" link (right)
```

The mobile layout stacks in that order. The rail in How it works turns vertical.

## Principles

1. **The glow is the one bold thing.** It appears behind the hero only, and nowhere else on the page.
2. **The product is the imagery.** Every visual is a mockup of Nebla itself: no stock photos, no abstract 3D, no icons in coloured circles.
3. **Plain, specific copy.** Each sentence names a thing Nebla does. No superlatives, stats or quotes.
4. **Motion only for the hero card's entrance.** It respects reduced motion. Hover states change colour only.

## Review against the generic default

- My first draft had a feature grid of six identical icon cards under the hero. That's the SaaS-card kit (tell #4). I replaced it with the How it works rail and the Both ways split.
- I considered a dark "terminal" section with a neon accent. That's tell #2, so I dropped it. The terminal stays ink, with the same muted palette as the rest.
- The Homelab and Resellers paths started as two matching cards. They're now two halves with different surfaces, so they read as two audiences rather than two features.
- I dropped an eyebrow label above each h2. Headings stand alone.
