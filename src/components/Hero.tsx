import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import logo from "@/assets/logo.png";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-primary/20 blur-[140px] pointer-events-none animate-glow-pulse" aria-hidden />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
            Powered by on-device AI · No upload required
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-balance leading-[1.05]">
            Remove backgrounds <br className="hidden sm:block" />
            in <span className="gradient-text">one click.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            SnapCut AI uses a neural model that runs right in your browser. Drag, drop,
            and download a clean transparent PNG in seconds — your image never leaves your device.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="hero" size="xl" asChild>
              <a href="#workspace">
                <Sparkles className="h-5 w-5" />
                Remove a background
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="glow" size="xl" asChild>
              <a href="#pricing">View pricing</a>
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-secondary" /> Avg. 4s processing</div>
            <div className="hidden sm:flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-muted-foreground/50" /></div>
            <div>100% private</div>
            <div className="hidden sm:flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-muted-foreground/50" /></div>
            <div>No watermark</div>
          </div>
        </div>

        {/* Logo orbit */}
        <div className="relative mt-20 mx-auto max-w-4xl">
          <div className="glass-card rounded-3xl p-8 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-brand-soft opacity-60" aria-hidden />
            <div className="relative flex flex-col md:flex-row items-center justify-around gap-10">
              <div className="flex flex-col items-center gap-3">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Before</div>
                <div className="h-40 w-40 rounded-2xl bg-gradient-to-br from-primary/40 to-accent/40 grid place-items-center shadow-glow-primary">
                  <img src={logo} alt="" className="h-28 w-28 rounded-xl" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Sparkles className="h-8 w-8 text-secondary animate-pulse" />
                <div className="text-xs text-muted-foreground">SnapCut AI</div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">After</div>
                <div
                  className="h-40 w-40 rounded-2xl grid place-items-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)",
                    backgroundSize: "16px 16px",
                    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
                  }}
                >
                  <img src={logo} alt="" className="h-28 w-28 animate-float" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
