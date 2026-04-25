import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.location.replace("/coffee/");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-3">
        <p className="text-2xl font-bold">☕ The Coffee Hub</p>
        <p className="text-muted-foreground">Loading the menu…</p>
        <a href="/coffee/" className="underline text-primary">Tap here if not redirected</a>
      </div>
    </div>
  );
};

export default Index;
