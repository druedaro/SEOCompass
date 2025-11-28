import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { registerSchema, roleOptions } from '@/schemas/authSchema';
import type { RegisterFormData } from '@/types/schemas';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { PasswordInput } from '@/components/atoms/PasswordInput';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/molecules/Form';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/molecules/DropdownMenu';
import { OAuthButtons } from '@/components/molecules/OAuthButtons';
import { useRegister } from '@/hooks/useRegister';

export function RegisterForm() {
    const { register, handleGoogleSignIn, isLoading, error } = useRegister();

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: undefined,
        },
    });

    const selectedRole = form.watch('role');

    const onSubmit = (data: RegisterFormData) => {
        register(data);
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
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="David Rueda"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-between"
                                                type="button"
                                            >
                                                {selectedRole
                                                    ? roleOptions.find((r) => r.value === selectedRole)?.label
                                                    : 'Select your role'}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-full">
                                            {roleOptions.map((role) => (
                                                <DropdownMenuItem
                                                    key={role.value}
                                                    onClick={() => field.onChange(role.value)}
                                                >
                                                    {role.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </FormControl>
                                <FormDescription>
                                    Choose the role that best describes you
                                </FormDescription>
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
                                    <PasswordInput placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <PasswordInput placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            'Creating account...'
                        ) : (
                            <>
                                <UserPlus className="h-4 w-4" />
                                Create Account
                            </>
                        )}
                    </Button>
                </form>
            </Form>

            <OAuthButtons onGoogleSignIn={handleGoogleSignIn} isLoading={isLoading} />

            <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
