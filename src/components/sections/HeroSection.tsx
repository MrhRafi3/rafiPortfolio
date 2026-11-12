import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, ChevronDown, Github, Linkedin, MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import { HeroLaptopCanvas } from '../canvas/HeroLaptopCanvas';
import { scrollToSection } from '../../utils/scroll';
import { PROFILE } from '../../data/portfolioData';

interface HeroSectionProps {
  onContactClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onContactClick }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (contentRef.current) {
        tl.from(contentRef.current.children, {
          y: 26,
          opacity: 0,
          stagger: 0.08,
          duration: 0.75,
        });
      }
      if (mediaRef.current) {
        tl.from(
          mediaRef.current,
          {
            scale: 0.96,
            opacity: 0,
            duration: 0.85,
          },
          '-=0.55'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100svh] lg:h-screen w-full bg-[#F20D16] text-white flex flex-col justify-between overflow-hidden pt-20 sm:pt-24 pb-5 sm:pb-6 px-6 sm:px-10 md:px-14 select-none"
    >
      {/* Subtle Background Editorial Curve */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover opacity-75"
          preserveAspectRatio="none"
        >
          <path
            d="M -100 540 C 240 660, 420 260, 820 340 C 1180 410, 1320 780, 1580 580"
            stroke="#080713"
            strokeWidth="120"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Main Balanced Hero Composition */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex items-center py-2 sm:py-4">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Unobstructed Editorial Typography */}
          <div ref={contentRef} className="lg:col-span-7 flex flex-col items-start min-w-0">
            <div className="flex items-center gap-3 text-xs font-tech tracking-widest uppercase text-white/90 mb-3">
              <span>{PROFILE.primaryTitle}</span>
              <span className="text-white/40">•</span>
              <span className="inline-flex items-center gap-1.5 text-white/85">
                <MapPin className="w-3.5 h-3.5" />
                {PROFILE.location}
              </span>
            </div>

            <h1 className="font-display font-black text-[clamp(3.25rem,8.4vw,7.4rem)] leading-[0.88] tracking-tighter text-[#F1EBDD] uppercase drop-shadow-[0_12px_28px_rgba(8,7,19,0.28)]">
              {PROFILE.name}
            </h1>

            <div className="mt-4 sm:mt-6 flex flex-col">
              <h2 className="font-display font-extrabold text-[clamp(1.35rem,2.7vw,2.45rem)] text-white leading-[1.06] tracking-tight">
                Designing mobile experiences.
              </h2>
              <p className="font-serif-italic font-normal text-[clamp(1.65rem,3.3vw,3rem)] text-[#F1EBDD] leading-[1.02] mt-0.5">
                Engineering native performance.
              </p>
            </div>

            <p className="mt-4 text-sm sm:text-base text-white/90 leading-relaxed max-w-lg font-medium">
              {PROFILE.positioning}
            </p>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center gap-3.5 mt-6">
              <button
                onClick={() => scrollToSection('#work')}
                className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#F1EBDD] text-[#080713] font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#080713] hover:text-white transition-colors duration-300 shadow-xl"
              >
                <span>Explore Projects</span>
                <span className="w-6 h-6 rounded-full bg-[#080713] text-white group-hover:bg-white group-hover:text-[#080713] flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </button>

              <button
                onClick={onContactClick || (() => scrollToSection('#contact'))}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:text-[#080713] hover:bg-white transition-colors py-3 px-5 rounded-full border border-white/35"
              >
                <span>Get In Touch</span>
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-white/25">
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="w-9 h-9 rounded-full bg-black/20 hover:bg-[#080713] text-white flex items-center justify-center transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="w-9 h-9 rounded-full bg-black/20 hover:bg-[#080713] text-white flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Dedicated Unobstructed 3D MacBook Stage */}
          <div ref={mediaRef} className="lg:col-span-5 flex items-center justify-center w-full">
            <div className="w-full max-w-[540px] h-[250px] sm:h-[330px] md:h-[380px] lg:h-[430px] xl:h-[490px] max-h-[58vh]">
              <HeroLaptopCanvas interactive={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Bottom Anchor */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-3 border-t border-white/20 flex items-center justify-between text-xs font-tech text-white/85">
        <span className="tracking-wider uppercase">Flutter · Dart · C++</span>
        <button
          onClick={() => scrollToSection('#about')}
          className="inline-flex items-center gap-1.5 tracking-widest uppercase hover:text-white transition-colors"
        >
          <span>Scroll</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
