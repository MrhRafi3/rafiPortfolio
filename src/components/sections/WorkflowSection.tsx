import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CheckCircle2, ChevronRight, Layers, Cpu, Smartphone, Rocket, Terminal } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal3DCanvas } from '../canvas/Terminal3DCanvas';
import { StopwatchCanvas } from '../canvas/StopwatchCanvas';
import { TabletCanvas } from '../canvas/TabletCanvas';
import { Rocket3DCanvas } from '../canvas/Rocket3DCanvas';
import { Lazy3DViewport } from '../canvas/Lazy3DViewport';
import { WORKFLOW_STAGES } from '../../data/portfolioData';
import { scrollToSection } from '../../utils/scroll';

gsap.registerPlugin(ScrollTrigger);

export const WorkflowSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      ...WORKFLOW_STAGES[0],
      id: 'stage-discover',
      bgClass: 'bg-[#F1EBDD]',
      textClass: 'text-[#080713]',
      numeralClass: 'text-[#F20D16]',
      visualType: 'stopwatch',
    },
    {
      ...WORKFLOW_STAGES[1],
      id: 'stage-design',
      bgClass: 'bg-[#080713]',
      textClass: 'text-white',
      numeralClass: 'text-[#F20D16]',
      visualType: 'tablet',
    },
    {
      ...WORKFLOW_STAGES[2],
      id: 'stage-develop',
      bgClass: 'bg-[#F20D16]',
      textClass: 'text-[#F1EBDD]',
      numeralClass: 'text-white/20',
      visualType: 'terminal',
    },
    {
      ...WORKFLOW_STAGES[3],
      id: 'stage-engineer',
      bgClass: 'bg-[#080713]',
      textClass: 'text-white',
      numeralClass: 'text-[#F20D16]',
      visualType: 'architecture',
    },
    {
      ...WORKFLOW_STAGES[4],
      id: 'stage-refine',
      bgClass: 'bg-[#F1EBDD]',
      textClass: 'text-[#080713]',
      numeralClass: 'text-[#F20D16]',
      visualType: 'rocket',
    },
  ];

  useEffect(() => {
    stages.forEach((stage, index) => {
      ScrollTrigger.create({
        trigger: `#${stage.id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveStage(index),
        onEnterBack: () => setActiveStage(index),
      });
    });
  }, []);

  return (
    <div id="process" ref={containerRef} className="relative w-full">
      {stages.map((stage, index) => {
        const isRedStage = stage.bgClass.includes('#F20D16');
        return (
        <section
          key={stage.id}
          id={stage.id}
          className={`relative min-h-screen w-full ${stage.bgClass} ${stage.textClass} py-20 md:py-28 px-6 sm:px-10 md:px-16 flex flex-col justify-between overflow-hidden select-none transition-colors duration-700`}
        >
          <div className="max-w-7xl mx-auto w-full relative z-20">
            {/* Top Stage Header */}
            <div className="flex items-center justify-between border-b border-current/15 pb-4 mb-10">
              <div className="flex items-center gap-4">
                <span className={`font-tech text-xs md:text-sm font-bold tracking-widest uppercase ${
                  isRedStage ? 'text-[#F1EBDD]' : 'text-[#F20D16]'
                }`}>
                  STAGE {stage.number} / 05
                </span>
                <span className="opacity-30">•</span>
                <span className="font-tech text-xs tracking-wider uppercase opacity-60">
                  DEVELOPMENT WORKFLOW &bull; HOW I BUILD
                </span>
              </div>

              <div className="font-tech text-xs tracking-wider uppercase opacity-60">
                DISCIPLINE // {stage.badge}
              </div>
            </div>

            {/* Main Stage Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[480px]">
              {/* Left Column: Stage Breakdown */}
              <div className="lg:col-span-6 flex flex-col z-20">
                <span className={`font-tech text-xs uppercase tracking-widest font-bold mb-2 ${
                  isRedStage ? 'text-white' : 'text-[#F20D16]'
                }`}>
                  // METHODOLOGY {stage.number}
                </span>
                <h3 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.92] mb-5 uppercase">
                  {stage.title}
                </h3>
                <p className="text-base sm:text-lg md:text-xl font-normal leading-relaxed opacity-90 max-w-lg mb-4">
                  {stage.summary}
                </p>
                <p className="text-xs sm:text-sm font-normal leading-relaxed opacity-75 max-w-lg mb-6">
                  {stage.details}
                </p>

                {/* Deliverables Checklist */}
                <div className="flex flex-col gap-2 pt-2 border-t border-current/15">
                  <span className="font-tech text-[10px] uppercase tracking-widest opacity-60 font-bold mb-1">
                    KEY EXECUTION DELIVERABLES:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {stage.deliverables.map((item, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2 text-xs font-medium">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                          isRedStage ? 'text-[#F1EBDD]' : 'text-[#F20D16]'
                        }`} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Giant Numeral + Specific 3D Object or Graphic */}
              <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px] md:min-h-[460px]">
                {/* Giant Numeral */}
                <span
                  className={`font-display font-black text-[36vw] lg:text-[20vw] leading-none select-none pointer-events-none absolute right-0 md:right-4 z-0 ${stage.numeralClass} opacity-80 drop-shadow-sm`}
                >
                  {stage.number}
                </span>

                {/* 3D Visual Content Layer */}
                <div className="relative z-10 w-full max-w-[480px] h-[340px] md:h-[420px]">
                  {stage.visualType === 'stopwatch' && (
                    <Lazy3DViewport
                      rootMargin="250px"
                      fallback={
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 font-tech text-xs opacity-60">
                          <span className="w-2 h-2 rounded-full bg-[#F20D16] animate-pulse" />
                          <span>60FPS CHRONOMETER // LOADING</span>
                        </div>
                      }
                    >
                      <div className="w-full h-full relative">
                        <StopwatchCanvas />
                      </div>
                    </Lazy3DViewport>
                  )}

                  {stage.visualType === 'tablet' && (
                    <Lazy3DViewport
                      rootMargin="250px"
                      fallback={
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 font-tech text-xs opacity-60">
                          <span className="w-2 h-2 rounded-full bg-[#F20D16] animate-pulse" />
                          <span>IPAD PRO DESIGN TOKENS // LOADING</span>
                        </div>
                      }
                    >
                      <div className="w-full h-full relative">
                        <TabletCanvas />
                      </div>
                    </Lazy3DViewport>
                  )}

                  {stage.visualType === 'terminal' && (
                    <Lazy3DViewport rootMargin="250px">
                      <Terminal3DCanvas />
                    </Lazy3DViewport>
                  )}

                  {stage.visualType === 'architecture' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-full max-w-[420px] bg-[#0c0b1a]/90 backdrop-blur-md border border-white/15 rounded-2xl p-6 shadow-2xl flex flex-col gap-3 font-tech text-white">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <span className="text-xs uppercase tracking-wider text-[#F20D16] font-bold">
                            CLEAN ARCHITECTURE STACK
                          </span>
                          <span className="text-[10px] text-emerald-400">ISOLATED BOUNDARIES</span>
                        </div>
                        
                        {/* Layer 1: Presentation */}
                        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-[#F20D16]" />
                            <span className="text-xs font-bold font-display">PRESENTATION</span>
                          </div>
                          <span className="text-[10px] text-white/60">Flutter Widgets &bull; 60fps UI</span>
                        </div>

                        {/* Layer 2: Domain */}
                        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            <span className="text-xs font-bold font-display">DOMAIN LOGIC</span>
                          </div>
                          <span className="text-[10px] text-white/60">UseCases &bull; State BLoC</span>
                        </div>

                        {/* Layer 3: Data */}
                        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-xs font-bold font-display">DATA ACCESS</span>
                          </div>
                          <span className="text-[10px] text-white/60">SQLite &bull; Offline Sync</span>
                        </div>

                        {/* Layer 4: Native Engine */}
                        <div className="p-3 rounded-xl bg-[#F20D16]/10 border border-[#F20D16]/30 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-[#F20D16] animate-pulse" />
                            <span className="text-xs font-bold font-display text-[#F20D16]">NATIVE C++ RUNTIME</span>
                          </div>
                          <span className="text-[10px] text-[#F1EBDD]/80">Dart FFI &bull; Low Latency</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {stage.visualType === 'rocket' && (
                    <Lazy3DViewport rootMargin="250px">
                      <Rocket3DCanvas />
                    </Lazy3DViewport>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Stage Switcher Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-current/15 pt-6 mt-10">
              <div className="flex items-center gap-4 md:gap-8 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
                {stages.map((stg, i) => {
                  const isActive = activeStage === i;
                  return (
                    <button
                      key={stg.id}
                      onClick={() => scrollToSection(`#${stg.id}`)}
                      className={`flex items-center gap-2 font-tech text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                        isActive
                          ? 'font-bold opacity-100 scale-105'
                          : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      {isActive && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isRedStage ? 'bg-[#F1EBDD]' : 'bg-[#F20D16]'
                          }`}
                        />
                      )}
                      <span>{stg.number} {stg.title}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => scrollToSection('#work')}
                className={`group flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors ${
                  isRedStage ? 'hover:text-white text-[#F1EBDD]' : 'hover:text-[#F20D16]'
                }`}
              >
                <span>Inspect Verified Projects</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>
        );
      })}
    </div>
  );
};
