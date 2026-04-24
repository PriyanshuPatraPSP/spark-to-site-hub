import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={logo} alt="SnapCut AI logo" className="h-9 w-9 rounded-lg transition-transform group-hover:scale-110" />
          <span className="font-display text-lg font-bold tracking-tight">
            SnapCut <span className="gradient-text">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <a href="#workspace">Sign in</a>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <a href="#workspace">
              <Sparkles className="h-4 w-4" />
              Try free
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};
