---
name: Nirmal Khedkar Portfolio
description: Personal photography and precise engineering evidence on paper, charcoal, and red.
colors:
  red: "#c43b31"
  red-hover: "#a92f27"
  paper: "#f5f2eb"
  ink: "#202321"
  night: "#19211f"
  muted: "#565c58"
  muted-surface: "#e9e6de"
  white: "#ffffff"
  route-active: "#e2685d"
  story-secondary: "#b6bdb7"
  story-body: "#d4d9d3"
  route-base: "#6d7a70"
typography:
  display:
    fontFamily: "\"Portfolio Outfit\", \"Avenir Next\", sans-serif"
    fontSize: clamp(70px, 7.5vw, 96px)
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "\"Portfolio Outfit\", \"Avenir Next\", sans-serif"
    fontSize: clamp(40px, 4.4vw, 56px)
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "\"Portfolio Outfit\", \"Avenir Next\", sans-serif"
    fontSize: clamp(24px, 2.4vw, 32px)
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "\"Portfolio Outfit\", \"Avenir Next\", sans-serif"
    fontSize: 17px
    lineHeight: 1.65
  label:
    fontFamily: "\"Portfolio Plex Mono\", ui-monospace, monospace"
    fontSize: 12px
    lineHeight: 1.7
rounded:
  square: "0"
  portrait: 14px
spacing:
  compact: 8px
  control: 16px
  gutter: 22px
  row: 24px
  desktopGutter: 32px
  column: 48px
  mobileSection: 56px
  wideColumn: 64px
  section: 88px
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    rounded: "{rounded.square}"
    padding: 0 24px
    height: 48px
  button-primary-hover:
    backgroundColor: "{colors.red-hover}"
    textColor: "{colors.white}"
  button-inverse:
    backgroundColor: "{colors.white}"
    textColor: "{colors.red}"
    rounded: "{rounded.square}"
    padding: 0 24px
    height: 48px
  contact-field:
    textColor: "{colors.white}"
    rounded: "{rounded.square}"
    padding: 10px 2px
  project-row:
    textColor: "{colors.ink}"
    padding: 24px 0
  technology-tag:
    textColor: "{colors.muted}"
    padding: 5px 9px
    rounded: "{rounded.square}"
  workflow-panel:
    backgroundColor: "{colors.paper}"
    padding: 12px 28px 18px
    rounded: "{rounded.square}"
---

# Design System: Nirmal Khedkar Portfolio

## Overview

**Creative North Star: "Portrait to Engineering"**

Personal photography introduces the person behind the engineering. Warm paper, charcoal, and a single red identity carry both the quiet editorial sections and the cinematic desktop opening. Outfit gives the name and chapter statements scale; Plex Mono keeps technical metadata compact.

Depth comes from photography, contrasting surfaces, and a continuous scroll composition rather than decorative cards. Motion is progressive enhancement: the portrait and engineering story remain readable in normal flow without JavaScript, on smaller screens, and with reduced motion.

**Key Characteristics:**
- Existing personal photography and red identity.
- Large, closely spaced Outfit headings; compact Plex Mono metadata.
- Flat ruled rows and precise workflow geometry.
- Scroll-driven storytelling with an equally readable static form.

## Colors

Warm paper and charcoal establish the reading surfaces; red marks decisive actions and engineering emphasis.

### Primary
- **Red** (`red`): primary actions, focus rings, active underlines, diagram annotations, and the closing contact surface.
- **Deep red** (`red-hover`): primary action hover.
- **Route red** (`route-active`): the brighter active path and node treatment on charcoal, specific to the engineering story.

### Neutral
- **Paper** (`paper`): main reading surface and workflow panel.
- **Ink** (`ink`): text on paper.
- **Night** (`night`): engineering story, About, and code surfaces.
- **Muted ink** (`muted`): supporting copy and metadata on light surfaces.
- **Muted paper** (`muted-surface`): project section background.
- **White** (`white`): inverse actions and contact text.
- **Story secondary / story body** (`story-secondary`, `story-body`): secondary chapter statements and readable supporting copy on night.
- **Route base** (`route-base`): inactive engineering path and node outlines.

**The Evidence Rule.** Route diagrams and engineering chapters point to real project or experience evidence; geometry explains the work.

## Typography

**Display Font:** Portfolio Outfit, locally hosted variable Outfit, with Avenir Next and sans-serif fallbacks.
**Body Font:** same Outfit stack.
**Label/Mono Font:** Portfolio Plex Mono, locally hosted IBM Plex Mono, with ui-monospace and monospace fallbacks.

**Character:** clear, rounded letterforms with tight headline spacing. Contrast comes from scale and weight rather than switching display families.

### Hierarchy
- **Display:** the frontmatter display role describes the desktop name. Tablet uses `clamp(58px, 8vw, 76px)`; mobile uses `clamp(64px, 16vw, 84px)`.
- **Headline:** homepage section titles use the headline role. Static engineering title uses `clamp(44px, 5vw, 64px)`; enhanced chapter titles use `clamp(38px, 4.2vw, 60px)` at weight (500).
- **Title:** project-row title role; writing titles use `clamp(24px, 2.5vw, 32px)` and line-height (1.2).
- **Body:** reading paragraphs use the body role with a typical measure (68ch); experience bullets use (16px), line-height (1.65), maximum (75ch). Intro positioning uses `clamp(22px, 2.1vw, 28px)`, line-height (1.3).
- **Label:** technical project tags use the label role; compact dates use the same family and size. Controls use Outfit rather than mono.

