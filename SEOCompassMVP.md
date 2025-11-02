 Plan de Acción - SEO Compass MVP (Intermediate Developer) - VERSIÓN FINAL
Metodología Agile - Desarrollo por Fases (Branches)
Stack Principal: React 19 + TypeScript + Tailwind 3.4.17 + Vite + Fetch API
Backend: Supabase (Auth + Database + RLS + Edge Functions para API keys)
Location: Google Maps API (Autocomplete)
Testing: Vitest + Testing Library - Moscow Method (35 tests total)
Design Pattern: Atomic Design
Merge Strategy: feature/* → develop con --ff + commit message
Total Commits: ~140 commits

🎯 PHASE 0: Initial Setup & Configuration
Branch: initial-setup
Commits (6)

chore: initialize vite react typescript project with dependencies

npm create vite@latest seo-compass -- --template react-ts
npm install react-router-dom@7.9 react-hook-form@7.64 zod@4.1
npm install @supabase/supabase-js@2.47
npm install recharts@2.14 react-dnd@16.0 react-dnd-html5-backend lucide-react
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction
npm install @react-google-maps/api


chore: configure tailwind css with modern design system

npm install -D tailwindcss@3.4.17 postcss@8.5.6 autoprefixer
npx tailwindcss init -p
Configurar tailwind.config.js con modern theme (gradients, glassmorphism, shadows)
Setup index.css con custom properties


chore: setup vitest and testing library

npm install -D vitest @vitest/ui jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
Configurar vitest.config.ts y setupTests.ts


chore: configure eslint and typescript strict mode

npm install -D eslint@9 @typescript-eslint/eslint-plugin @typescript-eslint/parser
.eslintrc.json y tsconfig.json (strict)
Scripts: test, test:ui, coverage, lint, lint:fix


chore: create atomic design folder structure

   src/
   ├── components/ (atoms, molecules, organisms, templates)
   ├── services/
   ├── auth/
   ├── config/
   ├── hooks/
   ├── pages/
   ├── routes/
   ├── schemas/
   ├── types/
   └── utils/
       └── tests/
           └── __mocks__/

chore: setup environment and supabase config

.env.example: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_GOOGLE_MAPS_API_KEY, VITE_SUPABASE_EDGE_FUNCTION_URL
src/config/supabase.ts con createClient
src/config/googleMaps.ts básico
src/types/domain.ts con interfaces base



Merge to develop: git merge feature/initial-setup --ff -m "chore: complete initial project setup"

🗄️ PHASE 1: Database Schema & RLS Setup
Branch: feature/database-setup
Commits (3)

feat: create complete database schema with constraints

Supabase SQL migration con todas las tablas:



sql   -- users (extender auth.users de Supabase)
   -- profiles (id, user_id FK, role ENUM('tech_seo', 'content_seo', 'developer'))
   
   -- teams (id, name, location TEXT, user_id FK, created_at)
   -- CONSTRAINTS: name NOT NULL, user_id FK CASCADE
   
   -- team_members (id, team_id FK, user_id FK, role, joined_at)
   -- CONSTRAINTS: UNIQUE(team_id, user_id), role NOT NULL
   
   -- invitations (id, team_id FK, email, token UUID, status, created_at)
   -- CONSTRAINTS: status ENUM, token UNIQUE
   
   -- projects (id, name, description, team_id FK, created_at, updated_at)
   -- CONSTRAINTS: name NOT NULL, team_id FK CASCADE
   
   -- keywords, keyword_rankings
   -- content_audits, onpage_issues
   -- technical_audits
   
   -- tasks (id, description, priority ENUM, start_date, end_date, team_id FK, project_id FK, status ENUM, assigned_to FK, created_at)
   -- CONSTRAINTS: priority ENUM('low','medium','high','critical'), status ENUM('pending','in_progress','completed')

feat: implement row level security policies

RLS policies para todas las tablas:



sql   -- teams: usuarios solo ven teams donde son miembros
   -- projects: usuarios solo ven projects de sus teams
   -- tasks: usuarios solo ven tasks de sus teams
   -- keywords, audits: scope por project_id → team_id

Enable RLS en todas las tablas


feat: create database functions and triggers

Function para auto-add creator a team_members
Trigger para updated_at en projects
Function para cascade soft deletes



Merge to develop: git merge feature/database-setup --ff -m "feat: complete database schema with rls"

🔐 PHASE 2: Authentication System with Google OAuth
Branch: feature/auth-system
Commits (8)

feat: configure supabase auth with google oauth

Configurar Google OAuth en Supabase Dashboard
src/config/supabase.ts con signInWithOAuth config
src/types/domain.ts (User con role, Profile)


feat: create auth schemas with zod

src/schemas/authSchema.ts
loginSchema, registerSchema con role validation


feat: implement auth service layer

src/services/authService.ts
signUp, signIn, signInWithGoogle, signOut, getSession, onAuthStateChange
createProfile function (insert en profiles table)


feat: create auth context and provider

src/auth/AuthContext.tsx
src/auth/AuthProvider.tsx
src/hooks/useAuth.ts
Gestión de user, session, profile (con role)


feat: create modern ui atoms

src/components/atoms/Button.tsx (modern variants con gradients)
src/components/atoms/Input.tsx (sleek focus states)


feat: create form input molecule

src/components/molecules/FormInput.tsx
React Hook Form integration
Animated error display


feat: implement modern login and register pages

src/pages/LoginPage.tsx (form + "Continue with Google" button)
src/pages/RegisterPage.tsx (form + role selector dropdown + Google button)
Modern glassmorphism design


feat: setup routing and protected routes

src/routes/ProtectedRoute.tsx (check session)
src/routes/paths.ts (todas las rutas definidas)
App.tsx con React Router y todas las rutas configuradas



Testing (10 tests - Moscow Method):
typescript// src/utils/tests/auth.moscow.test.ts
describe('Auth - Moscow Method Tests', () => {
  // MUST HAVE (6 tests)
  it('MUST: Login with valid credentials successfully')
  it('MUST: Login with Google OAuth successfully')
  it('MUST: Register new user with role successfully')
  it('MUST: Logout user successfully')
  it('MUST: Redirect unauthenticated users to login')
  it('MUST: Handle invalid credentials error')

  // SHOULD HAVE (3 tests)
  it('SHOULD: Persist user session after refresh')
  it('SHOULD: Handle Google OAuth cancellation gracefully')
  it('SHOULD: Validate role on registration')

  // COULD HAVE (1 test)
  it('COULD: Show password strength indicator')
});
Merge to develop: git merge feature/auth-system --ff -m "feat: complete authentication with google oauth"

🏠 PHASE 3: Welcome Page & Modern Landing
Branch: feature/welcome-page
Commits (6)

feat: create modern feature card molecule

src/components/molecules/FeatureCard.tsx
Hover effects, gradients, animations


feat: create hero section with modern design

src/components/organisms/HeroSection.tsx
Gradient background, animated CTAs
Glassmorphism effects


feat: create features section with bento layout

src/components/organisms/FeaturesSection.tsx
4 módulos, modern grid (bento box)
Animated icons (Lucide React)


feat: create how it works timeline section

src/components/organisms/HowItWorksSection.tsx
Animated timeline con steps
Modern visual design


feat: create modern footer and complete welcome page

src/components/organisms/Footer.tsx
src/pages/WelcomePage.tsx
Smooth scroll, animations


feat: configure public routing

"/" pública en App.tsx
Redirect authenticated users a /dashboard



Merge to develop: git merge feature/welcome-page --ff -m "feat: complete modern welcome page"

🔧 PHASE 4: Supabase Edge Functions for API Keys
Branch: feature/edge-functions
Commits (4)

feat: create edge function for scrapingbee proxy

supabase/functions/scrapingbee-proxy/index.ts
Proteger SCRAPINGBEE_API_KEY
Endpoint: POST con { url, keyword }


feat: create edge function for pagespeed proxy

supabase/functions/pagespeed-proxy/index.ts
Proteger GOOGLE_PAGESPEED_API_KEY
Endpoint: POST con { url, strategy }


feat: deploy edge functions to supabase

Deploy con Supabase CLI
Configurar secrets en Supabase Dashboard


feat: create edge function client services

src/services/edgeFunctionService.ts
callScrapingBeeProxy, callPageSpeedProxy
Fetch con Auth header (Supabase anon key)



Merge to develop: git merge feature/edge-functions --ff -m "feat: complete edge functions for api key protection"

👥 PHASE 5: Team & Workspace with Google Maps
Branch: feature/team-workspace
Commits (11)

feat: configure google maps api

src/config/googleMaps.ts
Load Google Maps script
Autocomplete Service setup


feat: implement team service layer

src/services/teamService.ts
createTeam, getTeams, updateTeam, deleteTeam
Usar Supabase client (RLS automático)


feat: create team context and hooks

src/contexts/TeamContext.tsx
src/hooks/useTeam.ts, src/hooks/useTeams.ts


feat: create google maps location autocomplete molecule

src/components/molecules/LocationAutocomplete.tsx
Integración con Google Places Autocomplete
Input con dropdown de sugerencias
Guardar formatted_address


feat: implement create team page with location

src/pages/CreateTeamPage.tsx
Form: name (text), location (autocomplete)
Modern design


feat: create modern team selector organism

src/components/organisms/TeamSelector.tsx
Dropdown con search
Mostrar name + location


feat: implement invitation service

src/services/invitationService.ts
sendInvitation (insert en DB con token UUID)
acceptInvitation (validate token, insert team_member)


feat: create invite member form and accept page

src/components/organisms/InviteMemberForm.tsx
src/pages/AcceptInvitationPage.tsx


feat: create team members management page

src/pages/TeamMembersPage.tsx
List con roles, remove button


feat: create team settings page

src/pages/TeamSettingsPage.tsx
Edit name, location, delete team


feat: create modern navbar with team selector

src/components/organisms/Navbar.tsx
Logo, TeamSelector, ProjectSelector (placeholder), UserMenu
Glassmorphism design



Merge to develop: git merge feature/team-workspace --ff -m "feat: complete team workspace with google maps"

📁 PHASE 6: Project Management Enhanced
Branch: feature/project-management
Commits (10)

feat: implement project service layer

src/services/projectService.ts
CRUD: createProject, getProjects, updateProject, deleteProject
Validation con Zod schemas


feat: create project context and hooks

src/contexts/ProjectContext.tsx
src/hooks/useProject.ts, src/hooks/useProjects.ts


feat: create modern project card molecule

src/components/molecules/ProjectCard.tsx
Modern card con hover effects
Display: name, description (truncated), stats


feat: implement projects dashboard page

src/pages/ProjectsDashboardPage.tsx
Modern grid (bento box layout)
Create button


feat: create project modal with description

src/components/organisms/CreateProjectModal.tsx
Form: name, description (textarea)
Modern modal design


feat: create project selector organism

src/components/organisms/ProjectSelector.tsx
Dropdown con search para navbar


feat: implement project overview page

src/pages/ProjectOverviewPage.tsx
Modern stats cards
Quick links a módulos


feat: create project settings page

src/pages/ProjectSettingsPage.tsx
Edit name, description
Delete con confirmación


feat: implement project sidebar navigation

src/components/organisms/ProjectSidebar.tsx
Vertical nav con iconos
Links: Overview, Keywords, Content, Technical, Tasks


feat: add project filters hook

src/hooks/useProjectFilters.ts
Search, sort, pagination



Merge to develop: git merge feature/project-management --ff -m "feat: complete project management system"

🔍 PHASE 7: Module 1 - Keyword Tracker
Branch: feature/keyword-tracker
Commits (12)

feat: implement keyword service layer

src/services/keywordService.ts
CRUD usando Supabase (RLS por project_id)


feat: create serp scraping service with edge function

src/services/serpScrapingService.ts
scrapeGoogleSERP usando Edge Function proxy
Parse HTML para extraer posiciones


feat: create ranking calculation utilities

src/utils/rankingCalculations.ts
calculateChange, getBestPosition, getTrend


feat: create modern ranking badge molecule

src/components/molecules/RankingBadge.tsx
Animated indicators (up/down/neutral con arrows)


feat: create add keyword form organism

src/components/organisms/AddKeywordForm.tsx
Input + validation
Modern design


feat: create modern keywords table organism

src/components/organisms/KeywordsTable.tsx
Sortable columns
Responsive, hover effects


feat: implement keyword tracker page

src/pages/KeywordTrackerPage.tsx
Modern layout con stats cards
Table + add form


feat: create visibility evolution chart

src/components/organisms/VisibilityChart.tsx
Recharts LineChart
Modern tooltips, gradients


feat: implement keyword update service

src/services/keywordUpdateService.ts
updateSingleKeyword, updateAllKeywords (batch)


feat: add keyword filters hook

src/hooks/useKeywordFilters.ts
Filter by position, search


feat: add bulk actions and export

Select multiple keywords
src/utils/exporters.ts - exportKeywordsToCSV


feat: add loading states and error handling

Skeleton loaders
Error boundaries
Toast notifications



Merge to develop: git merge feature/keyword-tracker --ff -m "feat: complete keyword tracker module"

✍️ PHASE 8: Module 2 - Content & On-Page Analyzer
Branch: feature/content-analyzer
Commits (13)

feat: implement content scraping service with edge function

src/services/contentScrapingService.ts
scrapeURL usando Edge Function proxy


feat: create html parser utilities

src/utils/htmlParser.ts
extractTitle, extractH1, extractMeta, extractAltText, extractLinks
Usar DOMParser


feat: implement sitemap parser service

src/services/sitemapService.ts
parseSitemap (fetch + parse XML)


feat: create keyword analysis utility

src/utils/keywordAnalysis.ts
checkKeywordPresence en title, h1, meta, body


feat: create redirect analyzer utility

src/utils/redirectAnalyzer.ts
detectRedirectChain, detectLoop


feat: create duplicate detector utility

src/utils/duplicateDetector.ts
findDuplicateTitles, findDuplicateMetas


feat: implement validators utilities

src/utils/canonicalValidator.ts
src/utils/hreflangValidator.ts
src/services/urlStatusService.ts (check status codes)


feat: create optimization score calculator

src/utils/optimizationScore.ts
Weighted score by severity


feat: create recommendations engine

src/utils/recommendationsEngine.ts
Generate actionable recommendations


feat: create modern url input form organism

src/components/organisms/UrlInputForm.tsx
Tabs: Single URL / Multiple URLs / Sitemap
Modern tab design


feat: create audit results table and badges

src/components/organisms/AuditResultsTable.tsx
Expandable rows
src/components/molecules/IssueSeverityBadge.tsx


feat: implement content analyzer page

src/pages/ContentAnalyzerPage.tsx
Modern layout con stats


feat: add bulk analysis and export

src/services/auditQueueService.ts (process batches)
Progress bar
Export results



Merge to develop: git merge feature/content-analyzer --ff -m "feat: complete content analyzer module"

🔧 PHASE 9: Module 3 - Technical SEO Audit
Branch: feature/technical-audit
Commits (10)

feat: implement pagespeed service with edge function

src/services/pagespeedService.ts
runAudit usando Edge Function proxy
Parse Lighthouse response


feat: create modern score gauge molecule

src/components/molecules/ScoreGauge.tsx
Animated circular gauge
Colors: red (0-49), orange (50-89), green (90-100)


feat: create lighthouse scores display organism

src/components/organisms/LighthouseScores.tsx
Grid 2x2: Performance, SEO, Accessibility, Best Practices
Animated scores


feat: implement core web vitals display

src/components/organisms/CoreWebVitals.tsx
Cards para LCP, CLS, INP
Tooltips con explicaciones


feat: create opportunities list organism

src/components/organisms/OpportunitiesList.tsx
Lista de mejoras con savings


feat: create diagnostics list organism

src/components/organisms/DiagnosticsList.tsx
Expandable items


feat: create technical audit form organism

src/components/organisms/TechnicalAuditForm.tsx
Input URL + radio (mobile/desktop)


feat: implement technical audit page

src/pages/TechnicalAuditPage.tsx
Modern layout


feat: add audit comparison utility

src/utils/auditComparator.ts
Compare two audits side-by-side


feat: add audit history and export

Fetch historical audits from DB
Export report



Merge to develop: git merge feature/technical-audit --ff -m "feat: complete technical audit module"

✅ PHASE 10: Module 4 - Action Center with FullCalendar
Branch: feature/action-center
Commits (14)

feat: implement task service layer

src/services/taskService.ts
CRUD con Supabase (RLS por team_id)


feat: create modern priority badge molecule

src/components/molecules/PriorityBadge.tsx
Gradients por priority level


feat: create fullcalendar date range picker molecule

src/components/molecules/CalendarDatePicker.tsx
FullCalendar integration
Select start_date y end_date


feat: create modern task card molecule

src/components/molecules/TaskCard.tsx
Draggable (React DnD)
Modern card design


feat: create kanban column molecule

src/components/molecules/KanbanColumn.tsx
Drop zone
Task count badge


feat: create modern task list organism

src/components/organisms/TaskList.tsx
Sortable table
Modern design


feat: implement kanban board organism

src/components/organisms/KanbanBoard.tsx
3 columns: Pending, In Progress, Completed
Drag and drop functionality


feat: create task modal with fullcalendar

src/components/organisms/CreateTaskModal.tsx
Form completo: description, priority, dates (FullCalendar), team_id, project_id, status, assigned_to
Modern modal


feat: create edit task modal

src/components/organisms/EditTaskModal.tsx
Pre-populated form


feat: implement action center page

src/pages/ActionCenterPage.tsx
Tabs: List View / Kanban Board
Modern stats cards


feat: add task filters hook

src/hooks/useTaskFilters.ts
Filter by status, priority, project, assigned_to


feat: implement task linking to audits

Link desde audit results
audit_id optional field


feat: add realtime task updates

src/hooks/useRealtimeTasks.ts
Supabase realtime subscriptions


feat: add task analytics and export

Completion stats
Export to CSV



Merge to develop: git merge feature/action-center --ff -m "feat: complete action center with fullcalendar"

🎨 PHASE 11: UI/UX Modern Enhancement
Branch: feature/ui-enhancement
Commits (10)

feat: create modern design system tokens

tailwind.config.js con modern theme
Gradients, glassmorphism, modern shadows
Dark mode variables


feat: create loading and error components

src/components/atoms/Spinner.tsx (modern spinner)
src/components/molecules/SkeletonCard.tsx (shimmer)
src/components/organisms/ErrorBoundary.tsx


feat: implement modern toast system

src/hooks/useToast.ts
src/components/molecules/Toast.tsx
Animated toasts


feat: create modern modal system

src/components/molecules/Modal.tsx
Backdrop blur, animations, portal


feat: create empty state and stat cards

src/components/molecules/EmptyState.tsx
src/components/molecules/StatCard.tsx


feat: implement breadcrumbs navigation

src/components/molecules/Breadcrumbs.tsx
Auto-generate from route


feat: enhance navbar with user menu

Modern dropdown
Avatar, profile, settings, logout


feat: add responsive design improvements

Mobile-first optimization
All breakpoints


feat: implement accessibility features

ARIA labels
Keyboard navigation
Focus management


feat: add micro-interactions

Hover effects
Transition animations
Loading states



Merge to develop: git merge feature/ui-enhancement --ff -m "feat: complete modern ui/ux"

⚡ PHASE 12: Performance Optimization
Branch: feature/performance
Commits (7)

perf: implement lazy loading for routes

React.lazy() para páginas
Suspense con modern fallback


perf: add code splitting

Dynamic imports: Recharts, React DnD, FullCalendar, Google Maps


perf: optimize images and lazy loading

Intersection Observer
Modern image formats


perf: implement caching and debouncing

Request cache
src/hooks/useDebounce.ts


perf: optimize supabase queries

Select specific columns
Pagination, proper indexes


perf: add virtual scrolling

src/hooks/useVirtualScroll.ts
Apply to large tables


perf: final optimization and cleanup

Vite config optimization
Remove unused code/props
Bundle analysis



Merge to develop: git merge feature/performance --ff -m "perf: complete performance optimizations"

🧪 PHASE 13: Comprehensive Testing - Moscow Method
Branch: feature/comprehensive-testing
Commits (6)

test: add auth moscow tests (10 tests)

typescript// src/utils/tests/auth.moscow.test.ts
// 6 MUST: login, google oauth, register, logout, redirect, error
// 3 SHOULD: session persist, oauth cancel, role validation
// 1 COULD: password strength

test: add team management moscow tests (5 tests)

typescript// src/utils/tests/team.moscow.test.ts
// 3 MUST: create team, invite member, fetch teams
// 2 SHOULD: google maps autocomplete, accept invitation

test: add project management moscow tests (5 tests)

typescript// src/utils/tests/project.moscow.test.ts
// 3 MUST: create project, fetch projects, delete project
// 2 SHOULD: update project, search/filter

test: add keyword tracker moscow tests (5 tests)

typescript// src/utils/tests/keyword.moscow.test.ts
// 3 MUST: add keyword, fetch keywords, update rankings
// 2 SHOULD: bulk update, export csv

test: add content analyzer moscow tests (5 tests)

typescript// src/utils/tests/content-analyzer.moscow.test.ts
// 3 MUST: scrape url, detect issues, calculate score
// 2 SHOULD: sitemap parse, bulk analysis

test: add action center moscow tests (5 tests)

typescript// src/utils/tests/tasks.moscow.test.ts
// 3 MUST: create task, fetch tasks, drag drop
// 2 SHOULD: filters, realtime updates
Total: 35 tests (10 auth + 25 app)
Merge to develop: git merge feature/comprehensive-testing --ff -m "test: complete moscow testing suite"

🚀 PHASE 14: Production Preparation
Branch: release/v1.0.0
Commits (4)

chore: configure production environment

Production env variables
Security headers
Verify RLS policies


chore: setup ci/cd pipeline

GitHub Actions
Automated tests + deploy Vercel


chore: final build optimization

Bundle analysis
SEO meta tags
Performance audit


release: version 1.0.0 mvp launch

CHANGELOG.md
Tag v1.0.0
Final README.md



Merge to main: git checkout main && git merge develop --ff -m "release: v1.0.0 production ready"

📊 Resumen del Plan
| 4 | `feature/edge-functions` | 4 | Edge Functions |
| 5 | `feature/team-workspace` | 11 | Teams + Google Maps |
| 6 | `feature/project-management` | 10 | Projects |
| 7 | `feature/keyword-tracker` | 12 | Módulo Keywords |
| 8 | `feature/content-analyzer` | 13 | Módulo Content |
| 9 | `feature/technical-audit` | 10 | Módulo Technical |
| 10 | `feature/action-center` | 14 | Módulo Tasks |
| 11 | `feature/ui-enhancement` | 10 | UI/UX |
| 12 | `feature/performance` | 7 | Performance |
| 13 | `feature/comprehensive-testing` | 6 | Testing (35 tests) |
| 14 | `release/v1.0.0` | 4 | Production |

**Total: 14 phases, 124 commits**

---

## 🎯 Arquitectura del Proyecto

### Backend (Supabase)
```sql
-- Database Constraints garantizan integridad
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('tech_seo', 'content_seo', 'developer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  team_id UUID NOT NULL REFERENCES teams ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  team_id UUID NOT NULL REFERENCES teams ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
  assigned_to UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- RLS Policies protegen datos
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see teams they belong to"
  ON teams FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM team_members WHERE team_id = teams.id
    )
  );

-- Similar RLS para projects, tasks, keywords, audits...
```

### Edge Functions (Proteger API Keys)
```typescript
// supabase/functions/scrapingbee-proxy/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { url, keyword } = await req.json()
  
  const response = await fetch(
    `https://app.scrapingbee.com/api/v1/?api_key=${Deno.env.get('SCRAPINGBEE_API_KEY')}&url=${encodeURIComponent(url)}`
  )
  
  const html = await response.text()
  // Parse y return positions
  
  return new Response(JSON.stringify({ html, positions }), {
    headers: { "Content-Type": "application/json" }
  })
})
```

### Frontend Architecture
```
src/
├── components/           # Atomic Design
│   ├── atoms/           # Button, Input, Spinner
│   ├── molecules/       # FormInput, Card, Badge, Modal
│   ├── organisms/       # Navbar, Sidebar, Table, Form
│   └── templates/       # Page layouts
├── services/            # Business Logic
│   ├── authService.ts
│   ├── teamService.ts
│   ├── projectService.ts
│   ├── keywordService.ts
│   ├── contentScrapingService.ts
│   ├── pagespeedService.ts
│   ├── taskService.ts
│   └── edgeFunctionService.ts
├── hooks/               # Custom Hooks
│   ├── useAuth.ts
│   ├── useTeam.ts
│   ├── useProject.ts
│   ├── useDebounce.ts
│   ├── useTaskFilters.ts
│   └── useRealtimeTasks.ts
├── config/
│   ├── supabase.ts     # Supabase client
│   └── googleMaps.ts   # Google Maps loader
├── schemas/            # Zod validation
│   ├── authSchema.ts
│   ├── teamSchema.ts
│   ├── projectSchema.ts
│   └── taskSchema.ts
└── utils/
    ├── rankingCalculations.ts
    ├── htmlParser.ts
    ├── optimizationScore.ts
    └── exporters.ts
```

---

## 🔑 Características Clave Implementadas

### 1. **Autenticación**
- ✅ Email/Password con Supabase Auth
- ✅ Google OAuth integration
- ✅ Role-based access (Tech SEO, Content SEO, Developer)
- ✅ Protected routes
- ✅ Session persistence

### 2. **Teams con Ubicación**
- ✅ Google Maps Autocomplete para location
- ✅ Team creation con name + location
- ✅ Team members management
- ✅ Invitations por email con token UUID
- ✅ RLS policies por team membership

### 3. **Projects Enhanced**
- ✅ id, name, description
- ✅ Multi-project por team
- ✅ Dashboard con cards modernas
- ✅ RLS scope por team_id

### 4. **Tasks con FullCalendar**
- ✅ Campos: id, description, priority, start_date, end_date, team_id, project_id, status, assigned_to
- ✅ Modal con FullCalendar para seleccionar fechas
- ✅ Kanban board (Drag & Drop)
- ✅ List view con filters
- ✅ Realtime updates con Supabase subscriptions
- ✅ Database constraints (valid dates check)

### 5. **Keyword Tracker**
- ✅ ScrapingBee via Edge Function (proteger API key)
- ✅ SERP scraping y ranking positions
- ✅ Historical tracking
- ✅ Visibility charts
- ✅ Bulk actions

### 6. **Content Analyzer**
- ✅ URL scraping via Edge Function
- ✅ Sitemap parsing
- ✅ On-page issues detection (404, redirects, duplicates, canonical, hreflang)
- ✅ Optimization score
- ✅ Recommendations engine

### 7. **Technical Audit**
- ✅ PageSpeed Insights via Edge Function (proteger API key)
- ✅ Lighthouse scores (Performance, SEO, Accessibility, Best Practices)
- ✅ Core Web Vitals (LCP, CLS, INP)
- ✅ Opportunities y diagnostics
- ✅ Audit comparison

### 8. **Modern UI/UX**
- ✅ Modern design con gradients y glassmorphism
- ✅ Smooth animations y transitions
- ✅ Responsive mobile-first
- ✅ Dark mode compatible
- ✅ Accessibility (ARIA, keyboard nav)

---

## 🧪 Testing Strategy - Moscow Method

### Auth Tests (10 tests)
```typescript
describe('Auth - Moscow Tests', () => {
  // MUST HAVE (6 tests) - Critical
  test('Login with credentials')
  test('Login with Google OAuth')
  test('Register with role')
  test('Logout')
  test('Redirect unauthenticated')
  test('Handle invalid credentials')
  
  // SHOULD HAVE (3 tests) - Important
  test('Persist session')
  test('Handle OAuth cancel')
  test('Validate role')
  
  // COULD HAVE (1 test) - Nice to have
  test('Password strength indicator')
});
```

### App Tests (25 tests = 5 tests × 5 módulos)

**Team Management (5 tests)**
```typescript
// MUST: create team, invite member, fetch teams
// SHOULD: google maps autocomplete, accept invitation
```

**Project Management (5 tests)**
```typescript
// MUST: create project, fetch projects, delete project
// SHOULD: update project, search/filter
```

**Keyword Tracker (5 tests)**
```typescript
// MUST: add keyword, fetch keywords, update rankings
// SHOULD: bulk update, export CSV
```

**Content Analyzer (5 tests)**
```typescript
// MUST: scrape URL, detect issues, calculate score
// SHOULD: sitemap parse, bulk analysis
```

**Action Center (5 tests)**
```typescript
// MUST: create task, fetch tasks, drag and drop
// SHOULD: filters, realtime updates
```

---

## 📦 Dependencias Finales
```json
{
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.9.0",
    "react-hook-form": "^7.64.0",
    "zod": "^4.1.0",
    "@supabase/supabase-js": "^2.47.0",
    "recharts": "^2.14.0",
    "react-dnd": "^16.0.0",
    "react-dnd-html5-backend": "^16.0.0",
    "lucide-react": "latest",
    "@fullcalendar/react": "^6.1.0",
    "@fullcalendar/daygrid": "^6.1.0",
    "@fullcalendar/interaction": "^6.1.0",
    "@react-google-maps/api": "^2.19.0"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "vite": "^7.1.0",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.5.6",
    "autoprefixer": "latest",
    "vitest": "^3.2.0",
    "@vitest/ui": "^3.2.0",
    "jsdom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/jest-dom": "latest",
    "@testing-library/user-event": "latest",
    "eslint": "^9.0.0",
    "@typescript-eslint/eslint-plugin": "latest",
    "@typescript-eslint/parser": "latest"
  }
}
```

---

## 🔐 Variables de Entorno
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key

# Edge Functions (not exposed to frontend)
# Set in Supabase Dashboard → Edge Functions → Secrets:
# - SCRAPINGBEE_API_KEY
# - GOOGLE_PAGESPEED_API_KEY
```

---

## 🚀 Comandos de Desarrollo
```bash
# Development
npm run dev              # Start dev server

# Build
npm run build           # Production build
npm run preview         # Preview build

# Testing
npm run test            # Run tests
npm run test:ui         # Tests with UI
npm run coverage        # Coverage report

# Code Quality
npm run lint            # ESLint
npm run lint:fix        # Fix lint errors

# Supabase (local dev)
supabase start          # Start local Supabase
supabase db push        # Push migrations
supabase functions deploy scrapingbee-proxy
supabase functions deploy pagespeed-proxy
```

---

## 📝 Notas Importantes

### Database Security
- ✅ **RLS Policies**: Todos los datos protegidos por Row Level Security
- ✅ **Constraints**: Validación a nivel de base de datos (NOT NULL, CHECK, FK CASCADE)
- ✅ **Triggers**: Auto-update timestamps, cascade operations

### API Keys Protection
- ✅ **Edge Functions**: ScrapingBee y PageSpeed API keys nunca expuestas al frontend
- ✅ **Supabase Secrets**: API keys guardadas como secrets en Supabase Dashboard
- ✅ **Auth Header**: Edge Functions requieren Supabase anon key para autenticar

### Modern Design
- ✅ **Glassmorphism**: Backdrop blur effects
- ✅ **Gradients**: Modern color gradients
- ✅ **Animations**: Smooth transitions y micro-interactions
- ✅ **Responsive**: Mobile-first design
- ✅ **Dark Mode Ready**: CSS variables preparadas

### Performance
- ✅ **Lazy Loading**: Rutas y componentes pesados
- ✅ **Code Splitting**: Dynamic imports
- ✅ **Virtual Scrolling**: Para listas largas
- ✅ **Request Caching**: Cache en memoria
- ✅ **Debouncing**: Search inputs optimizados

---

## ✅ Checklist Final

- [x] Autenticación con Google OAuth
- [x] Teams con Google Maps location
- [x] Projects con id, name, description
- [x] Tasks con FullCalendar (start_date, end_date)
- [x] User roles (Tech SEO, Content SEO, Developer)
- [x] Database constraints en SQL
- [x] RLS policies para seguridad
- [x] Edge Functions para API keys
- [x] Modern UI design
- [x] 35 tests Moscow Method (10 auth + 25 app)
- [x] App.tsx con todas las rutas visibles
- [x] Performance optimizations
- [x] Responsive design
- [x] Accessibility features

---

## 🎉 Resultado Final

Un **SEO Compass MVP moderno y funcional** con:
- 🔐 Autenticación robusta con Google OAuth
- 👥 Gestión de equipos con ubicaciones (Google Maps)
- 📁 Proyectos con descripción completa
- 🔍 3 módulos SEO completos (Keywords, Content, Technical)
- ✅ Sistema de tareas con calendario visual (FullCalendar)
- 🎨 Diseño moderno y responsive
- 🔒 Seguridad garantizada con RLS
- 🚀 Performance optimizado
- 🧪 35 tests críticos

**Total: 124 commits en 14 phases** 