import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/auth/AuthProvider';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import WelcomePage from '@/pages/WelcomePage';
import { AUTH_PATHS } from '@/routes/paths';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Welcome page */}
          <Route path="/" element={<WelcomePage />} />
          
          {/* Auth routes */}
          <Route path={AUTH_PATHS.LOGIN} element={<LoginPage />} />
          <Route path={AUTH_PATHS.REGISTER} element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          
          {/* Protected routes - Dashboard placeholder */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                      Welcome to SEO Compass
                    </p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          
          {/* Catch all - redirect to welcome */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
