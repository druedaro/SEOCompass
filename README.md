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

---

## Description

**SEO Compass** is a comprehensive SEO management platform that integrates multiple analysis and monitoring tools into a single collaborative workspace. Built with **React 19**, **TypeScript**, and **Supabase**, it provides real-time collaboration features for SEO teams.

### Project Philosophy

1. **Team-First:** Collaborative workspace with real-time updates
2. **All-in-One:** Multiple SEO modules in a unified platform
3. **Data-Driven:** Intelligent task generation from audit results
4. **Developer-Friendly:** Clean, simple code for React developers
5. **Scalable:** Designed for small teams and freelancers
6. **No Over-Engineering:** Direct, readable code without unnecessary abstractions

### Target Audience
- 👥 Small SEO teams (2-10 members)
- 💼 SEO freelancers and consultants
- 🚀 Digital marketing agencies
- 📊 Website owners managing multiple domains

---

## Features

### 🔐 Authentication & User System
- ✅ User registration and login with email/password
- ✅ Google OAuth authentication
- ✅ Password reset functionality
- ✅ Protected routes and session management
- ✅ Role-based user profiles (Technical SEO, Content SEO, SEO Manager)

### 👥 Team Workspace
- ✅ Team creation with name, description, and location
- ✅ Team member management
- ✅ Team-based data ownership (all data belongs to teams, not individual users)
- ✅ Shared access for all team members
- ✅ Team settings and configuration

### 📁 Project Management
- ✅ Multi-project support per team
- ✅ Each project represents a website/domain
- ✅ Centralized dashboard with overview of all projects
- ✅ Project CRUD operations (Create, Read, Update, Delete)
- ✅ Project settings and configuration
- ✅ Project-specific URL management

### 🔍 Module 1: Content & On-Page Analyzer
**URL Analysis:**
- ✅ Single URL analysis or bulk URL import
- ✅ Web scraping with ScrapingBee integration
- ✅ SEO score calculation (0-100)
- ✅ Content analysis:
  - Title tag optimization
  - Meta description analysis
  - H1 heading validation
  - Image alt text detection
  - Word count
  - Canonical URL verification
  - Hreflang tags detection
  - Structured data (JSON-LD) detection
- ✅ Actionable recommendations engine
- ✅ Historical audit tracking with charts
- ✅ Audit results table with filtering and sorting

### ✅ Module 2: Action Center (Task Management)
- ✅ Task CRUD operations (Create, Read, Update, Delete)
- ✅ Task assignment to team members
- ✅ Priority levels (Low, Medium, High, Urgent)
- ✅ Status tracking (To Do, In Progress, Completed, Cancelled)
- ✅ Due date management
- ✅ Task descriptions and notes
- ✅ Link tasks to specific audit results
- ✅ Task filtering and sorting
- ✅ Visual task list with priority badges

---

## 🛠️ Tech Stack

