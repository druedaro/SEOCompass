import { BarChart3, FileSearch, Wrench, CheckSquare, TrendingUp, Globe } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';

const features = [
  {
    icon: BarChart3,
    title: 'Keyword Tracker',
    description:
      'Monitor your keyword rankings in real-time. Track search volume, difficulty, and visibility evolution with beautiful charts.',
    className: 'md:col-span-2',
  },
  {
    icon: FileSearch,
    title: 'Content Analyzer',
    description:
      'Scrape URLs or sitemaps to detect 404s, redirects, duplicate content, missing meta tags, and more.',
    className: 'md:col-span-1',
  },
  {
    icon: Wrench,
    title: 'Technical SEO Audit',
    description:
      'Run comprehensive technical audits powered by Google PageSpeed Insights. Get actionable recommendations.',
    className: 'md:col-span-1',
  },
  {
    icon: CheckSquare,
    title: 'Action Center',
    description:
      'Manage SEO tasks with Kanban boards and list views. Link tasks to audits and track progress with your team.',
    className: 'md:col-span-2',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    description: 'Get instant insights with live data updates and performance metrics.',
    className: 'md:col-span-1',
  },
  {
    icon: Globe,
    title: 'Multi-language Support',
    description: 'Analyze hreflang tags and optimize for international SEO.',
    className: 'md:col-span-1',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need for SEO success
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed for Technical SEO specialists, Content SEO experts, and Developers.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className={`${feature.className} group hover:border-primary/50 transition-all duration-300`}
              >
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
