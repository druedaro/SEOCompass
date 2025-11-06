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


✍️ PHASE 7: Module 1 - Content & On-Page Analyzer
Branch: feature/content-analyzer

Commits (13)
feat: create content audit database migration (audits, issues)

feat: implement content scraping service with edge function

feat: create html parser utilities

feat: create keyword analysis utility

feat: create redirect and 404 analyzer utility

feat: implement validators utilities

feat: create optimization score calculator

feat: create recommendations using direct issue-type mapping

feat: create modern url input form organism (usando Tabs de shadcn)

feat: create audit results table and badges (usando Table y Badge de shadcn)

feat: implement content analyzer page

Merge to develop: git merge feature/content-analyzer --ff -m "feat: complete content analyzer module"

🔧 PHASE 7.5: Refactor - Implement 45 URL Tracking
Branch: refactor/project-url-management

Objective: Modify the existing Phase 7 architecture. The "random URL audit" feature will be removed and replaced with a management and tracking system for 45 URLs per project.

Commits (10):

feat: create project_urls migration (table, FK, RLS limit 45)

Creates the new project_urls table (id, project_id, url).

Adds the Supabase RLS policy to limit to 45 URLs.

refactor(db): modify content_audits table to link to project_url_id

Modifies your content audit database migration (from Phase 7).

Adds the project_url_id (FK) column and removes the plain text url column (if it existed).

feat: implement project_urls service (add, delete, getByProject)

Creates the new projectUrlsService.ts for the CRUD management of the 45 URLs.

feat: create project urls management page (in Project Settings)

Creates the new UI in "Project Settings" (Phase 6) for the user to add/remove their 45 URLs.

refactor(service): update scraping service to audit by project_url_id

Modifies the content scraping service (from Phase 7).

Changes its signature: it no longer receives a url string, but a project_url_id.

refactor(content-analyzer): remove modern url input form organism

Removes the modern url input form organism component (from Phase 7) and its logic.

feat: create project urls list organism (table with audit button)

Creates the new main component for the page: the table that lists the project's 45 URLs.

refactor(content-analyzer): move audit results table to details view

Takes your audit results table (from Phase 7) and refactors it to show the issues for a specific URL (in a modal or details view).

feat(content-analyzer): add audit history chart per url (recharts)

Creates the new recharts chart component that consumes the history data for a project_url_id.

refactor(content-analyzer): implement empty state logic on page

Modifies the content analyzer page (from Phase 7) to show the "Empty State" if urls.length === 0.

Merge to develop: git merge refactor/project-url-management --ff -m "refactor(content): complete migration to project url management"

feat: create url details page (with chart and results table)

feat: create "add task" button (in details view)

refactor(content-analyzer): update main list to link to details page

refactor(content-analyzer): remove old audit results modal

✅ PHASE 9: Module 3 - Action Center with Shadcn Calendar
Branch: feature/action-center

Commits (9):

chore: add shadcn components (calendar, popover, table, badge, dialog)

npx shadcn-ui@latest add calendar popover table badge dialog

feat: create task database migration (tasks)

feat: implement task service layer

feat: create modern priority badge molecule

Usa Badge de shadcn con variantes de color.

feat: create due date picker molecule with shadcn calendar and popover

src/components/molecules/DatePicker.tsx (para fecha única)

feat: create modern task list organism

src/components/organisms/TaskList.tsx (usando Table de shadcn).

Esta es la UI principal. Muestra las tareas con sus badges visuales.

feat: create task modals (create and edit)

src/components/organisms/CreateTaskModal.tsx (usando Dialog).

El formulario usa el DatePicker del paso 5.

feat: use textual references for task-audit link

Añade un campo de texto en el modal que se auto-rellenará cuando se llame desde el botón [+ Add Task] de la Fase 7.5.

feat: implement action center page

Página simple que renderiza el TaskList (paso 6) y el botón "Crear Tarea".

Merge to develop: git merge feature/action-center --ff -m "feat: complete action center with simplified tasklist"

🎨 PHASE 10: UI/UX Modern Enhancement
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

Pulir breakpoints.

Merge to develop: git merge feature/ui-enhancement --ff -m "feat: complete modern ui/ux with shadcn"

🧪 PHASE 11: Comprehensive Testing - Moscow Method
Branch: feature/comprehensive-testing

Commits (6)
test: add auth moscow tests (10 tests)

test: add team management moscow tests (5 tests)

test: add project management moscow tests (5 tests)

test: add content analyzer moscow tests (5 tests)

test: add action center moscow tests (5 tests)

Merge to develop: git merge feature/comprehensive-testing --ff -m "test: complete moscow testing suite"

🚀 PHASE 12: Production Preparation
Branch: release/v1.0.0

Commits (4)
chore: configure production environment

chore: setup ci/cd pipeline

chore: final build optimization

release: version 1.0.0 mvp launch

Merge to main: git checkout main && git merge develop --ff -m "release: v1.0.0 production ready"