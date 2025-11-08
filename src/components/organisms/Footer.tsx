import { Link, useNavigate } from 'react-router-dom';
import { AUTH_PATHS } from '@/routes/paths';
import { useAuth } from '@/hooks/useAuth';

export function Footer() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <footer className="relative border-t overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-cyan-50" />
      
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center">
              <img src="/logo.svg" alt="SEO Compass" className="h-10 w-10" />
            </div>
            <div>
              <div className="font-bold text-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">SEO Compass</div>
              <div className="text-sm text-slate-600 font-medium">The complete SEO platform for Technical SEO specialists, Content experts, and Developers.</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <span className="text-sm font-semibold text-slate-600">{user.email}</span>
                <Link to="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-fuchsia-600 transition-colors">Dashboard</Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-semibold text-slate-600 hover:text-fuchsia-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to={AUTH_PATHS.LOGIN} className="text-sm font-semibold text-slate-600 hover:text-fuchsia-600 transition-colors">Sign In</Link>
                <Link to={AUTH_PATHS.REGISTER} className="text-sm font-semibold text-slate-600 hover:text-fuchsia-600 transition-colors">Get Started</Link>
              </>
            )}
          </div>

          <div className="text-sm text-slate-500 font-medium">© {new Date().getFullYear()} SEO Compass. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

