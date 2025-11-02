📋 Plan de Acción - SEO Compass MVP (Intermediate Developer) - V2.0
Metodología Agile - Desarrollo por Fases (Branches)
Stack Principal: React 19 + TypeScript + Tailwind 3.4.17 + Vite + Fetch API Backend: Supabase (Auth + Database + RLS + Edge Functions para API keys) Location: @react-google-maps/api (hook useLoadScript) Testing: Vitest + Testing Library - Moscow Method (35 tests total) Design Pattern: Atomic Design Merge Strategy: feature/* → develop con --ff + commit message Total Commits: ~140 commits

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

src/: components (atoms, molecules, organisms, templates), services, auth, config, hooks, pages, routes, schemas, types, utils/tests/mocks

chore: setup environment and supabase config

Crear .env.example con: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_GOOGLE_MAPS_API_KEY (Eliminada VITE_SUPABASE_EDGE_FUNCTION_URL)

src/config/supabase.ts con createClient

src/types/domain.ts con interfaces base (Eliminado src/config/googleMaps.ts básico)

Merge to develop: git merge feature/initial-setup --ff -m "chore: complete initial project setup"

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

🔐 PHASE 2: Authentication System with Google OAuth
Branch: feature/auth-system

Commits (8)


feat: configure supabase auth with google oauth

feat: create auth schemas with zod

feat: implement auth service layer

feat: create auth context and provider

feat: create modern ui atoms

feat: create form input molecule

feat: implement modern login and register pages

feat: setup routing and protected routes

App.tsx con React Router y todas las rutas configuradas.

Testing (10 tests - Moscow Method): src/utils/tests/auth.moscow.test.ts

Merge to develop: git merge feature/auth-system --ff -m "feat: complete authentication with google oauth"

🏠 PHASE 3: Welcome Page & Modern Landing
Branch: feature/welcome-page

Commits (6)


feat: create modern feature card molecule

feat: create hero section with modern design

feat: create features section with bento layout

feat: create how it works timeline section

feat: create modern footer and complete welcome page

feat: configure public routing

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

Commits (11)
feat: create useGoogleMaps hook with useLoadScript

Hook (src/hooks/useGoogleMaps.ts) que usa useLoadScript de @react-google-maps/api

Centraliza la carga del script y el estado (isLoaded, loadError).

feat: implement team service layer

src/services/teamService.ts (CRUD)

feat: create team context and hooks

src/contexts/TeamContext.tsx, src/hooks/useTeam.ts

feat: create google maps location autocomplete molecule

src/components/molecules/LocationAutocomplete.tsx

Usa el hook useGoogleMaps y el componente Autocomplete de @react-google-maps/api.

Input con dropdown de sugerencias.

feat: implement create team page with location

src/pages/CreateTeamPage.tsx

feat: create modern team selector organism

src/components/organisms/TeamSelector.tsx

feat: implement invitation service

src/services/invitationService.ts

feat: create invite member form and accept pages

src/components/organisms/InviteMemberForm.tsx, src/pages/AcceptInvitationPage.tsx

feat: create team members management page

src/pages/TeamMembersPage.tsx

feat: create team settings page

src/pages/TeamSettingsPage.tsx

feat: create modern navbar with team selector

src/components/organisms/Navbar.tsx

Merge to develop: git merge feature/team-workspace --ff -m "feat: complete team workspace with google maps"

📁 PHASE 6: Project Management Enhanced
Branch: feature/project-management

Commits (10)


feat: implement project service layer

feat: create project context and hooks

feat: create modern project card molecule

feat: implement projects dashboard page

feat: create project modal with description

feat: create project selector organism

feat: implement project overview page

feat: create project settings page

feat: implement project sidebar navigation

feat: add project filters hook

Merge to develop: git merge feature/project-management --ff -m "feat: complete project management system"

🔍 PHASE 7: Module 1 - Keyword Tracker
Branch: feature/keyword-tracker

Commits (12)
feat: create keyword database migration (keywords, rankings)

Supabase SQL migration (supabase migration new...)

Tablas: keywords, keyword_rankings.

RLS: Scope por project_id (que está vinculado al team_id).

feat: implement keyword service layer

feat: create serp scraping service with edge function

feat: create ranking calculation utilities

feat: create modern ranking badge molecule

feat: create add keyword form organism

feat: create modern keywords table organism

feat: implement keyword tracker page

feat: create visibility evolution chart

feat: implement keyword update service

feat: add keyword filters hook

feat: add bulk actions and export

Merge to develop: git merge feature/keyword-tracker --ff -m "feat: complete keyword tracker module"

✍️ PHASE 8: Module 2 - Content & On-Page Analyzer
Branch: feature/content-analyzer

Commits (13)
feat: create content audit database migration (audits, issues)

Supabase SQL migration

Tablas: content_audits, onpage_issues.

RLS: Scope por project_id.

feat: implement content scraping service with edge function

feat: create html parser utilities

feat: implement sitemap parser service

feat: create keyword analysis utility

feat: create redirect analyzer utility

feat: create duplicate detector utility

feat: implement validators utilities

feat: create optimization score calculator

feat: create recommendations engine

feat: create modern url input form organism

feat: create audit results table and badges

feat: implement content analyzer page

Merge to develop: git merge feature/content-analyzer --ff -m "feat: complete content analyzer module"

🔧 PHASE 9: Module 3 - Technical SEO Audit
Branch: feature/technical-audit

Commits (10)
feat: create technical audit database migration (audits)

Supabase SQL migration

Tabla: technical_audits (para guardar historial).

RLS: Scope por project_id.

feat: implement pagespeed service with edge function

feat: create modern score gauge molecule

feat: create lighthouse scores display organism

feat: implement core web vitals display

feat: create opportunities list organism

feat: create diagnostics list organism

feat: create technical audit form organism

feat: implement technical audit page

feat: add audit comparison and history

Merge to develop: git merge feature/technical-audit --ff -m "feat: complete technical audit module"

✅ PHASE 10: Module 4 - Action Center with FullCalendar
Branch: feature/action-center

Commits (14)
feat: create task database migration (tasks)

Supabase SQL migration

Tabla: tasks (id, description, priority, start_date, end_date, team_id, project_id, status, assigned_to).

RLS: Scope por team_id.

feat: implement task service layer

feat: create modern priority badge molecule

feat: create fullcalendar date range picker molecule

feat: create modern task card molecule

feat: create kanban column molecule

feat: create modern task list organism

feat: implement kanban board organism

feat: create task modal with fullcalendar

feat: create edit task modal

feat: implement action center page

feat: add task filters hook

feat: implement task linking to audits

feat: add realtime task updates

Merge to develop: git merge feature/action-center --ff -m "feat: complete action center with fullcalendar"

🎨 PHASE 11: UI/UX Modern Enhancement
Branch: feature/ui-enhancement

Commits (10)


feat: create modern design system tokens

feat: create loading and error components

feat: implement modern toast system

feat: create modern modal system

feat: create empty state and stat cards

feat: implement breadcrumbs navigation

feat: enhance navbar with user menu

feat: add responsive design improvements

feat: implement accessibility features

feat: add micro-interactions

Merge to develop: git merge feature/ui-enhancement --ff -m "feat: complete modern ui/ux"

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
(Esta fase no sufre cambios - 35 tests total)

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