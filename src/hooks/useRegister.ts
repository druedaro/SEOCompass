import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, signInWithGoogle } from '@/services/auth/authService';
import { handleAsyncOperation } from '@/lib/asyncHandler';
import type { RegisterFormData } from '@/types/schemas';

export function useRegister() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (data: RegisterFormData) => {
        const success = await handleAsyncOperation(
            async () => {
                const result = await signUp(data);
                if (result.session === null) {
                    setError('Account created! Check your email to confirm your account before logging in.');
                    setTimeout(() => navigate('/auth/login'), 3000);
                } else {
                    setTimeout(() => navigate('/dashboard'), 100);
                }
            },
            {
                setLoading: setIsLoading,
                showSuccessToast: false,
                onError: (err: unknown) => {
                    const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
                    if (errorMessage.includes('already registered')) {
                        setError('This email address is already registered. Would you like to log in?');
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
        register,
        handleGoogleSignIn,
        isLoading,
        error,
    };
}