### Frontend & Core
![React](https://img.shields.io/badge/React-19.1-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

### Backend & Services
![Supabase](https://img.shields.io/badge/Supabase-2.47-3ECF8E?style=flat&logo=supabase&logoColor=white)

### API Integrations
![Google Maps](https://img.shields.io/badge/Google_Maps-4285F4?style=flat&logo=googlemaps&logoColor=white)
![ScrapingBee](https://img.shields.io/badge/ScrapingBee-FFA500?style=flat&logoColor=white)

### State Management & Routing
![React Router](https://img.shields.io/badge/React_Router-7.9-CA4245?style=flat&logo=reactrouter&logoColor=white)

### Forms & Validation
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.64-EC5990?style=flat&logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4.1-3E67B1?style=flat&logo=zod&logoColor=white)

### UI Components & Libraries
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Latest-000000?style=flat&logo=shadcnui&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-1.1-161618?style=flat&logo=radixui&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide-0.552-F56565?style=flat)
![React Hot Toast](https://img.shields.io/badge/React_Hot_Toast-2.6-FF6B6B?style=flat)
![class-variance-authority](https://img.shields.io/badge/CVA-0.7-6366F1?style=flat)
![clsx](https://img.shields.io/badge/clsx-2.1-3B82F6?style=flat)
![tailwind-merge](https://img.shields.io/badge/tailwind--merge-3.3-06B6D4?style=flat)

### Data Visualization & Date
![Recharts](https://img.shields.io/badge/Recharts-2.14-22B5BF?style=flat)
![date-fns](https://img.shields.io/badge/date--fns-4.1-770C56?style=flat)
![React Day Picker](https://img.shields.io/badge/React_Day_Picker-9.11-E74C3C?style=flat)

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

**25 Core Tests (Moscow Method):**
- ✅ 10 Auth tests (Must: 7, Should: 1, Could: 2)
- ✅ 5 Project tests (CRUD operations)
- ✅ 5 Task tests (CRUD operations)
- ✅ 5 Team tests (CRUD operations)
- ✅ 5 Content Scraping tests (SEO analysis)

All tests located in `src/services/*.test.ts` using Vitest + Testing Library.

---

## Project Structure

```
src/
├── App.tsx                 
├── main.tsx                  
├── index.css                  
├── vite-env.d.ts             
├── __mocks__/                 
│   └── supabase.ts            
│
├── auth/                   
│   ├── AuthContext.tsx       
│   └── AuthProvider.tsx     
│
├── components/              
│   ├── atoms/                
│   │   ├── AlertDialog.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Calendar.tsx
│   │   ├── Card.tsx
│   │   ├── Dialog.tsx
│   │   ├── Input.tsx
│   │   ├── Label.tsx
│   │   ├── Popover.tsx
│   │   ├── Select.tsx
│   │   ├── Table.tsx
│   │   └── Textarea.tsx
│   │
│   ├── molecules/            
│   │   ├── DatePicker.tsx
│   │   ├── DeleteConfirmationDialog.tsx
│   │   ├── DropdownMenu.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Form.tsx
│   │   ├── LocationAutocomplete.tsx
│   │   ├── Pagination.tsx
│   │   ├── PriorityBadge.tsx
│   │   └── ProjectCard.tsx
│   │
│   └── organisms/             
│       ├── AuditHistoryChart.tsx
│       ├── AuditResultsTable.tsx
│       ├── CreateTaskModal.tsx
│       ├── CreateTeamDialog.tsx
│       ├── DashboardLayout.tsx
│       ├── FeaturesSection.tsx
│       ├── Footer.tsx
│       ├── HeroSection.tsx
│       ├── HowItWorksSection.tsx
│       ├── Navbar.tsx
│       ├── ProjectModal.tsx
│       ├── ProjectUrlsList.tsx
│       ├── RoleSelectionModal.tsx
│       ├── TaskFilters.tsx
│       ├── TaskList.tsx
│       └── TeamSelector.tsx
│
├── config/                 
│   └── supabase.ts           
│
├── constants/                
│   ├── landing.ts           
│   ├── maps.ts              
│   ├── navigation.ts        
│   ├── roles.ts          
│   ├── seo.ts             
│   └── tasks.ts              
│
├── contexts/                  
│   ├── ProjectContext.tsx     
│   └── WorkspaceContext.tsx   
│
├── features/         
│   └── seo/                 
│       ├── htmlParser.ts   
│       ├── validators.ts     
│       ├── scoreCalculator.ts
│       └── recommendationsEngine.ts 
│
├── hooks/                     
│   ├── useAuth.ts            
│   ├── useContentAnalyzer.ts 
│   ├── useGoogleMaps.ts      
│   ├── useProject.ts          
│   ├── useProjectUrls.ts     
│   └── useUrlDetails.ts      
│
├── lib/                        
│   ├── toast.tsx              
│   └── utils.ts             
│
├── pages/                     
│   ├── WelcomePage.tsx      
│   ├── LoginPage.tsx          
│   ├── RegisterPage.tsx      
│   ├── AuthCallbackPage.tsx 
│   ├── CreateTeamPage.tsx   
│   ├── TeamMembersPage.tsx 
│   ├── TeamSettingsPage.tsx
│   ├── ProjectsDashboardPage.tsx 
│   ├── ProjectOverviewPage.tsx   
│   ├── ProjectSettingsPage.tsx  
│   ├── ProjectUrlsManagementPage.tsx 
│   ├── ContentAnalyzerPage.tsx  
│   ├── UrlDetailsPage.tsx       
│   └── ActionCenterPage.tsx     
│
├── routes/                    
│   ├── paths.ts              
│   └── ProtectedRoute.tsx    
│
├── schemas/                 
│   ├── authSchema.ts        
│   ├── projectSchema.ts   
│   ├── taskSchema.ts      
│   ├── teamSchema.ts
│   └── urlSchema.ts        
│
├── services/                
│   ├── authService.ts      
│   ├── authService.test.ts  
│   ├── projectService.ts     
│   ├── projectService.test.ts 
│   ├── teamService.ts        
│   ├── teamService.test.ts    
│   ├── taskService.ts        
│   ├── taskService.test.ts   
│   ├── projectUrlsService.ts  
│   ├── contentScrapingService.ts
│   └── contentScrapingService.test.ts 
│
├── test/              ¡
│   └── setup.ts         
│
└── types/                     
    └── domain.ts            
```

### Architecture Highlights

**Clean Architecture Principles:**
- **Atomic Design:** Components organized by complexity (atoms → molecules → organisms)
- **Feature Isolation:** `features/seo/` contains all SEO-related business logic
- **Service Layer:** `services/` handles all API calls to Supabase
- **Custom Hooks:** `hooks/` encapsulates stateful logic and side effects
- **Type Safety:** Full TypeScript coverage with strict mode
- **Test Co-location:** Tests live next to their implementation files

**Key Patterns:**
- ✅ **Separation of Concerns:** Clear boundaries between UI, business logic, and data
- ✅ **Direct Exports:** Service functions exported directly for easy testing
- ✅ **Single Responsibility:** Each module has one clear purpose
- ✅ **DRY Principle:** Shared constants and utilities prevent duplication
- ✅ **Scalability:** Easy to add new features without affecting existing code

---

## Best Practices

### Code Quality
- ✅ TypeScript strict mode
- ✅ ESLint configured
- ✅ Custom hooks for reusable logic
- ✅ Atomic Design pattern
- ✅ Direct function exports (no service objects)
- ✅ Inline validation messages (no constant indirection)
- ✅ Simple, readable code appropriate for intermediate developers
- ✅ React Hook Form for form management
- ✅ Zod schemas with inline validation
- ✅ Clean code

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

### Testing Strategy
- ✅ **Moscow Method:** Tests prioritized by importance (Must/Should/Could)
- ✅ **Unit Tests:** All service layer methods tested
- ✅ **Mocking:** Supabase client fully mocked for isolated testing
- ✅ **Coverage:** 25 comprehensive tests across 5 service modules
- ✅ **CI/CD Ready:** Fast test execution with Vitest


---



**Built with ❤️ for SEO professionals**