import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signInWithGoogle } from '@/services/auth/authService';
import type { LoginFormData } from '@/types/schemas';

export function useLogin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (data: LoginFormData) => {
        try {
            setIsLoading(true);
            setError(null);

            await signIn(data);

            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';

            if (errorMessage.includes('Invalid login credentials')) {
                setError('Incorrect email or password. If you have just registered, please check your email to confirm your account.');
            } else if (errorMessage.includes('Email not confirmed')) {
                setError('Please confirm your email before logging in. Check your inbox.');
            } else {
                setError(errorMessage);
            }
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await signInWithGoogle();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
            setIsLoading(false);
        }
    };

    return {
        login,
        handleGoogleSignIn,
        isLoading,
        error,
    };
}
