# EcoSphere.OS 🌍

Watch the complete platform walkthrough and feature demonstration here:

**🎥 YouTube Demo:** [Watch the Demo](https://www.youtube.com/watch?v=9zKkMeCSok8)

EcoSphere.OS is a comprehensive, enterprise-grade ESG (Environmental, Social, and Governance) intelligence platform. Built with modern web technologies, it features a premium glassmorphic UI, robust data integration, and gamified employee engagement mechanics.

## 🌟 Platform Modules

### 1. 🍃 Environmental Matrix
Track and manage your organization's ecological footprint.
- **Carbon Hotspots**: Visualize emissions data across departments.
- **Product Lifecycle Analysis**: Track carbon offset and emissions per product.
- **Sustainability Goals**: Real-time progress tracking toward Net-Zero targets.

### 2. 👥 Social Ledger
Manage CSR initiatives, workforce diversity, and employee engagement.
- **CSR Activities**: Browse, join, and log participation in community/environmental projects.
- **Diversity Index**: Live, dynamically calculated Shannon Diversity Index based on real-time workforce data (Gender, Ethnicity, Age distributions).
- **Engagement & Training**: Live survey scores and compliance training trackers.

### 3. 🛡️ Governance Audit
A centralized hub for compliance and corporate policies.
- **Policies & Standards**: Track publication states (Active, Draft, Expired).
- **Compliance Audits**: Monitor departmental governance scores and compliance findings.

### 4. 🏆 Impact Gamification
Drive employee engagement through gamified sustainability.
- **Eco-Challenges**: Participate in sustainability challenges to earn XP.
- **Leaderboards**: Departmental and individual rankings based on eco-contributions.
- **Badges**: Unlock achievement badges (e.g., "Zero Waste Hero").

### 5. 📊 Data Architecture (Reports)
A unified reporting engine for exporting platform metrics.
- Export Environmental, Social, and Governance data to PDF, Excel, and CSV formats.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with custom glassmorphism utilities
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: SQLite (Configured for seamless local evaluation)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

---

## 🚀 Guide for Evaluators: Running Locally

Follow these precise steps to get the full EcoSphere.OS platform running on your local machine. The database is pre-configured to use SQLite, meaning no external database installation or API keys are required!

### Prerequisites
Make sure you have **Node.js (v18+)** installed.

### Step 1: Install Dependencies
Open your terminal in the project root and install all required packages:
```bash
npm install
```

### Step 2: Initialize the Database
Generate the Prisma client and push the schema to create your local SQLite database file:
```bash
npx prisma generate
npx prisma db push
```

### Step 3: Seed the Database
To fully experience the dynamic dashboards, you must populate the database with our rich mock data. Run the following seed scripts in order:

```bash
# Seed Environmental, Gamification, and Governance data
node prisma/seed.js

# Seed Social, Diversity, and CSR data
node prisma/seed_social.js
```

*(Note: All charts, diversity indices, and progress bars on the dashboards are 100% dynamically driven by this seeded database data—nothing is hardcoded!)*

### Step 4: Start the Application
Run the Next.js development server:
```bash
npm run dev
```

### Step 5: Explore the Platform
Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**. 
Use the **Global Sidebar** on the left to navigate seamlessly between the Environmental, Social, Governance, and Gamification consoles. 

Enjoy exploring EcoSphere.OS! 🌍
