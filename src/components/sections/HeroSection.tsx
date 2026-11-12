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
  const tagRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const bottomContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (tagRef.current) {
        tl.from(tagRef.current, { y: -14, opacity: 0, duration: 0.55 });
      }
      if (titleRef.current) {
        tl.from(
          titleRef.current,
          { scale: 0.95, y: 24, opacity: 0, duration: 0.85 },
          '-=0.35'
        );
      }
      if (mediaRef.current) {
        tl.from(
          mediaRef.current,
          { scale: 0.95, opacity: 0, duration: 0.75 },
          '-=0.6'
        );
      }
      if (bottomContentRef.current) {
        tl.from(
          bottomContentRef.current.children,
          { y: 18, opacity: 0, stagger: 0.08, duration: 0.6 },
          '-=0.45'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100svh] lg:h-screen w-full bg-[#F20D16] text-white flex flex-col justify-between overflow-hidden pt-20 sm:pt-24 pb-4 sm:pb-5 select-none"
    >
      {/* Background Dark Ribbon Stroke passing behind the background typography & MacBook */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover opacity-80"
          preserveAspectRatio="none"
        >
          <path
            d="M -100 480 C 200 620, 320 220, 720 320 C 1120 420, 1280 820, 1600 620"
            stroke="#080713"
            strokeWidth="140"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Top Metadata Header */}
      <div
        ref={tagRef}
        className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 flex items-center justify-between text-xs font-tech text-white/90 shrink-0"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span className="uppercase tracking-widest font-semibold">{PROFILE.primaryTitle}</span>
        </div>

        <div className="flex items-center gap-2 text-white/90">
          <MapPin className="w-3.5 h-3.5 text-white/85" />
          <span className="tracking-widest uppercase font-semibold">{PROFILE.location}</span>
        </div>
      </div>

      {/* Center Stage: Oversized Background Typography + Centered Prominent MacBook Pro */}
      <div className="relative z-10 w-full flex-1 min-h-[300px] sm:min-h-0 px-3 sm:px-8 md:px-12 my-auto flex flex-col items-center justify-center">
        <h1
          ref={titleRef}
          className="font-display font-black text-[clamp(2.35rem,11.6vw,14.5rem)] lg:text-[min(12.1vw,22vh)] leading-[0.82] tracking-tighter text-[#F1EBDD] text-center uppercase select-none drop-shadow-[0_15px_35px_rgba(8,7,19,0.35)] whitespace-nowrap pointer-events-none -translate-y-6 sm:translate-y-0"
        >
          {PROFILE.name}
        </h1>

        {/* Centered Large 3D MacBook overlapping MRH RAFI */}
        <div
          ref={mediaRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20 translate-y-[3%]"
        >
          <div className="w-[94vw] max-w-[820px] h-[280px] sm:h-[380px] md:h-[430px] lg:h-[min(480px,54vh)] xl:h-[min(540px,56vh)]">
            <HeroLaptopCanvas interactive={true} />
          </div>
        </div>
      </div>

      {/* Bottom Secondary Editorial Copy & Actions */}
      <div
        ref={bottomContentRef}
        className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 lg:gap-8 shrink-0"
      >
        {/* Left: Editorial Tagline */}
        <div className="flex flex-col max-w-xl">
          <h2 className="font-display font-extrabold text-[clamp(1.35rem,2.4vw,2.2rem)] text-white leading-[1.06] tracking-tight">
            Designing mobile experiences.
          </h2>
          <p className="font-serif-italic font-normal text-[clamp(1.55rem,2.8vw,2.6rem)] text-[#F1EBDD] leading-[1.02] mt-0.5">
            Engineering native performance.
          </p>
          <span className="mt-2 font-tech text-[11px] uppercase tracking-widest text-white/80">
            Flutter · Dart · C++
          </span>
        </div>

        {/* Right: Supporting Statement, CTAs & Scroll Anchor */}
        <div className="flex flex-col items-start lg:items-end max-w-md text-left lg:text-right">
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
            {PROFILE.positioning}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-3.5">
            <button
              onClick={() => scrollToSection('#work')}
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#F1EBDD] text-[#080713] font-bold text-xs uppercase tracking-wider hover:bg-[#080713] hover:text-white transition-colors duration-300 shadow-xl"
            >
              <span>Explore Projects</span>
              <span className="w-5 h-5 rounded-full bg-[#080713] text-white group-hover:bg-white group-hover:text-[#080713] flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </button>

            <button
              onClick={onContactClick || (() => scrollToSection('#contact'))}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-[#080713] hover:bg-white transition-colors py-2.5 px-4 rounded-full border border-white/35"
            >
              <span>Get In Touch</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-white/25">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-[#080713] text-white flex items-center justify-center transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-[#080713] text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>

            <button
              onClick={() => scrollToSection('#about')}
              className="hidden sm:inline-flex items-center gap-1 ml-1 text-[11px] font-tech text-white/80 tracking-widest uppercase hover:text-white transition-colors"
              aria-label="Scroll to About"
            >
              <span>Scroll</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
