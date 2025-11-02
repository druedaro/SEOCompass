import { FolderPlus, Plus, Search, AlertTriangle, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: FolderPlus,
    title: 'Create Your Project',
    description: 'Set up a new SEO project in seconds. Add your website URL and configure basic settings.',
    number: '01',
  },
  {
    icon: Plus,
    title: 'Add Keywords',
    description: 'Import keywords manually or from CSV. Track their rankings, search volume, and difficulty.',
    number: '02',
  },
  {
    icon: Search,
    title: 'Analyze Content',
    description: 'Scrape URLs or sitemaps to detect SEO issues like 404s, missing meta tags, and duplicate content.',
    number: '03',
  },
  {
    icon: AlertTriangle,
    title: 'Fix Issues',
    description: 'Get actionable recommendations. Create tasks in the Action Center and assign them to your team.',
    number: '04',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor keyword rankings, audit scores, and task completion with real-time dashboards.',
    number: '05',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            How SEO Compass Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From project creation to tracking results, we guide you through every step of your SEO journey.
          </p>
        </div>

        {/* Timeline */}
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 h-full w-0.5 bg-border hidden md:block" />

            <div className="space-y-12">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="relative flex gap-6 md:gap-8">
                    {/* Icon circle */}
                    <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-background border-2 border-primary">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1.5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-muted-foreground">{step.number}</span>
                        <h3 className="text-xl font-bold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
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
