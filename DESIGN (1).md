---
name: Robotic AI Design System
colors:
  surface: '#131317'
  surface-dim: '#131317'
  surface-bright: '#39393e'
  surface-container-lowest: '#0e0e12'
  surface-container-low: '#1b1b20'
  surface-container: '#1f1f24'
  surface-container-high: '#2a292e'
  surface-container-highest: '#353439'
  on-surface: '#e4e1e8'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e4e1e8'
  inverse-on-surface: '#303035'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#a3c9ff'
  on-secondary: '#00315c'
  secondary-container: '#005da6'
  on-secondary-container: '#bcd6ff'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#909191'
  on-tertiary-container: '#282a2a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#d3e3ff'
  secondary-fixed-dim: '#a3c9ff'
  on-secondary-fixed: '#001c38'
  on-secondary-fixed-variant: '#004882'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131317'
  on-background: '#e4e1e8'
  surface-variant: '#353439'
typography:
  display-lg:
    fontFamily: DotGothic16
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: DotGothic16
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: DotGothic16
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.2'
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-upper:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.2em
  status-dot:
    fontFamily: DotGothic16
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  container-max: 1440px
---

## Brand & Style

This design system draws inspiration from the "Nothing Phone" aesthetic—a fusion of retro-tech nostalgia and ultra-modern hardware interfaces. The brand personality is precise, transparent, and sophisticatedly "robotic." It targets power users, developers, and AI enthusiasts who value functional transparency over ornamental fluff.

The visual style is a hybrid of **Minimalism** and **Glassmorphism**, grounded by **Brutalist** technical details. It leverages high-contrast borders and dot-matrix patterns to simulate a physical hardware display. The emotional response should be one of "calm technical superiority"—the UI feels like a diagnostic terminal from a near-future machine.

**Key Principles:**
- **Technical Transparency:** Use glass textures to show depth and layers.
- **Hardware Metaphor:** UI elements should look like they are etched or projected onto hardware.
- **Data-First:** Information is prioritized through stark contrast and monospaced precision.

## Colors

The palette is anchored in a "Deep Space" black to maximize the efficiency of OLED displays and emphasize the glow of functional elements. 

- **Primary (Electric Purple):** Used for primary actions, success states, and critical AI-driven insights. It provides a high-energy contrast against the dark base.
- **Secondary (Robot Blue):** Used for secondary data visualizations, progress tracking, and informational highlights.
- **Neutral/Surface:** The background is a pure, deep black. Surfaces are constructed using semi-transparent white overlays to create "glass" tiers.
- **Functional Glows:** Use low-opacity radial gradients of the primary and secondary colors to indicate activity or "processing" states behind glass panels.

## Typography

The typography strategy relies on the tension between the "lo-fi" aesthetic of dot-matrix characters and the "hi-fi" precision of developer-centric monospaced fonts.

- **Headlines & Status:** DotGothic16 is the signature font. It is used for large displays, numbers, and status indicators. It should always feel like it's being "rendered" by a hardware screen.
- **Body & Interface:** JetBrains Mono provides the functional backbone. It ensures high legibility for long-form text and technical data.
- **Tracked-out Labels:** All small labels and section headers should use `label-upper` with increased letter-spacing to evoke a technical blueprint or schematic feel.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model with an underlying 4px baseline shift. 

- **Grid:** A 12-column system is used for desktop, 6 for tablet, and 2 for mobile.
- **The "Technical Gap":** Use consistent 24px gutters to allow the dark background to "breathe" between glass panels.
- **Padding:** Internal panel padding should be generous (typically 32px) to maintain the minimalist hardware look.
- **Alignment:** All elements must align strictly to the grid; avoiding soft or centered placements in favor of structured, left-aligned terminal-style layouts.

## Elevation & Depth

This system rejects traditional drop shadows in favor of **Tonal Layering** and **Subtle Glows**.

- **Layers:** Depth is achieved by stacking `surface_glass` layers. Each subsequent layer increases in opacity by 2-3%, creating a "stacked glass" effect.
- **Borders:** Every panel uses a 1px solid border (`border_contrast`). This "ghost border" defines the physical limit of the glass.
- **Glows:** Instead of shadows, use "Backlight Glows." These are soft, blurred radial gradients (20% opacity) of the primary or secondary color placed *behind* the glass panel to indicate focus or importance.
- **Patterns:** Apply a 2px dot-matrix repeating pattern overlay (opacity 5%) to the background to reinforce the screen-texture metaphor.

## Shapes

The shape language is "Soft-Industrial." While the grid is rigid, elements have a slight radius to feel like manufactured hardware components.

- **Small elements (buttons, inputs):** Use `rounded` (0.25rem) to keep them feeling precise.
- **Large panels (cards, modals):** Use `rounded-lg` (0.5rem) to differentiate them from the smaller interactive components.
- **Segmented Elements:** Progress bars and separators should be built from individual square or slightly rounded blocks to mimic a physical LED display.

## Components

### Buttons
- **Primary:** Solid `primary_color_hex` with black JetBrains Mono text. Include a subtle outer glow of the same color.
- **Ghost:** 1px `border_contrast` with white text. On hover, background becomes `surface_glass`.
- **Text:** Uppercase, tracked-out, with a ">>" suffix for actionability.

### Segmented Progress Bars
- Replace smooth bars with a series of 4px wide blocks. Active blocks take the `secondary_color_hex`, inactive blocks are `border_contrast`.

### Cards & Panels
- Background: `surface_glass`.
- Border: 1px `border_contrast`.
- Header: Always include a `label-upper` category title in the top-left, often preceded by a double slash (e.g., `// SYSTEM_STATUS`).

### Input Fields
- Flat, dark background with a bottom-only 1px border. 
- Focus state: The bottom border turns to `primary_color_hex` with a subtle glow.
- Caret: Use a block-style blinking cursor to match the terminal aesthetic.

### Status Chips
- Small, uppercase text inside a 1px border. Include a literal "LED" (a small 6px circle) of color next to the text to indicate state (Green: Active, Purple: Processing, Red: Error).