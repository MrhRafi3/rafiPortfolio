import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SKILL_CATEGORIES } from '../../data/portfolioData';
import { Layers, Cpu, Database, Wrench, Check } from 'lucide-react';
import { KeyboardCanvas } from '../canvas/KeyboardCanvas';
import { Lazy3DViewport } from '../canvas/Lazy3DViewport';

gsap.registerPlugin(ScrollTrigger);

export const SkillsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  const getIcon = (id: string) => {
    switch (id) {
      case 'primary':
        return <Layers className="w-4 h-4" />;
      case 'foundation':
        return <Cpu className="w-4 h-4" />;
      case 'architecture':
        return <Database className="w-4 h-4" />;
      case 'workflow':
        return <Wrench className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentCategory = SKILL_CATEGORIES[activeTab];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full bg-[#080713] text-white py-24 md:py-32 px-6 sm:px-10 md:px-16 overflow-hidden select-none border-t border-white/5"
    >
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#F20D16]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Tag */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-14">
          <div className="flex items-center gap-4">
            <span className="font-tech text-xs md:text-sm font-bold tracking-widest uppercase text-[#F20D16]">
              02 / TECHNICAL SKILLS
            </span>
            <span className="text-white/20">•</span>
            <span className="font-tech text-xs tracking-wider text-white/50 uppercase">
              CAPABILITIES &bull; FOUNDATION
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-tech text-white/50">
            <span>MEASURED CAPABILITY &bull; PRODUCTION CODE</span>
          </div>
        </div>

        {/* Title & 3D Mechanical Keyboard Integration */}
        <div ref={headingRef} className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-14">
          <div className="max-w-3xl">
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white leading-[0.95] uppercase">
              Technical Stack &amp;
              <br />
              <span className="text-[#F20D16] font-serif-italic capitalize font-normal">
                Systems Foundation
              </span>
            </h2>
            <p className="mt-6 text-sm sm:text-base md:text-lg text-white/70 max-w-2xl leading-relaxed">
              Every listed skill is actively exercised in production-grade Flutter code, native C++ pipelines, or verified mobile applications.
            </p>
          </div>

          {/* Supporting 3D Mechanical Keyboard */}
          <div className="w-full lg:w-[380px] xl:w-[440px] h-[220px] sm:h-[260px] shrink-0 self-center lg:self-end">
            <Lazy3DViewport
              rootMargin="300px"
              fallback={
                <div className="w-full h-full rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center gap-2 font-tech text-xs text-white/50">
                  <span className="w-2 h-2 rounded-full bg-[#F20D16] animate-pulse" />
                  <span>MECHANICAL KEYBOARD // ISOMETRIC VIEW</span>
                </div>
              }
            >
              <KeyboardCanvas />
            </Lazy3DViewport>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 border-b border-white/10 mb-10 no-scrollbar">
          {SKILL_CATEGORIES.map((cat, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(idx)}
                className={`group flex items-center gap-2.5 px-5 py-3 rounded-full font-tech text-xs uppercase tracking-wider transition-all duration-300 whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#F20D16] text-white border-[#F20D16] font-bold shadow-[0_0_20px_rgba(242,13,22,0.4)]'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/10 hover:text-white'
                }`}
              >
                {getIcon(cat.id)}
                <span>{cat.name}</span>
                {cat.id === 'primary' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Category Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Headline */}
          <div className="lg:col-span-4 flex flex-col">
            <span className="font-tech text-xs uppercase tracking-widest text-[#F20D16] font-bold mb-2">
              DISCIPLINE SPOTLIGHT
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-4">
              {currentCategory.headline}
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Focused on crafting production-ready mobile systems, respecting device thermal constraints, and eliminating touch latency.
            </p>

            <div className="mt-8 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="font-tech text-[10px] text-white/40 uppercase tracking-widest block mb-2">
                VERIFICATION METRIC
              </span>
              <div className="flex items-center gap-2 text-white font-tech text-sm">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zero dropped frames in touch tests</span>
              </div>
              <div className="flex items-center gap-2 text-white font-tech text-sm mt-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Hardware memory profiling via DevTools</span>
              </div>
            </div>
          </div>

          {/* Right Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentCategory.skills.map((skill) => (
              <div
                key={skill.name}
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between group ${
                  skill.isPrimary
                    ? 'bg-white/[0.05] border-[#F20D16]/50 hover:border-[#F20D16] hover:bg-white/[0.08]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h4 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-[#F20D16] transition-colors">
                    {skill.name}
                  </h4>
                  {skill.tag && (
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 font-tech text-[10px] uppercase tracking-wider shrink-0">
                      {skill.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
