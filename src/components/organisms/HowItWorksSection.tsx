import { STEPS_DATA } from '@/constants/landing';

export function HowItWorksSection() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-fuchsia-50 via-violet-50 to-cyan-50" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-fuchsia-300/40 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-300/40 to-transparent rounded-full blur-3xl" />
      
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
            <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-fuchsia-400/50 via-violet-400/50 to-cyan-400/50 hidden md:block" />

            <div className="space-y-12">
              {STEPS_DATA.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="relative flex gap-6 md:gap-8">
                    <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-100 to-violet-100 backdrop-blur-sm border-2 border-fuchsia-400 shadow-xl shadow-fuchsia-300/50">
                      <Icon className="h-7 w-7 text-fuchsia-600" />
                    </div>

                    <div className="flex-1 pt-1.5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">{step.number}</span>
                        <h3 className="text-xl font-bold">{step.title}</h3>
                      </div>
                      <p className="text-slate-600 font-medium">{step.description}</p>
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
