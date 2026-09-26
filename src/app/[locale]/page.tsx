import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { Comparison } from "@/components/landing/comparison";
import { UseCases } from "@/components/landing/use-cases";
import { Footer } from "@/components/landing/footer";
export default function LandingPage() {
  return (
    <div className="max-w-[680px] mx-auto">
      <Nav />
      <Hero />
      <div className="h-[0.5px] mx-8" style={{ background: "rgba(255,255,255,0.06)" }} />
      <FeaturesGrid />
      <div className="h-[0.5px] mx-8" style={{ background: "rgba(255,255,255,0.06)" }} />
      <Comparison />
      <div className="h-[0.5px] mx-8" style={{ background: "rgba(255,255,255,0.06)" }} />
      <UseCases />
      <Footer />
    </div>
  );
}
