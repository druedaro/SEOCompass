import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signInWithGoogle } from '@/services/auth/authService';
import { handleAsyncOperation } from '@/lib/asyncHandler';
import type { LoginFormData } from '@/types/schemas';

export function useLogin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (data: LoginFormData) => {
        const success = await handleAsyncOperation(
            async () => {
                await signIn(data);
                navigate('/dashboard');
            },
            {
                setLoading: setIsLoading,
                showSuccessToast: false,
                onError: (err: unknown) => {
                    const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
                    if (errorMessage.includes('Invalid login credentials')) {
                        setError('Incorrect email or password. If you have just registered, please check your email to confirm your account.');
                    } else if (errorMessage.includes('Email not confirmed')) {
                        setError('Please confirm your email before logging in. Check your inbox.');
                    } else {
                        setError(errorMessage);
                    }
                }
            }
        );
        if (success) setError(null);
    };

    const handleGoogleSignIn = async () => {
        const success = await handleAsyncOperation(
            async () => {
                await signInWithGoogle();
            },
            {
                setLoading: setIsLoading,
                showSuccessToast: false,
                onError: (err: unknown) => setError(err instanceof Error ? err.message : 'Failed to sign in with Google')
            }
        );
        if (success) setError(null);
    };

    return {
        login,
        handleGoogleSignIn,
        isLoading,
        error,
    };
}
