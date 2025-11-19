import { RegisterForm } from '@/components/organisms/RegisterForm';

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center">
              <a href="/"><img src="/logo.svg" alt="SEO Compass" className="h-12 w-12" /></a>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-purple-600">Create an account</h1>
          <p className="text-gray-600 mt-2">
            Join SEO Compass and optimize your websites
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
