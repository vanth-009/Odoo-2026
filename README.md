# Ecosphere: Social & Environmental Module

Ecosphere is a comprehensive dashboard module designed to track, manage, and analyze a company's Corporate Social Responsibility (CSR) initiatives, workforce diversity, employee engagement, and compliance training. Built with modern web technologies, it features a premium glassmorphic UI and robust data integration.

## 🌟 Key Features

### 1. Social Ledger Matrix (Overview Dashboard)
A unified command center providing a high-level view of all social and environmental metrics:
- **Active CSR Initiatives**: A visual showcase of ongoing community and environmental projects.
- **Diversity Index**: Live, dynamically calculated Shannon Diversity Index based on real-time workforce data (Gender, Ethnicity, Age distributions).
- **Engagement Sentiment**: Live employee survey scores measuring Work-Life Balance, Team Collaboration, and Management Support.
- **Compliance Training Track**: Real-time tracking of mandatory corporate training completions.
- **Admin Verification Queue**: A centralized hub for admins to verify and approve employee participation in CSR events.

### 2. CSR Activities Management
A dedicated module to browse and join corporate social responsibility programs:
- View all `UPCOMING`, `ONGOING`, and `COMPLETED` activities.
- High-quality visual cards detailing location, dates, XP rewards, and participant capacity.
- **Join Workflow**: Employees can sign up for activities and log expected contribution hours and proof. Requests are queued for admin approval.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with custom glassmorphism utilities
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: SQLite (Local Development)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Plus Jakarta Sans & JetBrains Mono

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm/yarn/pnpm installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup the Database
This project uses Prisma with a local SQLite database. 
First, generate the Prisma client and push the schema to the database:
```bash
npx prisma generate
npx prisma db push
```

Next, populate the database with seed data (Employees, CSR Activities, Surveys, etc.):
```bash
node prisma/seed_social.js
```

### 3. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The Social Module is accessible at `http://localhost:3000/social`.

## 🎨 UI Architecture
The UI relies heavily on a custom design system implemented in `src/app/globals.css`. It features:
- **Glassmorphism**: `.glass-panel`, `.glass-panel-glow`
- **Ambient Lighting**: `.ambient-glow-1`, `.ambient-glow-2`
- **Micro-interactions**: `.transition-premium`, `.btn-premium`

All data rendered on the dashboards (including the Diversity Index and Training Progress) is **100% dynamic** and fetched live from the Prisma database—no hardcoded charts.

---
*Built as a feature integration for the Environmental/Social Module branch.*
