import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, FileSearch, Wrench, CheckSquare } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20 py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <span className="font-medium">SEO Analytics Platform</span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Optimize Your Website's
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              {' '}
              SEO Performance
            </span>
          </h1>

          {/* Description */}
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            Track keywords, analyze content, audit technical SEO, and manage tasks all in one
            powerful platform. Built for teams that care about results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/auth/register">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/auth/login">Sign In</Link>
            </Button>
          </div>

          {/* Feature Icons */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Keyword Tracking</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-3">
                <FileSearch className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Content Analysis</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-3">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Technical Audit</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-3">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Action Center</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]"></div>
    </section>
  );
}
