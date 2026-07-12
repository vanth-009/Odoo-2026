# EcoSphere Frontend Implementation Plan

Build the frontend for **EcoSphere**, an ESG Management Platform, as a highly aesthetic single-page application within the 8-hour hackathon timeframe. The focus will be on delivering a "WOW" factor through modern UI design (glassmorphism, subtle animations, vibrant but professional color palettes) as required.

> [!IMPORTANT]
> **User Review Required**
> Please review the proposed technology stack and the 8-hour execution strategy. Given this is a hackathon, we are prioritizing high-impact visuals and core workflows over exhaustive feature completeness.

> [!WARNING]
> **Open Questions**
> 1. **Framework Choice**: The workspace folder is named `Odoo_...`. Should this frontend be built as an independent React/Vite application (recommended for speed and aesthetics), or does it need to be built using Odoo's internal frontend framework (OWL/QWeb)?
> 2. **Data Integration**: For the hackathon demo, should we strictly use mock data on the frontend to ensure a perfect presentation, or will there be an active backend API we must connect to?
> 3. **Scaffolding**: Should I go ahead and initialize the Vite project structure now?

## Proposed Architecture & Stack

- **Framework**: React via Vite (for rapid development and fast HMR).
- **Styling**: Vanilla CSS with a predefined design system (CSS variables). We will implement a custom, premium aesthetic featuring glassmorphism, modern typography (e.g., Inter or Outfit), and smooth micro-animations.
- **State Management**: React Context (keeps complexity low for an 8-hour build).
- **Routing**: React Router DOM.
- **Charts**: Chart.js or Recharts (for the Dashboard metrics).
- **Icons**: Phosphor Icons or Lucide (clean, modern line icons).

## Proposed Changes (Component Breakdown)

### 1. Core Layout & Routing
- **Layout Component**: A responsive shell containing a collapsible sidebar navigation (matching the mockups: Dashboard, Environmental, Social, Governance, Gamification, Reports, Settings).
- **Router Setup**: Defining paths for all major modules.

### 2. Design System & Shared Components (The "WOW" Factor)
- **`styles/global.css`**: Define CSS variables for the color palette (deep purples/blues, vibrant greens for environmental scores), typography, and utility classes for glassmorphism panels.
- **`Card` Component**: Reusable container with subtle shadows and hover state animations.
- **`Button` Component**: Primary, secondary, and action buttons with click micro-animations.
- **`Badge/Tag` Component**: Dynamic colored badges for status indicators (Active, Pending, Completed).
- **`DataTable` Component**: A clean, readable table structure for lists (Transactions, Leaderboards).

### 3. Module Views

#### [NEW] Dashboard View
- High-level metric cards (ESG Scores).
- Line chart for Emissions Tracking.
- Bar chart for Department Rankings.
- Quick action buttons and recent activity feed.

#### [NEW] Environmental View
- Tabbed interface (Data, Goals).
- Progress bars indicating goal completion vs targets.
- Carbon transaction data table.

#### [NEW] Social & Gamification Views
- **Social**: CSR Activity cards with "Join" buttons; employee participation lists.
- **Gamification**: Challenge cards displaying XP and difficulty; Badge display grid; Leaderboard table showing top employees by XP.

#### [NEW] Governance & Reports (Simplified for MVP)
- Lists for Audits and Compliance Issues with severity badges.
- Report generation placeholder UI.

## 8-Hour Execution Strategy

- **Hour 1-2**: Scaffold Vite + React app, establish the CSS design system, build the base Layout (Sidebar/Topbar).
- **Hour 3-4**: Build Shared Components (Cards, Buttons, Tags) and construct the main Dashboard View with mock charts.
- **Hour 5-6**: Implement Environmental and Gamification views, focusing heavily on visual appeal (progress bars, badges, layout).
- **Hour 7**: Implement routing, Social/Governance placeholder views, and connect everything with cohesive mock data to ensure a smooth demo flow.
- **Hour 8**: Final polish—adding CSS transitions, hover effects, fixing alignment, and ensuring the interface looks extremely premium.

## Verification Plan

### Manual Verification
- Review the application flow locally via `npm run dev`.
- Verify that the aesthetic quality meets the "premium" requirement (colors, typography, animations).
- Test navigation between all modules.
- Ensure the layout is responsive and looks good on a standard laptop presentation screen.
