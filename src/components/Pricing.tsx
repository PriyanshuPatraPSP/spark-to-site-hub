import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for occasional cutouts.",
    features: ["5 images / day", "On-device processing", "PNG export", "Standard quality"],
    cta: "Start free",
    variant: "glow" as const,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/ month",
    desc: "For creators and small teams.",
    features: ["Unlimited images", "Batch processing", "HD output up to 5000px", "Priority model loading", "Email support"],
    cta: "Go Pro",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "API",
    price: "$49",
    period: "/ month",
    desc: "For developers and businesses.",
    features: ["10,000 API calls", "REST API access", "Webhook notifications", "99.5% SLA", "Priority support"],
    cta: "Get API key",
    variant: "glow" as const,
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 md:py-32 relative">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="text-sm font-medium text-secondary mb-3">Pricing</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Simple plans that <span className="gradient-text">scale with you</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative glass-card rounded-2xl p-8 flex flex-col ${
                t.popular ? "border-primary/50 shadow-glow-primary" : ""
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-brand text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <div className="font-display text-xl font-semibold">{t.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{t.price}</span>
                <span className="text-muted-foreground text-sm">{t.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{t.desc}</p>

              <ul className="mt-6 space-y-3 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button variant={t.variant} size="lg" className="mt-8 w-full" asChild>
                <a href="#workspace">{t.cta}</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
