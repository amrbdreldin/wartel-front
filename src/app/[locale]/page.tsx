import { AboutSection } from "@/components/landing/AboutSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { ProgramsSection } from "@/components/landing/ProgramsSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { AchievementsSection } from "@/components/landing/AchievementsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TimelineSection } from "@/components/landing/TimelineSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col selection:bg-primary selection:text-primary-foreground selection:bg-opacity-90">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <TimelineSection />
        <ProgramsSection />
        <StatsSection />
        <AchievementsSection />
        <TestimonialsSection />
        <CtaSection />
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  );
}
