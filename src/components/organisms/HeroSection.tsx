import { Link } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { useAuth } from '@/hooks/useAuth';
import { heroData } from '@/data/AppData';

export function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Vibrant gradient mesh background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-fuchsia-100 to-cyan-100" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-fuchsia-300/50 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-300/50 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-violet-300/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>
      
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4">
        {/* Top bar with brand */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <img src="/logo.svg" alt="SEO Compass" className="h-10 w-10" />
            </div>
            <span className="text-lg font-semibold">SEO Compass</span>
          </Link>
        </div>

        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            {heroData.badge.text}
          </div>

          {/* Large Heading */}
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            SEO Compass —
            <span className="ml-2 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent">
              The Complete SEO Platform
            </span>
          </h1>

          {/* Description */}
          <p className="mb-8 text-lg text-slate-700 sm:text-xl max-w-2xl mx-auto font-medium">
            Track keywords, analyze content, run technical audits and manage fixes — all in one place for teams that ship results.
          </p>

          {/* Single Launch App CTA - DESTACADO */}
          <div className="flex justify-center mb-12">
            <Button asChild size="lg" className="px-10 py-6 text-lg font-bold bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 shadow-2xl shadow-fuchsia-500/50 hover:shadow-fuchsia-600/60 transition-all duration-300 hover:scale-105 border-0">
              <Link to={user ? '/dashboard' : '/auth/login'}>
                🚀 Launch App
              </Link>
            </Button>
          </div>

          {/* Features row (light) */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-sm text-slate-700">
            {heroData.features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="flex flex-col items-center gap-2">
                  <div className="rounded-lg bg-gradient-to-br from-fuchsia-100 to-violet-100 p-3 shadow-lg">
                    <Icon className="h-6 w-6 text-fuchsia-600" />
                  </div>
                  <span className="font-semibold">{feature.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
