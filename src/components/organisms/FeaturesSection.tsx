import { Card, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { FEATURES_DATA } from '@/constants/landing';

export function FeaturesSection() {
  return (
    <section className="relative py-20 sm:py-32 bg-gray-50">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-40"
      >
        <source src="/features.mp4" type="video/mp4" />
      </video>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-shadow-md">
            Everything you need for SEO success
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed for Technical SEO specialists, Content SEO experts, and SEO Managers.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {FEATURES_DATA.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="hover:border-primary/30 hover:shadow-lg transition-all bg-white"
              >
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
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
