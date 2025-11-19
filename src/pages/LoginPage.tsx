import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/organisms/LoginForm';

export function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center">
              <a href="/"><img src="/logo.svg" alt="SEO Compass" className="h-12 w-12" /></a>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-purple-600">Welcome back</h1>
          <p className="text-gray-600 mt-2">
            Sign in to your SEO Compass account
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
