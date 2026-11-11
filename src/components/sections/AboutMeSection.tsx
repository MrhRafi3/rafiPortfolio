import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROFILE } from '../../data/portfolioData';
import { Smartphone, Cpu, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const AboutMeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inspectorRef = useRef<HTMLDivElement>(null);
  const [highRefreshRate, setHighRefreshRate] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { scale: 0.92, y: 30 },
        {
          scale: 1.02,
          y: -10,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'center 40%',
            scrub: 1,
          },
        }
      );

      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          y: 35,
          opacity: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        });
      }

      if (inspectorRef.current) {
        gsap.from(inspectorRef.current, {
          x: 50,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: inspectorRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
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
      className="relative min-h-screen w-full bg-[#F1EBDD] text-[#080713] py-24 md:py-32 px-6 sm:px-10 md:px-16 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto relative z-20">
        {/* Top Section Header */}
        <div className="flex items-center justify-between border-b border-[#080713]/10 pb-4 mb-14">
          <div className="flex items-center gap-4">
            <span className="font-tech text-xs md:text-sm font-bold tracking-widest uppercase text-[#F20D16]">
              01 / ABOUT ME
            </span>
            <span className="text-[#080713]/30">•</span>
            <span className="font-tech text-xs tracking-wider text-[#080713]/60 uppercase">
              ENGINEERING PHILOSOPHY &bull; DHAKA, BD
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-tech text-[#080713]/70">
            <span className="w-2 h-2 rounded-full bg-[#F20D16] animate-pulse" />
            <span>FLUTTER &bull; DART &bull; C++</span>
          </div>
        </div>

        {/* Main Composition: Left Editorial + Right Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left 8 Cols: Giant Headline & Bio */}
          <div className="lg:col-span-8 flex flex-col">
            <div ref={headlineRef} className="origin-left flex flex-col">
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-[#080713] leading-[0.95]">
                DESIGNING EXPERIENCES.
              </h2>
              <div className="mt-2">
                <span className="font-serif-italic font-normal text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F20D16] leading-[0.9] tracking-tight">
                  Engineering mobile applications.
                </span>
              </div>
            </div>

            {/* Editorial Paragraphs */}
            <div ref={contentRef} className="flex flex-col gap-5 mt-10 max-w-2xl text-sm sm:text-base md:text-lg text-[#080713]/85 leading-relaxed font-normal">
              {PROFILE.biography.map((paragraph, index) => (
                <p key={index} className="font-medium">
                  {paragraph}
                </p>
              ))}

              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#080713]/10">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-[#080713]/10 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#F20D16]/10 text-[#F20D16] flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-sm text-[#080713]">Touch Ergonomics</span>
                    <span className="text-xs text-[#080713]/70 mt-0.5">Designed specifically for the thumb zone and real hand postures.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-[#080713]/10 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#080713]/10 text-[#080713] flex items-center justify-center shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-sm text-[#080713]">C++ Native Engine</span>
                    <span className="text-xs text-[#080713]/70 mt-0.5">Direct C ABI bridges and strided buffers for high-compute tasks.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-[#080713]/10 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#080713]/10 text-[#080713] flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-sm text-[#080713]">Clean Architecture</span>
                    <span className="text-xs text-[#080713]/70 mt-0.5">Strict separation of presentation, domain entities, and data sources.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-[#080713]/10 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-sm text-[#080713]">60–120 FPS Target</span>
                    <span className="text-xs text-[#080713]/70 mt-0.5">Zero dropped frames on standard mobile hardware during gestures.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Flutter Mobile Architecture Inspector Panel */}
          <div
            ref={inspectorRef}
            className="lg:col-span-4 bg-white/95 border border-[#080713]/15 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-xs font-mono"
          >
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-[#080713]/10 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#F20D16]" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex items-center gap-2 font-tech text-[10px] text-[#080713]/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>FLUTTER DEVTOOLS &bull; LIVE</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[#080713]/50 uppercase tracking-widest text-[10px] font-bold">
              <span>DEVICE INSPECTOR</span>
              <span>DEV_TARGET // 2026</span>
            </div>

            {/* Architecture Properties */}
            <div className="flex flex-col gap-3 py-2 border-b border-[#080713]/10">
              <div className="flex items-center justify-between">
                <span className="text-[#080713]/60">Target Framework</span>
                <span className="font-bold text-[#080713]">Flutter 3.x (Dart 3.x)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#080713]/60">Core Foundation</span>
                <span className="font-bold text-[#F20D16]">C++ / Data Structures</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#080713]/60">State Management</span>
                <span className="font-bold text-[#080713]">Provider / Riverpod</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#080713]/60">Native Interop</span>
                <span className="font-bold text-[#080713]">Dart FFI / C ABI</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#080713]/60">Offline Storage</span>
                <span className="font-bold text-[#080713]">SQLite / SharedPreferences</span>
              </div>
            </div>

            {/* Frame Budget Indicator */}
            <div className="flex flex-col gap-2 py-2 border-b border-[#080713]/10">
              <div className="flex items-center justify-between">
                <span className="text-[#080713]/60">Frame Budget</span>
                <span className="font-bold text-emerald-700 font-tech">
                  {highRefreshRate ? '8.3ms (120Hz)' : '16.6ms (60Hz)'}
                </span>
              </div>
              <div className="w-full bg-[#080713]/5 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: highRefreshRate ? '90%' : '55%' }}
                />
              </div>
            </div>

            {/* Interactive Toggle */}
            <div className="flex items-center justify-between py-2">
              <div className="flex flex-col">
                <span className="text-[#080713]/80 font-bold">ProMotion Display Mode</span>
                <span className="text-[10px] text-[#080713]/50">Toggle 120Hz frame target</span>
              </div>
              <button
                onClick={() => setHighRefreshRate(!highRefreshRate)}
                className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                  highRefreshRate ? 'bg-[#F20D16]' : 'bg-[#080713]/20'
                }`}
                aria-label="Toggle refresh rate"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    highRefreshRate ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Verification Badge */}
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] leading-relaxed text-emerald-900 flex items-start gap-2 font-sans">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                "All showcased projects are built and verified with real code, real screenshots, and zero fabricated claims."
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
