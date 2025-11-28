import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/auth/AuthContext';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import { WelcomePage } from '@/pages/WelcomePage';
import { AUTH_PATHS } from '@/routes/paths';

// Lazy load heavy pages for better performance
const CreateTeamPage = lazy(() => import('@/pages/CreateTeamPage').then(m => ({ default: m.CreateTeamPage })));
const TeamMembersPage = lazy(() => import('@/pages/TeamMembersPage').then(m => ({ default: m.TeamMembersPage })));
const TeamSettingsPage = lazy(() => import('@/pages/TeamSettingsPage').then(m => ({ default: m.TeamSettingsPage })));
const ProjectsDashboardPage = lazy(() => import('@/pages/ProjectsDashboardPage').then(m => ({ default: m.ProjectsDashboardPage })));
const ProjectOverviewPage = lazy(() => import('@/pages/ProjectOverviewPage').then(m => ({ default: m.ProjectOverviewPage })));
const ProjectSettingsPage = lazy(() => import('@/pages/ProjectSettingsPage').then(m => ({ default: m.ProjectSettingsPage })));
const ContentAnalyzerPage = lazy(() => import('@/pages/ContentAnalyzerPage').then(m => ({ default: m.ContentAnalyzerPage })));
const ProjectUrlsManagementPage = lazy(() => import('@/pages/ProjectUrlsManagementPage').then(m => ({ default: m.ProjectUrlsManagementPage })));
const UrlDetailsPage = lazy(() => import('@/pages/UrlDetailsPage').then(m => ({ default: m.UrlDetailsPage })));
const ActionCenterPage = lazy(() => import('@/pages/ActionCenterPage').then(m => ({ default: m.ActionCenterPage })));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkspaceProvider>
          <ProjectProvider>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path={AUTH_PATHS.LOGIN} element={<LoginPage />} />
                <Route path={AUTH_PATHS.REGISTER} element={<RegisterPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Navigate to="/dashboard/projects" replace />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/create-team"
                  element={
                    <ProtectedRoute>
                      <CreateTeamPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/team/members"
                  element={
                    <ProtectedRoute>
                      <TeamMembersPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/team/settings"
                  element={
                    <ProtectedRoute>
                      <TeamSettingsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/projects"
                  element={
                    <ProtectedRoute>
                      <ProjectsDashboardPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/projects/:projectId"
                  element={
                    <ProtectedRoute>
                      <ProjectOverviewPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/projects/:projectId/settings"
                  element={
                    <ProtectedRoute>
                      <ProjectSettingsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/projects/:projectId/content"
                  element={
                    <ProtectedRoute>
                      <ContentAnalyzerPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/projects/:projectId/urls"
                  element={
                    <ProtectedRoute>
                      <ProjectUrlsManagementPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/projects/:projectId/url/:urlId"
                  element={
                    <ProtectedRoute>
                      <UrlDetailsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/projects/:projectId/actions"
                  element={
                    <ProtectedRoute>
                      <ActionCenterPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <Toaster />
          </ProjectProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
