import { STEPS_DATA } from '@/constants/landing';

export function HowItWorksSection() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden bg-white">
      <div 
        className="absolute top-0 left-0 right-0 bottom-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/features.png)' }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
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
            <div className="absolute left-8 top-0 h-full w-0.5 bg-primary/20 hidden md:block" />

            <div className="space-y-12">
              {STEPS_DATA.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="relative flex gap-6 md:gap-8">
                    <div className="relative z-10 flex h-16 w-16 min-w-[4rem] items-center justify-center rounded-full bg-primary/10 border-2 border-primary/30">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>

                    <div className="flex-1 pt-1.5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-primary">{step.number}</span>
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
