📋 Plan de Acción - SEO Compass MVP
Metodología Agile - Desarrollo por Fases (Branches)
Stack Principal: React 19 + TypeScript + Shadcn/UI + Tailwind 3.4.17 + Vite Componentes Clave: react-hook-form + zod, recharts, react-dnd, @react-google-maps/api, react-day-picker Backend: Supabase (Auth + Database + RLS + Edge Functions) Testing: Vitest + Testing Library - Moscow Method (35 tests total) Merge Strategy: feature/* → develop con --ff + commit message

🎯 PHASE 0: Initial Setup & Shadcn/UI
Branch: initial-setup

Commits (6)
chore: initialize vite react typescript project

npm create vite@latest seo-compass -- --template react-ts

npm install react-router-dom@7.9 react-hook-form@7.64 zod@4.1 @hookform/resolvers

chore: install core dependencies

npm install @supabase/supabase-js@2.47

npm install recharts@2.14 react-dnd@16.0 react-dnd-html5-backend lucide-react

npm install @react-google-maps/api

npm install react-day-picker

chore: configure tailwind css

npm install -D tailwindcss@3.4.17 postcss@8.5.6 autoprefixer

npx tailwindcss init -p

chore: initialize shadcn/ui

npx shadcn-ui@latest init

Esto configurará tailwind.config.js y globals.css (o index.css) con las variables de CSS y utilidades de shadcn.

chore: setup vitest, testing library, eslint, and typescript

npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event eslint ...

Configurar vitest.config.ts, .eslintrc.json, tsconfig.json.

chore: setup environment and project structure

.env.example con VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_GOOGLE_MAPS_API_KEY.

src/config/supabase.ts, src/types/domain.ts.

src/lib/utils.ts

Merge to develop: git merge feature/initial-setup-shadcn --ff -m "chore: complete initial project setup with shadcn/ui"

🗄️ PHASE 1: Core Database Schema (Auth & Teams)
Branch: feature/database-core

Commits (3)
feat: create core database schema (auth, teams, projects)

Supabase SQL migration (usando Supabase CLI) solo para tablas core:

profiles (id, user_id FK, role ENUM('tech_seo', 'content_seo', 'developer'))

teams (id, name, location TEXT, user_id FK, created_at)

team_members (id, team_id FK, user_id FK, role, joined_at)

invitations (id, team_id FK, email, token UUID, status, created_at)

projects (id, name, description, team_id FK, created_at, updated_at)

feat: implement core row level security policies

RLS policies solo para las tablas core:

profiles: Usuarios solo pueden ver/editar su propio perfil.

teams: Usuarios solo ven teams donde son miembros.

projects: Usuarios solo ven projects de sus teams.

Enable RLS en todas las tablas core.

feat: create core database functions and triggers

Function para auto-añadir creator a team_members al crear un team.

Trigger para updated_at en projects.

Merge to develop: git merge feature/database-core --ff -m "feat: complete core database schema with rls"

🔐 PHASE 2: Authentication System with Shadcn/UI
Branch: feature/auth-system

Commits (7)
chore: add shadcn components (button, input, label, form, dropdown)

npx shadcn-ui@latest add button input label form dropdown-menu

feat: configure supabase auth with google oauth

Configurar Google OAuth en Supabase Dashboard.

feat: create auth schemas with zod

src/schemas/authSchema.ts (loginSchema, registerSchema con role).

feat: implement auth service layer

src/services/authService.ts (signUp, signIn, signInWithGoogle, etc.).

feat: create auth context and provider

src/auth/AuthProvider.tsx, src/hooks/useAuth.ts.

feat: implement modern login and register pages

src/pages/LoginPage.tsx, src/pages/RegisterPage.tsx.

Usa el componente Form de shadcn/ui, que se integra perfectamente con react-hook-form y zod para la validación y los errores.

Usa el componente Button (con variant="outline") para "Continuar con Google".

Usa DropdownMenu o Select para el selector de roles.

feat: setup routing and protected routes

src/routes/ProtectedRoute.tsx, src/routes/paths.ts, App.tsx.

Testing (10 tests - Moscow Method): src/utils/tests/auth.moscow.test.ts

Merge to develop: git merge feature/auth-system --ff -m "feat: complete authentication with shadcn/ui"

🏠 PHASE 3: Welcome Page & Modern Landing
Branch: feature/welcome-page

Commits (5)
chore: add shadcn components (card)

npx shadcn-ui@latest add card

feat: create modern hero section

src/components/organisms/HeroSection.tsx.

feat: create features section with bento layout

src/components/organisms/FeaturesSection.tsx.

Usa el componente Card de shadcn como base para cada FeatureCard en el layout bento.

feat: create how it works timeline section

src/components/organisms/HowItWorksSection.tsx.

feat: create modern footer and complete welcome page

src/components/organisms/Footer.tsx, src/pages/WelcomePage.tsx.

Merge to develop: git merge feature/welcome-page --ff -m "feat: complete modern welcome page"

🔧 PHASE 4: Supabase Edge Functions for API Keys
Branch: feature/edge-functions

Commits (4)
feat: create edge function for scrapingbee proxy

feat: create edge function for pagespeed proxy

feat: deploy edge functions to supabase

feat: create edge function client services

src/services/edgeFunctionService.ts (usando supabase.functions.invoke)

Merge to develop: git merge feature/edge-functions --ff -m "feat: complete edge functions for api key protection"

👥 PHASE 5: Team & Workspace with Google Maps
Branch: feature/team-workspace

Commits (10)
chore: add shadcn components (dialog, select, combobox, avatar)

npx shadcn-ui@latest add dialog select combobox avatar

feat: create useGoogleMaps hook with useLoadScript

src/hooks/useGoogleMaps.ts (usando @react-google-maps/api).

feat: implement team service layer

src/services/teamService.ts.

feat: create team context and hooks

src/contexts/TeamContext.tsx, src/hooks/useTeam.ts.

feat: create google maps location autocomplete molecule

src/components/molecules/LocationAutocomplete.tsx (usando Autocomplete de @react-google-maps/api estilizado para que coincida con shadcn).

feat: implement create team page with location

src/pages/CreateTeamPage.tsx (usando Form de shadcn).

feat: create modern team selector organism

src/components/organisms/TeamSelector.tsx (usando Combobox o Select de shadcn).

feat: implement invitation service and forms

src/services/invitationService.ts, src/components/organisms/InviteMemberForm.tsx (en un Dialog de shadcn).

feat: create team members management and settings pages

src/pages/TeamMembersPage.tsx, src/pages/TeamSettingsPage.tsx.

feat: create modern navbar with team selector

src/components/organisms/Navbar.tsx (usando DropdownMenu para el perfil de usuario con Avatar).

Merge to develop: git merge feature/team-workspace --ff -m "feat: complete team workspace with google maps"

📁 PHASE 6: Project Management Enhanced
Branch: feature/project-management

Commits (10)
feat: implement project service layer

feat: create project context and hooks

feat: create modern project card molecule (usando Card de shadcn)

feat: implement projects dashboard page

feat: create project modal with description (usando Dialog y Textarea de shadcn)

feat: create project selector organism (usando Combobox de shadcn)

feat: implement project overview page

feat: create project settings page

feat: implement project sidebar navigation

feat: add project filters hook

Merge to develop: git merge feature/project-management --ff -m "feat: complete project management system"

🔍 PHASE 7: Module 1 - Keyword Tracker
Branch: feature/keyword-tracker

Commits (11)
chore: add shadcn components (table, badge)

npx shadcn-ui@latest add table badge

feat: create keyword database migration (keywords, rankings)

feat: implement keyword service layer

feat: create serp scraping service with edge function

feat: create ranking calculation utilities

feat: create modern keywords table organism

src/components/organisms/KeywordsTable.tsx

Usa el componente Table de shadcn.

Usa Badge de shadcn para el RankingBadge.

feat: create add keyword form organism

src/components/organisms/AddKeywordForm.tsx (usando Form).

feat: implement keyword tracker page

src/pages/KeywordTrackerPage.tsx.

feat: create visibility evolution chart

src/components/organisms/VisibilityChart.tsx (con Recharts).

feat: implement keyword update service and filters

feat: add bulk actions and export

Merge to develop: git merge feature/keyword-tracker --ff -m "feat: complete keyword tracker module"

✍️ PHASE 8: Module 2 - Content & On-Page Analyzer
Branch: feature/content-analyzer

Commits (13)
feat: create content audit database migration (audits, issues)

feat: implement content scraping service with edge function

feat: create html parser utilities

feat: implement sitemap parser service

feat: create keyword analysis utility

feat: create redirect analyzer utility

feat: create duplicate detector utility

feat: implement validators utilities

feat: create optimization score calculator

feat: create recommendations engine

feat: create modern url input form organism (usando Tabs de shadcn)

feat: create audit results table and badges (usando Table y Badge de shadcn)

feat: implement content analyzer page

Merge to develop: git merge feature/content-analyzer --ff -m "feat: complete content analyzer module"

🔧 PHASE 9: Module 3 - Technical SEO Audit
Branch: feature/technical-audit

Commits (10)
feat: create technical audit database migration (audits)

feat: implement pagespeed service with edge function

feat: create modern score gauge molecule

feat: create lighthouse scores display organism (usando Card de shadcn)

feat: implement core web vitals display

feat: create opportunities list organism (usando Accordion de shadcn)

feat: create diagnostics list organism

feat: create technical audit form organism (usando RadioGroup de shadcn)

feat: implement technical audit page

feat: add audit comparison and history

Merge to develop: git merge feature/technical-audit --ff -m "feat: complete technical audit module"

✅ PHASE 10: Module 4 - Action Center with Shadcn Calendar
Branch: feature/action-center

Commits (13)
chore: add shadcn components (calendar, popover, tabs)

npx shadcn-ui@latest add calendar popover tabs

feat: create task database migration (tasks)

feat: implement task service layer

feat: create modern priority badge molecule

Usa Badge de shadcn con variantes de color.

feat: create shadcn date range picker molecule

src/components/molecules/DateRangePicker.tsx

Usa los componentes Calendar y Popover de shadcn para crear un selector de rango.

feat: create modern task card molecule

src/components/molecules/TaskCard.tsx (usando Card de shadcn).

feat: create kanban column and board organisms

src/components/molecules/KanbanColumn.tsx, src/components/organisms/KanbanBoard.tsx (lógica de React DnD).

feat: create modern task list organism

src/components/organisms/TaskList.tsx (usando Table).

feat: create task modals (create and edit)

src/components/organisms/CreateTaskModal.tsx (usando Dialog).

El formulario usa el DateRangePicker de shadcn (paso 5).

feat: implement action center page

src/pages/ActionCenterPage.tsx

Usa Tabs de shadcn para cambiar entre "List View" y "Kanban Board".

feat: add task filters hook

feat: implement task linking to audits

feat: add realtime task updates

Merge to develop: git merge feature/action-center --ff -m "feat: complete action center with shadcn calendar"

🎨 PHASE 11: UI/UX Modern Enhancement
Branch: feature/ui-enhancement

Commits (6)
chore: add shadcn components (toast, skeleton, alert)

npx shadcn-ui@latest add toast skeleton alert-dialog

feat: configure toaster component

Añadir el <Toaster /> al layout principal.

Crear src/hooks/useToast.ts (que usa el hook useToast de shadcn).

feat: create loading and error components

src/components/organisms/ErrorBoundary.tsx.

Usar Skeleton de shadcn para los estados de carga.

feat: create reusable modal and empty states

src/components/molecules/EmptyState.tsx.

feat: implement breadcrumbs navigation

src/components/molecules/Breadcrumbs.tsx.

feat: implement accessibility and responsive final pass

Verificar la navegación por teclado y ARIA.

Pulir breakpoints.

Merge to develop: git merge feature/ui-enhancement --ff -m "feat: complete modern ui/ux with shadcn"

⚡ PHASE 12: Performance Optimization
Branch: feature/performance

Commits (7)
perf: implement lazy loading for routes

perf: add code splitting

perf: optimize images and lazy loading

perf: implement caching and debouncing

perf: optimize supabase queries

perf: add virtual scrolling

perf: final optimization and cleanup

Merge to develop: git merge feature/performance --ff -m "perf: complete performance optimizations"

🧪 PHASE 13: Comprehensive Testing - Moscow Method
Branch: feature/comprehensive-testing

Commits (6)
test: add auth moscow tests (10 tests)

test: add team management moscow tests (5 tests)

test: add project management moscow tests (5 tests)

test: add keyword tracker moscow tests (5 tests)

test: add content analyzer moscow tests (5 tests)

test: add action center moscow tests (5 tests)

Merge to develop: git merge feature/comprehensive-testing --ff -m "test: complete moscow testing suite"

🚀 PHASE 14: Production Preparation
Branch: release/v1.0.0

Commits (4)
chore: configure production environment

chore: setup ci/cd pipeline

chore: final build optimization

release: version 1.0.0 mvp launch

Merge to main: git checkout main && git merge develop --ff -m "release: v1.0.0 production ready"