**The Two Registers Rule.** Use Outfit for names, claims, and reading; reserve Plex Mono for technical tags, dates, and compact metadata.

## Layout

Homepage sections share a content measure (1200px), gutters (32px desktop / 22px mobile), and section padding (88px desktop / 56px mobile). Two-column headings, experience rows, feature projects, writing, and About collapse to one column below (768px). The navigation switches to a full-height mobile menu below (1024px). Other existing routes retain their own wider editorial measures; the homepage measure is not a global override.

The portrait opening has two columns (1.1fr / .9fr), gap (64px), and minimum height (100svh); mobile stacks copy above the portrait. Static engineering chapters use two columns and become one column on mobile. Four chapters always exist in document order: Product, Infrastructure, Security, AI.

At minimum width (1024px), minimum height (680px), and no reduced-motion preference, a successful enhancement gives the story a height (460svh) and a sticky frame (100svh). Intro copy recedes, the portrait moves inward and fades, and charcoal engineering content replaces paper. The route draws through four proof-backed chapters. Smaller or shorter viewports, reduced motion, failed imports, and disabled JavaScript retain normal flow. Experience, projects, newest-two writing, About, and contact continue below.

## Elevation & Depth

Homepage content is flat at rest: rules, tonal changes, image crops, and typography separate sections without card shadows. The fixed navigation uses translucent charcoal with backdrop blur (22px) and saturation (1.15) after the opening; over the opening it becomes transparent and follows the story's light/dark tone. The mobile menu uses a dimmed backdrop and blur (8px).

Story depth comes from scroll-linked opacity and transforms. Chapter transitions use opacity (360ms ease-out) and transform (500ms cubic-bezier(.16, 1, .3, 1)); action color changes use (160ms ease-out). These are scoped interaction behaviors, not instructions to animate every section.

**The Readable Baseline Rule.** Keep the complete introduction and all four engineering chapters in normal flow until the desktop enhancement is ready. Reduced motion stays static.

## Shapes

Buttons, fields, ruled lists, and workflow panels are square. The portrait alone uses the dedicated portrait radius; About remains an unrounded photographic crop. Fine rules establish rows, while simple circles and orthogonal paths describe the engineering map. Inline SVG supplies arrows and diagrams.

## Components

### Buttons
Quiet, flat controls. The primary action is white on red with the frontmatter primary dimensions; hover deepens red. Contact submission reverses the colors. Secondary intro actions are text links with a minimum target height (48px). Homepage links and buttons use a red focus outline (3px), offset (5px); navigation uses (2px), offset (3px). Contact fields use a white outline (2px), offset (4px). Submission's disabled state uses opacity (.65) and a wait cursor.

### Cards / Containers
Editorial rows replace decorative cards: thin ink rules, generous vertical padding, no resting shadow. Project rows combine title, concise description, mono tags, and an SVG arrow. Writing uses two flat columns on desktop and one on mobile. The Whirlwind workflow sits on paper within the muted project section; its SVG uses ink labels, muted strokes, and red annotations.

### Inputs / Fields
Contact fields stay transparent on red with a white lower rule, square corners, minimum height (54px), and white focus treatment. Textarea minimum height is (100px) and resizes vertically. Existing search fields on paper use an ink lower rule and red focus. Preserve native inputs, labels, validation, and submit states.

### Navigation
Fixed navigation is (64px) high on desktop and (60px) below (1024px). Homepage gutters track its content measure. Text and borders adapt to the light opening; the engineering phase uses the dark treatment. Current and hovered links gain a red underline. Mobile opens a paper menu with large ruled navigation rows. Home and the brand explicitly return same-page navigation to the top; work/contact anchors and direct project links remain available.

### Technical tags
Plex Mono metadata stays compact. Project pages use thin outlined square tags; homepage project tags are an unboxed text line. Do not turn metadata into prominent action chips.

### Cinematic engineering story
The portrait-led name and concise role lead into four chapters with real proof links. The route is decorative SVG, hidden from assistive technology. Enhancement makes inactive visual chapters inert, so keyboard focus follows the visible chapter; static mode restores the complete readable list. Motion reacts to scroll and viewport changes without a timer loop or animation dependency.

### Photography
The coast portrait uses the existing `src/assets/images/BeachNK_1.jpg`; About uses `src/assets/images/TreesNK_1.jpg`. Origin: existing user repository assets, retained unchanged. No new raster asset was produced. Figure captions sit on dark translucent backgrounds; framing and object position belong to each photograph, not a universal image crop.

## Do's and Don'ts

### Do:
- **Do** preserve the existing beach and trees photographs and the paper, charcoal, red identity.
- **Do** keep actions, proof links, and visible keyboard focus accessible throughout both story modes.
- **Do** use flat rules, generous section spacing, and real engineering geometry to organize content.

### Don't:
- **Don't** hide required content behind animation or require the cinematic route to reach work, résumé, or contact.
- **Don't** turn the portrait radius into a rounded-card system; editorial rows and controls stay square.
- **Don't** replace existing photographs or invent project claims, metrics, testimonials, or product interfaces.
