import { Link } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { useAuth } from '@/hooks/useAuth';
import { HERO_DATA } from '@/constants/landing';

export function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-gray-50">
      <div 
        className="absolute top-0 left-0 right-0 bottom-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero.png)' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <img src="/logo.svg" alt="SEO Compass" className="h-10 w-10" />
            </div>
            <span className="text-lg font-semibold">SEO Compass</span>
          </Link>
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700"> <img src="/logo.svg" alt="SEO Compass" className="h-6 w-6" />
            {HERO_DATA.badge.text}
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            SEO Compass — <span className="text-purple-600">The Complete SEO Platform</span>
          </h1>

          <p className="mb-8 text-lg text-gray-600 sm:text-xl max-w-2xl mx-auto">
            Track keywords, analyze content, run technical audits and manage fixes — all in one place for teams that ship results.
          </p>

          <div className="flex justify-center mb-12">
            <Button asChild size="lg" className="px-8 py-6 text-base font-semibold bg-purple-600 hover:bg-purple-700">
              
              <Link to={user ? '/dashboard' : '/auth/login'}>
              Launch App
              </Link>
            </Button>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-2xl">
              {HERO_DATA.features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="flex flex-col items-center gap-2">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <Icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-700">{feature.label}</span>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
