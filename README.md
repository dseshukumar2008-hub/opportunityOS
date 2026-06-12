<div align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
<img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
<img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
<img src="https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router 7" />
<img src="https://img.shields.io/badge/Recharts-3-FF6384?style=for-the-badge" alt="Recharts" />
<img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="MIT License" />

<br /><br />

<h1>⚡ Opportunity OS</h1>

<h3>AI-Powered Career Development Ecosystem for Students</h3>

<p>
  <strong>One intelligent workspace for opportunities, resume building, ATS optimization,<br/>
  team collaboration, networking, and career growth tracking.</strong>
</p>

[**Live Demo**](http://localhost:5173/demo) &nbsp;·&nbsp;
[**Presentation**](http://localhost:5173/presentation) &nbsp;·&nbsp;
[**Report Bug**](#) &nbsp;·&nbsp;
[**Request Feature**](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Demo Flow](#-demo-flow)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Custom Hooks](#-custom-hooks)
- [State Management](#-state-management)
- [Design System](#-design-system)
- [Routes Reference](#-routes-reference)
- [Future Scope](#-future-scope)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Opportunity OS** is a full-featured, single-page career development platform built for students navigating the complex landscape of internships, hackathons, scholarships, research roles, and professional networking.

The platform consolidates what would otherwise require 6–8 separate tools into one cohesive, AI-powered workspace:

| Without Opportunity OS | With Opportunity OS |
|---|---|
| Manually search job boards | Personalized, AI-ranked opportunity feed |
| Word/Google Docs for resume | Live resume builder with real-time preview |
| Paste resume into external ATS tools | Built-in ATS Score Engine with keyword analysis |
| LinkedIn for networking | Campus-focused Network Directory |
| WhatsApp groups for team formation | Structured Team Finder with role matching |
| Spreadsheets for tracking | Integrated application tracker with deadlines |
| No career direction | AI Career Roadmap with readiness scoring |

> Built as a comprehensive front-end prototype demonstrating what a modern student career portal could look like — with production-grade UI/UX, a rich component library, and an end-to-end user journey.

---

## ✨ Key Features

### 🎯 Smart Opportunity Discovery
- **485+ opportunities** — Internships, Hackathons, Scholarships, Fellowships, Research Roles
- **AI Match Score Engine** — each opportunity scored 0–100% against user resume, skills, location, and preferences via `useMatchScore`
- **Real-time filters** — type, location, duration, and category with accordion sidebar
- **Saved opportunities** — persistent wishlist with deadline tracking
- **Recommended-for-you section** powered by `useRecommendations` hook

### 📄 Resume Builder & ATS Review
- **Live section editor** — Education, Experience, Projects, Skills, Certifications
- **Real-time PDF preview** — changes reflected instantly on the right pane
- **PDF export** via `html2pdf.js` + `jsPDF`
- **Resume history** — version snapshots via `useResumeHistory`
- **ATS Score Engine** analyzing 5 dimensions: Keyword Density · Action Verb Strength · Formatting · Skills Alignment · Completeness
- Missing keyword chips with contextual improvement suggestions

### 👥 Team Finder
- **Discover teams** — browse hackathon, startup, open-source, and competition teams
- **My Teams tab** — manage teams you've created or joined
- **Join request system** — send, track, and receive team applications
- **Team management panel** — add members, assign roles, manage open slots
- **Skill-based search** — find teams that need your exact skills

### 🌐 Networking Hub
- **Network Directory** — browse students by branch, skill, and university
- **Connection system** — send / accept / reject requests with real-time badge counts
- **Recommended Connections** via `useRecommendedConnections`
- **Rich user profiles** — skills, projects, career goals, ATS score
- **Messaging** — conversation threads with online status indicators

### 🗺️ Career Roadmap & Goals
- **Career Readiness Score** (0–100) — composite of Resume, Applications, Goals, Network
- **Track selector** — Software Engineering, Data Science, Product Management, UX Design, DevOps
- **Milestone-based roadmap** — phased path from beginner to career-ready
- **Goals system** — create, track, and complete SMART career goals with progress bars
- **Achievement badges** — gamified milestones triggered by real in-app activity

### 📊 Analytics Dashboard
- Application funnel (Applied → Screened → Interview → Offer → Accepted)
- ATS score progression, career readiness trend, networking growth
- Activity timeline and personal insights widgets

### 🔔 Notifications & Deadlines
- **Notification center** — application updates, team requests, connection alerts
- **Deadline manager** — upcoming deadlines from applications + saved opportunities
- **Smart dashboard greeting** — context-aware AI summary based on current state

### 🎨 UI System
- **Design language**: White cards · Purple accents (`#6C4CF1`) · 16px border-radius · High-density layouts
- **Global component classes** via `index.css`: `btn-primary`, `btn-secondary`, `card-standard`, `page-header`
- **Skeleton loading screens** — page-specific shimmer presets for all 7 major modules
- **Rich empty states** — illustrated with animated decorative rings and contextual CTAs
- **Global toast system** — success / error / info via `react-hot-toast` with manual dismiss
- **Global search modal** — real-time `Cmd+K` search across opportunities, teams, users

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         OPPORTUNITY OS                              │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐    │
│  │  Landing /   │   │  Demo Mode   │   │  Presentation        │    │
│  │  Auth Pages  │   │  /demo       │   │  Dashboard /pres..   │    │
│  └──────────────┘   └──────────────┘   └──────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                 DashboardLayout  (Protected Route)           │   │
│  │  ┌────────────┐  ┌───────────────────────────────────────┐  │   │
│  │  │  Sidebar   │  │              Page Router               │  │   │
│  │  │  Nav       │  │  Dashboard · Opportunities · Resume   │  │   │
│  │  │  Search    │  │  Teams · Network · Messages · Goals   │  │   │
│  │  │  Profile   │  │  Analytics · Roadmap · Applications  │  │   │
│  │  └────────────┘  └───────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   Context Layer  (Global State)              │   │
│  │  Auth · Applications · Resume · Teams · Goals · Connections  │   │
│  │  Messages · Notifications · Activity · Achievements          │   │
│  │  OnlineStatus · SavedOpportunities                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Custom Hooks Layer                        │   │
│  │  useMatchScore · useRecommendations · useCareerReadiness    │   │
│  │  useCareerRoadmap · useResumeAnalysis · useCareerCoach      │   │
│  │  useDeadlineReminders · useRecommendedConnections           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              Data Layer  (Mock / Contextual)                 │   │
│  │  mockOpportunities (485+) · mockUsers · mockTeams            │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action
    │
    ▼
Component (Page / Widget)
    │
    ├──► Context  (global state mutation + localStorage persistence)
    └──► Custom Hook  (derived / computed state)
```

---

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | React | 19.2 | UI component system |
| **Build Tool** | Vite | 8.0 | Dev server & bundler |
| **Styling** | Tailwind CSS | 4.3 | Utility-first CSS |
| **Routing** | React Router | 7.16 | SPA navigation + lazy loading |
| **Charts** | Recharts | 3.8 | Analytics visualizations |
| **Animations** | Framer Motion | 12.4 | Page & component transitions |
| **Icons** | Lucide React | 1.17 | Consistent icon system |
| **Toasts** | React Hot Toast | 2.6 | Global feedback notifications |
| **PDF Export** | jsPDF + html2pdf.js | — | Resume PDF download |
| **Linting** | ESLint | 10.3 | Code quality enforcement |

---

## 📸 Screenshots

### 🏠 Landing Page
Hero section with animated headline, feature grid, testimonials, statistics bar (`10K+ Opportunities`, `25K+ Applications`, `15K+ Students Helped`, `2K+ Teams Formed`), and CTAs linking to Demo and Sign Up.

### 📊 Dashboard
Personalized greeting with AI smart summary · 4 stat widgets · Career Readiness widget · Goals overview · AI Career Coach card · Recommended opportunities strip · Activity timeline · Upcoming deadlines · Achievements showcase

### 🔍 Opportunities
Filter sidebar (type, location, duration, category) · AI match score badges (e.g., **92% Match**) · Apply / Save actions with toast feedback · Recommended-for-you section · Pagination

### 📄 Resume Builder + ATS Review
Two-pane layout: section editor + live PDF preview · Resume strength progress bar · ATS score gauge (circular, animated) · 5-dimension analysis bars · Missing keyword chips with suggestions

### 👥 Team Finder
Discover / My Teams / Pending tabs · Category filter pills · Team cards with skills, member count, slots · Create team modal · Join request system

### 💬 Messaging
Split-pane layout: conversation list + chat window · Online/Away/Offline status dots · Unread count badges · Message send with emoji support

### 🗺️ Career Roadmap
Career Readiness ring (e.g., 73/100) · Track selector dropdown · Phased milestone roadmap · Mastered vs. Learn-Next skills grid · Recommended target opportunities

### 📈 Presentation Dashboard
Dark gradient hero banner · 8 animated count-up metric cards with trend badges · 7 analytics charts (Area, Bar, Line, Pie, Funnel) · 8-step user journey stepper · 9-module feature grid

---

## 🎬 Demo Flow

The platform ships with a **Demo Mode** at `/demo` — **no account required**. Loads with a pre-configured student profile (**Aanya Sharma, CS 2nd year**):

```
Landing Page
    │
    ▼  [Start Demo]
    │
    ├──► Dashboard
    │        Context-aware greeting · stat widgets · AI summary
    │
    ├──► Resume Builder
    │        Add skills → live PDF preview → strength bar rises
    │        └──► ATS Review: score animates 65 → 81/100
    │
    ├──► Opportunities
    │        92% match badge · Apply → "✓ Application Submitted" toast
    │
    ├──► Team Finder
    │        Discover tab · click team · "Request to Join" → toast
    │
    ├──► Network Directory
    │        Filter by branch · Connect → Message → send reply
    │
    ├──► Career Roadmap
    │        Readiness ring · track selector · skill path milestones
    │
    └──► Goals
             Create first goal → track progress → complete
```

> **Tip**: Visit `/presentation` for a full-screen analytics overview ideal for career fairs, college placement demos, and institutional presentations.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0
- **npm** ≥ 9.0

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/opportunity-os.git
cd opportunity-os

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Available Scripts

```bash
npm run dev       # Start dev server with HMR at localhost:5173
npm run build     # Production build → /dist
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

---

## 📁 Project Structure

```
opportunity-os/
├── public/
└── src/
    ├── pages/
    │   ├── auth/                   # Login, Signup, ForgotPassword
    │   ├── dashboard/              # 23 dashboard pages
    │   ├── demo/                   # DemoPage.jsx
    │   └── presentation/           # PresentationPage + Charts + HeroMetrics
    │
    ├── components/
    │   ├── ui/                     # EmptyState · Skeleton · PageLoader · StatusDot
    │   ├── dashboard/              # 15+ dashboard widgets
    │   ├── opportunities/          # OpportunityCard, RecommendedSection
    │   ├── team/                   # TeamCard, CreateTeamModal
    │   ├── goals/                  # GoalCard, CreateGoalModal
    │   ├── profile/                # Profile components
    │   ├── navigation/             # Sidebar, GlobalSearchModal
    │   ├── routing/                # ProtectedRoute, GuestRoute
    │   └── loaders/                # Route-level Suspense skeletons
    │
    ├── contexts/                   # 12 React Context providers
    │   ├── AuthContext.jsx
    │   ├── ApplicationContext.jsx
    │   ├── ResumeContext.jsx
    │   ├── TeamContext.jsx
    │   ├── GoalContext.jsx
    │   ├── ConnectionContext.jsx
    │   ├── MessageContext.jsx
    │   ├── NotificationContext.jsx
    │   ├── ActivityContext.jsx
    │   ├── AchievementContext.jsx
    │   ├── OnlineStatusContext.jsx
    │   └── SavedOpportunitiesContext.jsx
    │
    ├── hooks/                      # 13 custom React hooks
    │   ├── useMatchScore.js
    │   ├── useRecommendations.js
    │   ├── useCareerReadiness.js
    │   ├── useCareerRoadmap.js
    │   ├── useResumeAnalysis.js
    │   ├── useCareerCoach.js
    │   ├── useDeadlineReminders.js
    │   ├── useRecommendedConnections.js
    │   ├── useRecommendationHistory.js
    │   ├── useResumeHistory.js
    │   ├── useMessageNotifications.js
    │   ├── useSimulatedLoading.js
    │   └── useCountUp.js
    │
    ├── data/
    │   └── mockOpportunities.js    # 485+ opportunity records
    │
    ├── layouts/
    │   └── DashboardLayout.jsx     # Sidebar + outlet wrapper
    │
    ├── index.css                   # Design system tokens & utility classes
    ├── App.jsx                     # Route configuration
    └── main.jsx                    # React entry point
```

---

## 🪝 Custom Hooks

| Hook | Returns | Purpose |
|---|---|---|
| `useMatchScore(opp)` | `number 0–100` | AI match percentage for a given opportunity |
| `useRecommendations()` | `Opportunity[]` | Top 6 personalized recommendations |
| `useCareerReadiness()` | `{ score, dimensions }` | Composite readiness score (0–100) |
| `useCareerRoadmap()` | `{ roadmapData, tracks }` | Milestones for selected career track |
| `useResumeAnalysis()` | `{ atsScore, keywords, gaps }` | ATS analysis and keyword gap detection |
| `useCareerCoach()` | `string[]` | Context-aware coaching tips |
| `useDeadlineReminders()` | `Deadline[]` | Upcoming deadlines sorted by urgency |
| `useRecommendedConnections()` | `User[]` | Peer suggestions by skill similarity |
| `useRecommendationHistory()` | `{ history, addToHistory }` | Tracks viewed recommendations |
| `useResumeHistory()` | `{ history, saveSnapshot }` | Version-controlled resume snapshots |
| `useMessageNotifications()` | `number` | Total unread message count |
| `useSimulatedLoading(ms)` | `{ isLoading }` | Skeleton screen delay hook |
| `useCountUp(target, ms)` | `number` | Animated count-up with ease-out cubic |

---

## 🗂️ State Management

The app uses **React Context API** with localStorage persistence — no Redux or external state library required:

```jsx
// Pattern used across all contexts
const [applications, setApplications] = useState(() =>
  JSON.parse(localStorage.getItem('applications') || '[]')
);

useEffect(() => {
  localStorage.setItem('applications', JSON.stringify(applications));
}, [applications]);
```

| Context | Manages |
|---|---|
| `AuthContext` | Current user session + mock login/logout |
| `ApplicationContext` | Applied opportunities + status tracking |
| `ResumeContext` | All resume sections and content |
| `TeamContext` | Teams, membership, join requests |
| `GoalContext` | Career goals + progress values |
| `ConnectionContext` | Connections + pending requests |
| `MessageContext` | Conversations + message threads |
| `NotificationContext` | In-app notification feed |
| `ActivityContext` | User activity event log |
| `AchievementContext` | Unlocked badges and milestones |
| `OnlineStatusContext` | Simulated online/away/offline per user |
| `SavedOpportunitiesContext` | Bookmarked opportunities |

---

## 🎨 Design System

All design tokens and component classes live in `src/index.css`:

```css
.btn-primary    { @apply bg-[#6C4CF1] hover:bg-[#5b3fda] text-white rounded-xl ... }
.btn-secondary  { @apply bg-white border border-slate-200 rounded-xl ... }
.card-standard  { @apply bg-white rounded-2xl border border-slate-100 shadow-... }
.page-header    { @apply text-[24px] md:text-[28px] font-extrabold tracking-tight }
.page-subheader { @apply text-[14px] font-medium text-slate-500 }
```

| Token | Value | Usage |
|---|---|---|
| Primary | `#6C4CF1` | Buttons, accents, active states |
| Background | `#F8FAFC` | Page background |
| Surface | `#FFFFFF` | Cards, panels |
| Text Primary | `#0F172A` | Headings |
| Text Secondary | `#64748B` | Subtext, labels |
| Success | `#10B981` | Emerald green |
| Warning | `#F59E0B` | Amber |
| Error | `#EF4444` | Red |

---

## 🗺️ Routes Reference

| Route | Component | Auth Required |
|---|---|---|
| `/` | `LandingPage` | ❌ |
| `/demo` | `DemoPage` | ❌ |
| `/presentation` | `PresentationPage` | ❌ |
| `/login` | `LoginPage` | ❌ |
| `/signup` | `SignupPage` | ❌ |
| `/dashboard` | `DashboardPage` | ✅ |
| `/opportunities` | `OpportunitiesPage` | ✅ |
| `/opportunity/:id` | `OpportunityDetailsPage` | ✅ |
| `/resume-builder` | `ResumeBuilderPage` | ✅ |
| `/resume-review` | `ResumeReviewPage` | ✅ |
| `/team-finder` | `TeamFinderPage` | ✅ |
| `/team/:teamId` | `TeamDetailsPage` | ✅ |
| `/team/:teamId/manage` | `TeamManagementPage` | ✅ |
| `/messages` | `MessagesPage` | ✅ |
| `/network` | `NetworkDirectoryPage` | ✅ |
| `/network/connections` | `ConnectionsPage` | ✅ |
| `/network/requests` | `ConnectionRequestsPage` | ✅ |
| `/user/:userId` | `UserProfilePage` | ✅ |
| `/career-roadmap` | `CareerRoadmapPage` | ✅ |
| `/goals` | `GoalsPage` | ✅ |
| `/analytics` | `AnalyticsPage` | ✅ |
| `/applications` | `ApplicationsPage` | ✅ |
| `/saved` | `SavedPage` | ✅ |
| `/deadlines` | `DeadlinesPage` | ✅ |
| `/notifications` | `NotificationsPage` | ✅ |
| `/profile` | `ProfilePage` | ✅ |
| `/settings` | `SettingsPage` | ✅ |

---

## 🔭 Future Scope

### Near-term (v1.1)
- [ ] **Backend Integration** — REST API with Node.js + PostgreSQL
- [ ] **Real Authentication** — JWT-based auth with refresh tokens and Google OAuth
- [ ] **Email Notifications** — Deadline reminders via SendGrid / Resend
- [ ] **PDF Parsing** — Upload existing resume with AI field extraction
- [ ] **Real-time Messaging** — WebSocket chat via Socket.io

### Mid-term (v1.2)
- [ ] **Mobile App** — React Native port with shared business logic
- [ ] **University Admin Portal** — Placement officer dashboard with cohort analytics
- [ ] **AI Resume Tailoring** — Auto-tailor resume for a specific JD using Gemini API
- [ ] **Interview Prep Module** — AI mock interviews with scoring feedback
- [ ] **Company Profiles** — Employer side: post opportunities, review applicants

### Long-term (v2.0)
- [ ] **Employer Marketplace** — Verified companies posting live opportunities
- [ ] **Peer Mentorship Network** — Connect students with alumni mentors
- [ ] **LLM Career Coach** — Gemini / GPT-powered conversational career guidance
- [ ] **Multi-language Support** — i18n for global student communities
- [ ] **Dark Mode** — Full dark theme toggle
- [ ] **PWA Support** — Installable app with offline mode

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'feat: add AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

### Commit Convention

```
feat:     New feature
fix:      Bug fix
docs:     Documentation only
style:    UI/CSS changes (no logic)
refactor: Code restructure without feature change
perf:     Performance improvements
chore:    Build tooling or config changes
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

**Built with ❤️ for students, by students.**

*Opportunity OS — One platform. Every opportunity. Your entire career journey.*

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>
