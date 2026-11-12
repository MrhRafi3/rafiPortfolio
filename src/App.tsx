import React, { useEffect } from 'react';
import { initSmoothScroll, destroySmoothScroll, refreshScrollTriggers } from './utils/scroll';
import { Navbar } from './components/common/Navbar';
import { AnimatedCursor } from './components/common/AnimatedCursor';
import { ContinuousSnakeLine } from './components/common/ContinuousSnakeLine';
import { SectionTransitionStreak } from './components/common/SectionTransitionStreak';
import { HeroSection } from './components/sections/HeroSection';
import { AboutMeSection } from './components/sections/AboutMeSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { HorizontalProjectGallery } from './components/sections/HorizontalProjectGallery';
import { WorkflowSection } from './components/sections/WorkflowSection';
import { TechnicalDeepDiveSection } from './components/sections/TechnicalDeepDiveSection';
import { ContactFooterSection } from './components/sections/ContactFooterSection';

export const App: React.FC = () => {
  useEffect(() => {
    initSmoothScroll();

    if (document.fonts) {
      document.fonts.ready.then(() => {
        refreshScrollTriggers();
      });
    }

    return () => {
      destroySmoothScroll();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#080713] text-white selection:bg-[#F20D16] selection:text-white">
      <div className="grain-overlay" />
      <AnimatedCursor />
      <SectionTransitionStreak />
      <Navbar />

      <main className="relative w-full">
        <ContinuousSnakeLine />
        <HeroSection />
        <AboutMeSection />
        <SkillsSection />
        <HorizontalProjectGallery />
        <WorkflowSection />
        <TechnicalDeepDiveSection />
        <ContactFooterSection />
      </main>
    </div>
  );
};

export default App;
