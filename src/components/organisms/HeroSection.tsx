import { Link } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { heroData } from '@/data/AppData';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
            {heroData.badge.text}
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            The Complete SEO Platform for{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Modern Teams
            </span>
          </h1>

          {/* Description */}
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000">
            {heroData.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <Button asChild size="lg" className="text-base">
              <Link to={heroData.cta.primary.href}>{heroData.cta.primary.text}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base">
              <a href={heroData.cta.secondary.href}>{heroData.cta.secondary.text}</a>
            </Button>
          </div>

          {/* Feature icons */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-7 duration-1000">
            {heroData.features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <span>{feature.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
