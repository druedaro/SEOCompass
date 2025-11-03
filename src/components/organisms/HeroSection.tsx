import { Link } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { heroData } from '@/data/AppData';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Big gradient background + soft blob */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50" />
      <svg
        className="absolute -left-24 -top-24 -z-10 w-[60rem] opacity-20 blur-3xl"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <g transform="translate(300,300)">
          <path d="M120,-160C157,-129,189,-94,198,-52C208,-10,195,40,166,83C138,127,94,163,44,187C-6,211,-60,223,-103,203C-145,182,-176,130,-189,78C-201,26,-195,-26,-168,-69C-141,-112,-94,-137,-46,-166C2,-195,51,-228,96,-213C141,-197,83,-190,120,-160Z" fill="#6EE7B7" />
        </g>
      </svg>

      <div className="container mx-auto px-4">
        {/* Top bar with brand */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">SC</span>
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
            <span className="ml-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              The Complete SEO Platform
            </span>
          </h1>

          {/* Description */}
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            Track keywords, analyze content, run technical audits and manage fixes — all in one place for teams that ship results.
          </p>

          {/* Single Launch App CTA */}
          <div className="flex justify-center mb-12">
            <Button asChild size="lg" className="px-8">
              <Link to="/auth/login">Launch App</Link>
            </Button>
          </div>

          {/* Features row (light) */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-sm text-muted-foreground">
            {heroData.features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="flex flex-col items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-medium">{feature.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
