import { Card, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { featuresData } from '@/data/AppData';

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
          {featuresData.map((feature) => {
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
