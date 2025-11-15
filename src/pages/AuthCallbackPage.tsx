import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/config/supabase';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          setError('Error al verificar tu email. Por favor intenta de nuevo.');
          return;
        }

        if (session) {
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          setTimeout(() => navigate('/auth/login'), 2000);
        }
      } catch {
        setError('Error al procesar la confirmación. Por favor intenta iniciar sesión.');
        setTimeout(() => navigate('/auth/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-fuchsia-100 to-cyan-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-xl max-w-md">
        {error ? (
          <>
            <div className="mb-4 text-red-500">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Error</h2>
            <p className="text-slate-600">{error}</p>
            <p className="text-sm text-slate-500 mt-4">You will be redirected to login...</p>
          </>
        ) : (
          <>
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
              Confirming your email...
            </h2>
            <p className="text-slate-600">
              We are confirming your account. You will be redirected shortly.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
