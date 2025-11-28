import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { loginSchema } from '@/schemas/authSchema';
import type { LoginFormData } from '@/types/schemas';
import { Button } from '@/components/atoms/Button';
import { PasswordInput } from '@/components/atoms/PasswordInput';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/molecules/Form';
import { Input } from '@/components/atoms/Input';
import { OAuthButtons } from '@/components/molecules/OAuthButtons';
import { useLogin } from '@/hooks/useLogin';

export function LoginForm() {
    const { login, handleGoogleSignIn, isLoading, error } = useLogin();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormData) => {
        login(data);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="itacademy@gmail.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="••••••••"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-end">
                        <Link
                            to="/auth/forgot-password"
                            className="text-sm text-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            'Signing in...'
                        ) : (
                            <>
                                <LogIn className="h-4 w-4" />
                                Sign In
                            </>
                        )}
                    </Button>
                </form>
            </Form>

            <OAuthButtons onGoogleSignIn={handleGoogleSignIn} isLoading={isLoading} />
        </div>
    );
}
