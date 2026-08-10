---
name: MachineSense
colors:
  surface: '#0d1516'
  surface-dim: '#0d1516'
  surface-bright: '#333a3c'
  surface-container-lowest: '#080f11'
  surface-container-low: '#151d1e'
  surface-container: '#192122'
  surface-container-high: '#242b2d'
  surface-container-highest: '#2e3638'
  on-surface: '#dce4e5'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#dce4e5'
  inverse-on-surface: '#2a3233'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#40e56c'
  on-secondary: '#003912'
  secondary-container: '#02c953'
  on-secondary-container: '#004d1b'
  tertiary: '#ffeac0'
  on-tertiary: '#3e2e00'
  tertiary-container: '#fec931'
  on-tertiary-container: '#6f5500'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#69ff87'
  secondary-fixed-dim: '#3ce36a'
  on-secondary-fixed: '#002108'
  on-secondary-fixed-variant: '#00531e'
  tertiary-fixed: '#ffdf96'
  tertiary-fixed-dim: '#f3bf26'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#0d1516'
  on-background: '#dce4e5'
  surface-variant: '#2e3638'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for the high-stakes world of industrial predictive maintenance. It evokes a sense of "digital twin" precision and futuristic reliability. The brand personality is authoritative yet insightful—positioning the software as a highly sophisticated ear that never stops listening to the heartbeat of heavy machinery.

The visual style is **Futuristic Glassmorphism**. It utilizes a deep, multi-layered dark mode to create a sense of infinite spatial depth, reminiscent of a high-end command center. Key characteristics include:
- **Luminous Hierarchy:** Using glowing accents and neon-tinted outlines to draw attention to critical data.
- **Precision Engineering:** Sharp typography paired with generous, rounded card containers to balance industrial rigidity with modern software approachability.
- **Atmospheric Depth:** Subtle background blurs and translucent surface treatments to separate data layers without losing the overall context of the "machine environment."

## Colors

The palette is rooted in a "Deep Space" industrial aesthetic. The primary background is nearly black to ensure the vibrant accent colors provide maximum functional contrast.

- **Primary (Electric Cyan):** Used for interactive elements, active states, and data visualizations representing "sensing" or "active monitoring."
- **Semantic Signals:** A strict adherence to Healthy (Emerald), Warning (Amber), and Critical (Crimson) ensures that machinery status is instantly decodable even from a distance.
- **Glass Surfaces:** Surface containers should use `#161B22` with a 60-80% opacity and a 12px to 20px backdrop blur to create the signature premium glass effect.
- **Accents:** Use subtle glows (`box-shadow` with low alpha) for critical machinery alerts to simulate a physical warning light on a control panel.

## Typography

The system uses **Inter** for all primary communication due to its exceptional legibility in dark environments and technical clarity. 

To reinforce the industrial/tech narrative, **JetBrains Mono** is introduced for labels and specific data points (serial numbers, frequency levels, timestamps). This monospaced font provides the "readout" aesthetic essential for IoT dashboards. 

Headlines should be bold and tight to feel impactful, while body text requires generous line heights to ensure readability against the high-contrast dark background.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with high-density spacing for data-heavy views and low-density spacing for high-level monitoring overviews.

- **Grid:** A 12-column grid system is used for desktop, collapsing to a 4-column grid for mobile.
- **Rhythm:** All spacing is based on a 4px base unit. 
- **Safe Zones:** High-level status cards should be separated by 24px gutters to allow the "glow" and glass effects enough room to breathe without overlapping visually.
- **Responsive Behavior:** On mobile, margins reduce to 16px. Glassmorphism effects should be simplified (reduced blur radius) on lower-end mobile devices to maintain performance.

## Elevation & Depth

In this design system, depth is communicated through **Translucency and Inner Borders** rather than traditional drop shadows.

- **Level 1 (Base):** The #0A0E14 background.
- **Level 2 (Cards/Panels):** Semi-transparent charcoal with a 1px inner border (stroke) at 10% white opacity. This creates a "lathed" edge effect.
- **Level 3 (Modals/Popovers):** Higher opacity charcoal with a more pronounced backdrop blur (40px) and a primary accent border-top (2px) to indicate focus.
- **Glowing States:** Elements in a "Critical" or "Active" state should utilize an outer glow (`drop-shadow`) using the semantic color at 30% opacity to simulate light emission.

## Shapes

The design system utilizes **Rounded** corners to soften the industrial data and make the interface feel more like a premium consumer product. 

- **Primary Cards:** 16px (1rem) roundedness to create a friendly, modern container for complex charts.
- **Interactive Elements:** Buttons and input fields use 8px (0.5rem) roundedness for a precise, "tooled" look.
- **Status Indicators:** Pills and tags use a fully rounded (pill-shaped) radius to contrast against the rectangular nature of data grids.

## Components

- **Buttons:** Primary buttons are solid Electric Cyan with black text for maximum punch. Ghost buttons use the 1px inner-border technique with cyan text.
- **Input Fields:** Darker than the card surface (#0D1117) with a subtle bottom-glow when focused.
- **Status Chips:** Use a "dot + label" format. The dot should have a pulsing animation for "Healthy" or "Critical" statuses to signify live data streaming.
- **Data Cards:** Must include a "header" area with JetBrains Mono labels. Backgrounds should have a subtle gradient from top-left (#1C2128) to bottom-right (#161B22).
- **Icons:** Use 20px minimalist line icons with a 1.5px stroke weight. For active states, icons can take on the Primary Accent color with a small glow.
- **Waveform Visualizers:** Unique to this system, audio/vibration data should be rendered in Electric Cyan with a slight trail effect to emphasize the "Listen" aspect of the brand.