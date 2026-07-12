---
name: EcoSphere ESG
colors:
  surface: '#f9faf6'
  surface-dim: '#dadad7'
  surface-bright: '#f9faf6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f1'
  surface-container: '#eeeeeb'
  surface-container-high: '#e8e8e5'
  surface-container-highest: '#e2e3e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#414844'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f0f1ee'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3f6653'
  primary: '#012d1d'
  on-primary: '#ffffff'
  primary-container: '#1b4332'
  on-primary-container: '#86af99'
  inverse-primary: '#a5d0b9'
  secondary: '#0e6c4a'
  on-secondary: '#ffffff'
  secondary-container: '#a0f4c8'
  on-secondary-container: '#19724f'
  tertiary: '#3f1d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#5f2f00'
  on-tertiary-container: '#ea9147'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecd4'
  primary-fixed-dim: '#a5d0b9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#274e3d'
  secondary-fixed: '#a0f4c8'
  secondary-fixed-dim: '#85d7ad'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdcc4'
  tertiary-fixed-dim: '#ffb781'
  on-tertiary-fixed: '#2f1400'
  on-tertiary-fixed-variant: '#6f3800'
  background: '#f9faf6'
  on-background: '#1a1c1a'
  surface-variant: '#e2e3e0'
typography:
  headline-xl:
    fontFamily: Public Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is built on the pillars of transparency, stability, and environmental stewardship. It moves away from the "cyber-green" aesthetic toward a "Sophisticated Earth" direction—targeting institutional investors and corporate boards who require high-trust, data-dense environments that feel human and grounded.

The style is **Corporate Modern with a Tactile Undercurrent**. It prioritizes extreme clarity and professional poise, utilizing a warm, organic color palette and generous white space to transform complex ESG (Environmental, Social, and Governance) data into an approachable and actionable narrative. The emotional response is one of calm authority and ethical reliability.

## Colors
The palette is inspired by natural forest gradients and earth minerals, avoiding the sterile blues of traditional finance.

*   **Primary (Forest Green):** Used for core branding, primary navigation, and "Environmental" data markers. It signals deep-rooted authority.
*   **Secondary (Sage Green):** Used for data visualizations, progress bars, and positive growth trends.
*   **Tertiary (Terracotta):** Specifically reserved for "Social" metrics and human-centric data points.
*   **Quaternary (Sand/Clay):** Used for "Governance" metrics, secondary actions, and subtle UI accents.
*   **Surface (Cream):** A warm off-white background that reduces eye strain and distinguishes the product from standard white-label software.
*   **Text (Charcoal):** A soft black that provides high contrast without the harshness of pure black.

## Typography
This design system utilizes **Public Sans** for its institutional clarity and balanced proportions. To achieve a premium feel, the tracking (letter spacing) is slightly increased for body text and labels, creating a rhythmic, breathable reading experience. Headlines use a tighter tracking with heavier weights to assert dominance and hierarchy. All data-heavy labels should favor the medium or semi-bold weights to ensure legibility against colored backgrounds.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to maintain the "report-like" structure essential for ESG auditing. A 12-column system is used with generous 24px gutters to prevent data density from becoming overwhelming. 

Vertical rhythm is strictly maintained using a 4px baseline unit. Significant sections of data are separated by "Stack-LG" (32px) increments to allow the eye to rest. On mobile, the grid collapses to a single column with 16px side margins, ensuring that complex tables transform into readable cards.

## Elevation & Depth
Depth is created through **Tonal Layering and Ambient Shadows**. Rather than using harsh borders, the design system distinguishes surfaces by stacking slightly different shades of the warm surface color.

*   **Level 0 (Background):** The Cream (#F8F9F1) base.
*   **Level 1 (Cards):** Pure White (#FFFFFF) surfaces with a very soft, diffused shadow (0px 4px 20px rgba(27, 67, 50, 0.04)). The shadow is tinted with the Primary Forest Green to maintain organic warmth.
*   **Level 2 (Modals/Popovers):** Higher elevation with a more pronounced shadow (0px 12px 40px rgba(27, 67, 50, 0.08)).

## Shapes
The shape language is defined by **Softened Precision**. A standard 12px (0.75rem) radius is applied to all primary containers and cards, which bridges the gap between clinical (sharp) and playful (rounded). 

*   **Small Elements (Checkboxes/Inputs):** Use the 0.5rem base.
*   **Medium Elements (Cards/Modals):** Use 0.75rem (12px).
*   **Interactive Elements (Buttons):** Use 0.75rem to match cards, ensuring a cohesive modular look.

## Components
### Buttons
Primary buttons use the Forest Green background with white text. Secondary buttons use a Sand outline with Charcoal text. "Ghost" buttons for tertiary actions use a simple Sage Green text.

### Cards
Cards are the primary vehicle for data. They should always have a White background, the 12px corner radius, and the Forest-tinted ambient shadow. Headers within cards should be separated by a thin 1px line in a lightened version of the Sand color (#E9E1D6).

### Data Chips
Chips are used to categorize E, S, and G metrics.
- **Environmental:** Forest Green background, White text.
- **Social:** Terracotta background, White text.
- **Governance:** Sand background, Charcoal text.

### Input Fields
Inputs use a white background with a 1px border in Sand. On focus, the border thickens and changes to Forest Green, with a soft Sage Green outer glow.

### Lists & Tables
Rows should use subtle "zebra-striping" with the background Cream color. Hover states on list items should use a 5% opacity overlay of Sage Green to provide soft, non-disruptive feedback.