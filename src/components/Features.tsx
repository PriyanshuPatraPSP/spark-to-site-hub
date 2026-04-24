import { Cpu, Lock, Sparkles, Image as ImageIcon, Layers, Zap } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "On-device AI",
    desc: "RMBG neural model runs in your browser via WebGPU — no servers, no waiting in queues.",
  },
  {
    icon: Lock,
    title: "Truly private",
    desc: "Your images never leave your device. Zero uploads, zero tracking, zero storage.",
  },
  {
    icon: Zap,
    title: "Lightning fast",
    desc: "Average processing time under 5 seconds, even on mid-range laptops.",
  },
  {
    icon: ImageIcon,
    title: "Pixel-precise edges",
    desc: "Hair, fur, transparent fabrics — handled cleanly with no halos or fringe.",
  },
  {
    icon: Layers,
    title: "Transparent PNG",
    desc: "Export ready-to-use PNGs with full alpha channel for any design workflow.",
  },
  {
    icon: Sparkles,
    title: "Batch ready",
    desc: "Drop multiple images and process them in sequence — perfect for product catalogs.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div className="container">
        <div className="max-w-2xl mb-16">
          <div className="text-sm font-medium text-secondary mb-3">Why SnapCut</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-balance">
            The fastest way to <span className="gradient-text">cut out anything</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-card rounded-2xl p-6 group hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-brand-soft border border-border grid place-items-center mb-5 group-hover:shadow-glow-primary transition-shadow">
                <f.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
