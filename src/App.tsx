import React, { useEffect, useState } from 'react';
import { initSmoothScroll, destroySmoothScroll, refreshScrollTriggers } from './utils/scroll';
import { Navbar } from './components/common/Navbar';
import { AnimatedCursor } from './components/common/AnimatedCursor';
import { Preloader } from './components/common/Preloader';
import { ContinuousSnakeLine } from './components/common/ContinuousSnakeLine';
import { HeroSection } from './components/sections/HeroSection';
import { IntermediateBand } from './components/sections/IntermediateBand';
import { AboutMeSection } from './components/sections/AboutMeSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { HorizontalProjectGallery } from './components/sections/HorizontalProjectGallery';
import { WorkflowSection } from './components/sections/WorkflowSection';
import { TechnicalDeepDiveSection } from './components/sections/TechnicalDeepDiveSection';
import { Interactive3DPhoneSection } from './components/sections/Interactive3DPhoneSection';
import { ContactFooterSection } from './components/sections/ContactFooterSection';

export const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize Lenis Smooth Scroll linked to GSAP ScrollTrigger
    initSmoothScroll();

    // Listen for font loading completion to accurately refresh ScrollTriggers
    if (document.fonts) {
      document.fonts.ready.then(() => {
        refreshScrollTriggers();
      });
    }

    return () => {
      destroySmoothScroll();
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      // Refresh ScrollTrigger after preloader finishes and dismisses
      const timer = setTimeout(() => {
        refreshScrollTriggers();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  return (
    <div className="relative min-h-screen w-full bg-[#080713] text-white selection:bg-[#F20D16] selection:text-white">
      {/* Custom Preloader */}
      <Preloader onLoaded={() => setIsReady(true)} />

      {/* Subtle Analog Film Grain Overlay */}
      <div className="grain-overlay" />

      {/* Interactive Fluid Cursor (Desktop Only) */}
      <AnimatedCursor />

      {/* Global Top Navbar */}
      <Navbar />

      {/* Main Content Flow */}
      <main className="relative w-full">
        {/* ONE Continuous Organic Red Snake Line Flowing Throughout the Entire Website */}
        <ContinuousSnakeLine />

        {/* 01. HERO (Primary Red, MRH RAFI, 3D Capsule, Editorial Italic) */}
        <HeroSection />

        {/* Transitional Intermediate Dark Band (Mobile UI ✦ Native C++ Integration) */}
        <IntermediateBand />

        {/* 02. ABOUT ME (Warm Cream, Designing Experiences. Engineering Mobile Apps., DevTools Inspector) */}
        <AboutMeSection />

        {/* 03. TECHNICAL SKILLS (Dark Navy, Primary Stack, Systems Foundation, Architecture, Tooling) */}
        <SkillsSection />

        {/* 04. HORIZONTAL PROJECT SHOWCASE (Warm Cream, Pinned Scroll, Clocky, Expify, NomNom, Alchemy, Aevique) */}
        <HorizontalProjectGallery />

        {/* 05. DEVELOPER WORKFLOW / HOW I BUILD (01 Discover, 02 Design, 03 Develop, 04 Engineer, 05 Refine) */}
        <WorkflowSection />

        {/* 06. TECHNICAL DEEP DIVE (C++ Native Engine, Clocky Timing, Expify Offline-First SQLite) */}
        <TechnicalDeepDiveSection />

        {/* 07. INTERACTIVE 3D EXPERIENCE (3D Smartphone with Live Project Texture Projection) */}
        <Interactive3DPhoneSection />

        {/* 08. CONTACT / FOOTER (Dark/Red Editorial Finish, Copy Email, GitHub, LinkedIn, Dhaka Time) */}
        <ContactFooterSection />
      </main>
    </div>
  );
};

export default App;
