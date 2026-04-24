import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="border-t border-border/40 mt-24">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="SnapCut AI" className="h-9 w-9 rounded-lg" />
              <span className="font-display text-lg font-bold">
                SnapCut <span className="gradient-text">AI</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Remove image backgrounds in one click. Powered by on-device AI.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold mb-3">Product</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
              <li><a href="#workspace" className="hover:text-foreground">Try free</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold mb-3">Company</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms</a></li>
              <li><a href="#" className="hover:text-foreground">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/40 text-xs text-muted-foreground flex justify-between items-center">
          <div>© {new Date().getFullYear()} SnapCut AI. All rights reserved.</div>
          <div>Made with neural nets ✨</div>
        </div>
      </div>
    </footer>
  );
};
