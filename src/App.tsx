import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/auth/AuthProvider';
import { WorkspaceProvider } from '@/context/WorkspaceContext';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import WelcomePage from '@/pages/WelcomePage';
import CreateTeamPage from '@/pages/CreateTeamPage';
import TeamMembersPage from '@/pages/TeamMembersPage';
import TeamSettingsPage from '@/pages/TeamSettingsPage';
import { ProjectsDashboardPage } from '@/pages/ProjectsDashboardPage';
import { ProjectOverviewPage } from '@/pages/ProjectOverviewPage';
import { ProjectSettingsPage } from '@/pages/ProjectSettingsPage';
import ContentAnalyzerPage from '@/pages/ContentAnalyzerPage';
import ProjectUrlsManagementPage from '@/pages/ProjectUrlsManagementPage';
import { AUTH_PATHS } from '@/routes/paths';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkspaceProvider>
          <ProjectProvider>
            <Routes>
              {/* Welcome page */}
              <Route path="/" element={<WelcomePage />} />
              
              {/* Auth routes */}
              <Route path={AUTH_PATHS.LOGIN} element={<LoginPage />} />
              <Route path={AUTH_PATHS.REGISTER} element={<RegisterPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              
              {/* Protected routes - Team Management */}
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
              
              {/* Protected routes - Project Management */}
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
              
              {/* Catch all - redirect to welcome */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ProjectProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
