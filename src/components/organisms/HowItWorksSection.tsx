import { STEPS_DATA } from '@/constants/landing';

export function HowItWorksSection() {
  return (
    <section className="relative py-20 sm:py-32 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            How SEO Compass Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From project creation to tracking results, we guide you through every step of your SEO journey.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-purple-200 hidden md:block" />

            <div className="space-y-12">
              {STEPS_DATA.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="relative flex gap-6 md:gap-8">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-purple-100 border-2 border-purple-300">
                      <Icon className="h-7 w-7 text-purple-600" />
                    </div>

                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-purple-600">{step.number}</span>
                        <h3 className="text-xl font-bold">{step.title}</h3>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
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
