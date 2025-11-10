# 🧭 SEO Compass - All-in-One SEO Management Platform (MVP)

![Demo](./assets/demo.gif)

**MVP:** This version of SEO Compass is a Minimum Viable Product focused entirely on delivering the core Phase 1 features for collaborative SEO management.

A collaborative web platform designed for small SEO teams and freelancers to manage projects, monitor keyword performance, conduct technical and content audits, and manage resulting tasks in an intelligent action center.

---

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech-Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Available-Scripts](#available-scripts)
- [Project-Structure](#project-structure)
- [API-Integrations](#api-integrations)
- [Best-Practices](#best-practices)
- [Deployment](#deployment)

---

## Description

**SEO Compass** is a comprehensive SEO management platform that integrates multiple analysis and monitoring tools into a single collaborative workspace. Built with **React 19**, **TypeScript**, and **Supabase**, it provides real-time collaboration features for SEO teams.

### Project Philosophy

1. **Team-First:** Collaborative workspace with real-time updates
2. **All-in-One:** Multiple SEO modules in a unified platform
3. **AI-Powered:** Intelligent task generation from audit results
4. **Developer-Friendly:** Built for intermediate React developers
5. **Scalable:** Designed for small teams and freelancers

### Target Audience
- 👥 Small SEO teams (2-10 members)
- 💼 SEO freelancers and consultants
- 🚀 Digital marketing agencies
- 📊 Website owners managing multiple domains

---

## Features

### 🔐 User System & Teams (Workspace)
- ✅ User authentication (register/login)
- ✅ Team creation and member invitation via email
- ✅ Team-based data ownership (not individual users)
- ✅ Shared access for all team members
- ✅ Real-time collaboration

### 📁 Project Management
- ✅ Multi-project support per team
- ✅ Each project represents a website domain
- ✅ Centralized dashboard with overview of all projects
- ✅ Project-based data organization


### 📊 Module 1: Keyword Tracker
- ✅ Add and monitor keywords per project
- ✅ ScrapingBee integration for SERP data extraction
- ✅ Data table: current position, change, best position, ranking URL
- ✅ Visibility evolution charts
- ✅ Historical tracking
- ✅ Automatic ranking updates

### ✍️ Module 2: Content & On-Page Analyzer
**On-Page Auditor & Scraper:**
- ✅ Input a single URL, multiple URLs, or an entire sitemap for bulk analysis
- ✅ ScrapingBee for reliable web scraping
- ✅ Keyword presence analysis in:
  - Title tags
  - H1 headings
  - Meta descriptions
  - Alt text
  - Content body
  - And more
- ✅ Detect and report:
  - 404 errors (broken links)
  - Redirect chains and loops
  - Missing anchor text
  - Duplicate meta descriptions
  - Duplicate titles
  - Missing or incorrect canonical tags
  - Missing or incorrect hreflang tags
- ✅ Optimization score and checklist
- ✅ Actionable recommendations

### 🔧 Module 3: Technical SEO Audit
- ✅ Google PageSpeed Insights (Lighthouse) integration
- ✅ URL analysis with detailed metrics
- ✅ 4 main scores visualization:
  - Performance
  - SEO
  - Accessibility
  - Best Practices
- ✅ Core Web Vitals display:
  - LCP (Largest Contentful Paint)
  - CLS (Cumulative Layout Shift)
  - INP (Interaction to Next Paint)
- ✅ Improvement opportunities list
- ✅ Detailed diagnostics

### 📁 Project Management
- ✅ Multi-project support per team
- ✅ Each project represents a website domain
- ✅ Centralized dashboard with overview of all projects
- ✅ Project-based data organization
- ✅ Schedule automatic updates for modules (user-defined interval per project, like a cron job)

### ✅ Module 4: Action Center (Collaborative To-Do)
**Manual Task Management:**
- ✅ Create, edit, and delete tasks
- ✅ Assign tasks to team members
- ✅ Set due dates and priorities
- ✅ Add descriptions and notes
- ✅ Task categorization
- ✅ Link tasks to audit results

**Visualization:**
- ✅ List view with filters and sorting
- ✅ Kanban board (Pending, In Progress, Completed)
- ✅ Real-time updates across team members
- ✅ Progress tracking
- ✅ Task history and activity log

---

## 🛠️ Tech Stack

### Frontend & Core
![React](https://img.shields.io/badge/React-19.1-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

### Backend & Services
![Supabase](https://img.shields.io/badge/Supabase-2.47-3ECF8E?style=flat&logo=supabase&logoColor=white)

### State Management & Routing
![React Router](https://img.shields.io/badge/React_Router-7.9-CA4245?style=flat&logo=reactrouter&logoColor=white)

### Forms & Validation
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.64-EC5990?style=flat&logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4.1-3E67B1?style=flat&logo=zod&logoColor=white)

### Data Visualization
![Recharts](https://img.shields.io/badge/Recharts-2.14-22B5BF?style=flat)
![React DnD](https://img.shields.io/badge/React_DnD-16.0-000000?style=flat)

### Testing & Quality
![Vitest](https://img.shields.io/badge/Vitest-3.2-6E9F18?style=flat&logo=vitest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing_Library-React-E33332?style=flat&logo=testinglibrary&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?style=flat&logo=eslint&logoColor=white)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/druedaro/SEOCompass.git
cd seo-compass

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Edit .env with your credentials
```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Supabase (Authentication & Database)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# ScrapingBee (Web Scraping & SERP Data)
VITE_SCRAPINGBEE_API_KEY=your_scrapingbee_api_key

# Google PageSpeed Insights
VITE_PAGESPEED_API_KEY=your_pagespeed_api_key

# Application
VITE_APP_URL=http://localhost:5173
```

### Getting Credentials

**Supabase:**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy URL and anon key from Settings → API
4. Run database migrations (see `/supabase/migrations/`)

**ScrapingBee:**
1. Create account at [scrapingbee.com](https://www.scrapingbee.com)
2. Get API key from dashboard
3. Free tier: 1,000 API credits

**Google PageSpeed Insights:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable PageSpeed Insights API
3. Create API key

---

## Available Scripts

```bash
# Development
npm run dev          # Start dev server at http://localhost:5173

# Build
npm run build        # Compile TypeScript + production build
npm run preview      # Preview production build

# Testing
npm test             # Run tests with Vitest
npm run test:ui      # Run tests with UI
npm run coverage     # Generate coverage report

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript type checking
```

---

## Testing

**30 Core Tests (Moscow Method):**
- ✅ 10 Auth tests (login, register, OAuth, errors)
- ✅ 5 Project tests (CRUD operations)
- ✅ 5 Task tests (CRUD operations)
- ✅ 5 Team tests (CRUD operations)
- ✅ 5 Content Scraping tests (SEO analysis)

---

## Project Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── setupTests.ts
│
├── auth/
│   ├── AuthContext.tsx    
│   └── AuthProvider.tsx     
│
├── components/
│   ├── atoms/              
│   ├── molecules/          
│   └── organisms/     
│
├── constants/             
│   ├── landing.ts        
│   ├── navigation.ts       
│   ├── roles.ts       
│   ├── seo.ts              
│   └── tasks.ts        
│
├── contexts/              
│   ├── AuthContext.tsx
│   ├── ProjectContext.tsx
│   └── WorkspaceContext.tsx
│
├── features/               
│   └── seo/             
│       ├── htmlParser.ts
│       ├── validators.ts
│       ├── scoreCalculator.ts
│       ├── recommendationsEngine.ts
│       ├── redirectAnalyzer.ts
│       └── __tests__/
│
├── config/
│   └── supabase.ts        
│
├── hooks/               
│   ├── useContentAnalyzer.ts
│   ├── useErrorHandler.ts
│   ├── useProjectUrls.ts
│   └── useUrlDetails.ts
│
├── lib/
│   └── utils.ts         
│
├── pages/                 
│
├── routes/
│   ├── paths.ts            
│   └── ProtectedRoute.tsx  
│
├── schemas/
│   └── authSchema.ts      
│
├── services/             
│   ├── authService.ts
│   ├── projectService.ts
│   ├── taskService.ts
│   └── teamService.ts
│
├── types/                 
│   └── domain.ts
│
└── utils/
    └── tests/
        ├── auth.moscow.test.ts
        ├── content-scraping.moscow.test.ts
        ├── project.moscow.test.ts
        ├── task.moscow.test.ts
        ├── team.moscow.test.ts
        └── __mocks__/
```

### Architecture Highlights

**Feature-Based Organization:**
- `constants/` → All static data centralized
- `features/seo/` → SEO domain logic isolated
- `services/` → API layer (Supabase calls)
- `hooks/` → Custom React hooks for state logic

**Benefits:**
- ✅ Scalable: Easy to add new features
- ✅ Maintainable: Clear separation of concerns
- ✅ Testable: Co-located tests with features
- ✅ Type-safe: Full TypeScript coverage

---

## Best Practices

### Code Quality
- ✅ TypeScript strict mode with generics
- ✅ ESLint configured
- ✅ Custom hooks for reusable logic
- ✅ Atomic Design pattern
- ✅ Centralized configuration
- ✅ DRY principle (generic templates)
- ✅ React Hook Form for form management
- ✅ Zod schemas for validation
- ✅ Clean code without comments

### Performance
- ✅ Lazy loading images
- ✅ Infinite scroll with IntersectionObserver
- ✅ Native Fetch API
- ✅ Optimized bundle (141 KB gzipped)

### UX/UI
- ✅ Responsive design (mobile-first)
- ✅ Loading states
- ✅ Error handling with user-friendly messages
- ✅ Semantic HTML

### Testing
- ✅ 5 Auth tests (Moscow Method)
- ✅ 15 App tests (Moscow Method)

---

## Deployment

### Production Build

```bash
npm run build
```

Generates the \`dist/\` folder ready for deployment.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables in Vercel

Configure in Vercel Dashboard → Settings → Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SCRAPINGBEE_API_KEY`
- `VITE_PAGESPEED_API_KEY`
- `VITE_APP_URL`

### Supabase Setup

1. Run database migrations:
```bash
npx supabase db push
```

2. Configure RLS policies in Supabase dashboard

3. Set up email templates for team invitations

4. Configure authentication providers

---



**Built with ❤️ for SEO professionals**