import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROFILE } from '../../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

export const AboutMeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        gsap.from(headlineRef.current.children, {
          y: 16,
          stagger: 0.08,
          duration: 0.45,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (specsRef.current) {
        gsap.from(specsRef.current.children, {
          y: 14,
          stagger: 0.05,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: specsRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-[100svh] lg:h-screen w-full bg-[#F1EBDD] text-[#080713] py-20 lg:py-24 px-6 sm:px-10 md:px-14 flex flex-col justify-between overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between relative z-20">
        {/* Minimal Section Header */}
        <div className="flex items-center justify-between border-b border-[#080713]/15 pb-3.5">
          <span className="font-tech text-xs font-bold tracking-widest uppercase text-[#F20D16]">
            01 — About
          </span>
          <span className="font-tech text-xs tracking-wider text-[#080713]/60 uppercase">
            {PROFILE.location}
          </span>
        </div>

        {/* Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center my-auto py-6">
          {/* Left: Oversized Typography + Bio */}
          <div ref={headlineRef} className="lg:col-span-7 min-w-0 flex flex-col">
            <h2 className="font-display font-black text-[clamp(1.95rem,4.1vw,3.75rem)] tracking-tight text-[#080713] leading-[0.92] uppercase">
              Designing Experiences.
            </h2>
            <p className="font-serif-italic font-normal text-[clamp(2.25rem,4.7vw,4.5rem)] text-[#F20D16] leading-[0.9] tracking-tight mt-1">
              Engineering mobile apps.
            </p>

            <div className="flex flex-col gap-4 mt-7 max-w-2xl text-sm sm:text-base md:text-[1.06rem] text-[#080713]/85 leading-relaxed">
              {PROFILE.biography.map((paragraph, idx) => (
                <p key={idx} className="font-medium">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Right: Clean Typographic Spec Ledger */}
          <div ref={specsRef} className="lg:col-span-5 flex flex-col border-t border-[#080713]/15">
            {PROFILE.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-baseline justify-between gap-4 py-3.5 sm:py-4 border-b border-[#080713]/15"
              >
                <span className="font-tech text-xs uppercase tracking-widest text-[#080713]/55 shrink-0">
                  {spec.label}
                </span>
                <span className="font-display font-bold text-sm sm:text-base md:text-lg text-[#080713] text-right">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Subtle Line */}
        <div className="pt-3 border-t border-[#080713]/15 flex items-center justify-between text-xs font-tech text-[#080713]/55">
          <span>60–120 FPS Frame Discipline</span>
          <span>5 Shipped Case Studies</span>
        </div>
      </div>
    </section>
  );
};
