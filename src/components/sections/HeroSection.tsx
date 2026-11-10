import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, ChevronDown, Github, Linkedin, MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroCapsuleCanvas } from '../canvas/HeroCapsuleCanvas';
import { scrollToSection } from '../../utils/scroll';
import { PROFILE } from '../../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onContactClick?: () => void;
  isReady?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onContactClick, isReady = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const phraseRef = useRef<HTMLDivElement>(null);
  const bottomContentRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(tagRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.8,
      })
      .from(titleRef.current, {
        scale: 0.94,
        opacity: 0,
        y: 40,
        duration: 1.1,
      }, '-=0.5')
      .from(phraseRef.current?.children || [], {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
      }, '-=0.7')
      .from(bottomContentRef.current?.children || [], {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
      }, '-=0.6');

      // Scroll-linked exit transformations on outer wrapper (avoids tween collision with title entrance)
      if (titleWrapperRef.current) {
        gsap.to(titleWrapperRef.current, {
          y: -140,
          scale: 0.94,
          opacity: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#F20D16] text-white flex flex-col justify-between overflow-hidden pt-24 sm:pt-28 pb-6 select-none"
    >
      {/* Background Dark Ribbon Stroke that wraps behind the 3D capsule */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover opacity-95"
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
      <div ref={tagRef} className="relative z-20 w-full px-6 sm:px-10 md:px-14 flex items-center justify-between text-xs font-tech text-white/80">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="uppercase tracking-widest font-semibold">{PROFILE.primaryTitle}</span>
          <span className="text-white/40">•</span>
          <span className="hidden sm:inline uppercase tracking-widest text-white/70">{PROFILE.secondaryTitle}</span>
        </div>

        <div className="flex items-center gap-2 text-white/90">
          <MapPin className="w-3.5 h-3.5 text-white/80" />
          <span className="tracking-widest uppercase font-semibold">{PROFILE.location}</span>
        </div>
      </div>

      {/* Massive Bold Headline: MRH RAFI across center */}
      <div ref={titleWrapperRef} className="relative z-10 w-full px-4 sm:px-8 md:px-12 my-auto flex flex-col items-center justify-center">
        <h1
          ref={titleRef}
          className="font-display font-black text-[19vw] sm:text-[18vw] md:text-[17vw] lg:text-[16vw] leading-[0.8] tracking-tighter text-[#080713] text-center uppercase select-none drop-shadow-sm transition-transform"
        >
          MRH RAFI
        </h1>

        {/* 3D Floating Chrome Capsule Mascot overlaying the center with turbine and glass */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20">
          <div className="w-[90vw] max-w-[720px] h-[380px] sm:h-[460px] md:h-[560px]">
            <HeroCapsuleCanvas interactive={true} />
          </div>
        </div>
      </div>

      {/* Bottom Information Row */}
      <div
        ref={bottomContentRef}
        className="relative z-20 w-full px-6 sm:px-10 md:px-14 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mt-4 sm:mt-8"
      >
        {/* Left Column: Editorial Highlight */}
        <div ref={phraseRef} className="flex flex-col max-w-xl">
          <div className="flex items-center gap-2 text-xs font-tech tracking-wider uppercase text-white/80 mb-2">
            <span>// PORTFOLIO 2026</span>
            <span className="text-white/40">/</span>
            <span>MOBILE ARCHITECTURE</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[2.8rem] text-white leading-[1.05] tracking-tight">
            Designing mobile experiences.
          </h2>
          <h2 className="font-serif-italic font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] text-white/95 leading-[1.05] mt-0.5">
            Engineering native performance.
          </h2>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-[11px] sm:text-xs font-tech tracking-wider uppercase text-white/85">
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20">FLUTTER &bull; DART</span>
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20">C++ FOUNDATION</span>
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20">60FPS GESTURES</span>
          </div>
        </div>

        {/* Right Column: Statement, Social, CTA & Scroll Link */}
        <div className="flex flex-col items-start lg:items-end max-w-md text-left lg:text-right">
          <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed font-medium">
            "{PROFILE.positioning}"
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button
              onClick={() => scrollToSection('#work')}
              className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white text-[#080713] font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#080713] hover:text-white transition-all duration-300 shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              <span>Explore Projects</span>
              <div className="w-6 h-6 rounded-full bg-[#080713] text-white group-hover:bg-white group-hover:text-[#080713] flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={onContactClick || (() => scrollToSection('#contact'))}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:text-[#080713] transition-colors py-2 px-3"
            >
              <span>Get In Touch</span>
              <span>&gt;</span>
            </button>

            {/* Direct Social Shortcuts */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/20">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#080713] flex items-center justify-center transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#080713] flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div
            onClick={() => scrollToSection('#about')}
            className="flex items-center gap-2 mt-5 text-xs font-tech text-white/70 tracking-widest uppercase cursor-pointer hover:text-white transition-colors"
          >
            <span>Scroll to explore</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Marquee Ticker at the base of Hero */}
      <div className="w-full mt-6 py-2.5 border-t border-b border-black/15 bg-black/10 overflow-hidden flex whitespace-nowrap">
        <div className="flex animate-marquee gap-8 items-center text-xs font-tech uppercase tracking-widest text-black/85">
          <span>✦ FLUTTER ARCHITECTURE</span>
          <span>✦ NATIVE C++ ENGINES</span>
          <span>✦ HIGH-PERFORMANCE MOBILE UI</span>
          <span>✦ DART EXPERTISE</span>
          <span>✦ TACTILE MICRO-INTERACTIONS</span>
          <span>✦ DHAKA, BANGLADESH</span>
          <span>✦ FLUTTER ARCHITECTURE</span>
          <span>✦ NATIVE C++ ENGINES</span>
          <span>✦ HIGH-PERFORMANCE MOBILE UI</span>
          <span>✦ DART EXPERTISE</span>
          <span>✦ TACTILE MICRO-INTERACTIONS</span>
          <span>✦ DHAKA, BANGLADESH</span>
        </div>
      </div>
    </section>
  );
};
