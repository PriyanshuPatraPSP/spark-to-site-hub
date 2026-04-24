import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Workspace } from "@/components/Workspace";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Workspace />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
