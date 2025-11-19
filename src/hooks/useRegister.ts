import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, signInWithGoogle } from '@/services/auth/authService';
import type { RegisterFormData } from '@/types/schemas';

export function useRegister() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (data: RegisterFormData) => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await signUp(data);

            if (result.session === null) {
                setError('Account created! Check your email to confirm your account before logging in.');
                setIsLoading(false);
                setTimeout(() => navigate('/auth/login'), 3000);
            } else {
                setTimeout(() => {
                    navigate('/dashboard');
                }, 100);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create account';

            if (errorMessage.includes('already registered')) {
                setError('This email address is already registered. Would you like to log in?');
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
        register,
        handleGoogleSignIn,
        isLoading,
        error,
    };
}
