import { Card, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { FEATURES_DATA } from '@/constants/landing';

export function FeaturesSection() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Gradient background that blends with hero */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/50 via-white to-violet-50/30" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-fuchsia-200/40 to-transparent rounded-full blur-3xl" />
      </div>
      
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
          {FEATURES_DATA.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className={`${feature.className} group hover:border-fuchsia-400 hover:shadow-xl hover:shadow-fuchsia-200/50 transition-all duration-300 backdrop-blur-sm bg-white/90`}
              >
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-100 to-violet-100 group-hover:from-fuchsia-200 group-hover:to-violet-200 transition-all shadow-md">
                    <Icon className="h-6 w-6 text-fuchsia-600" />
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
