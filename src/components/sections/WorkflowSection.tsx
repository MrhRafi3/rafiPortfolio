import React, { useState } from 'react';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { WORKFLOW_STAGES } from '../../data/portfolioData';
import { scrollToSection } from '../../utils/scroll';
import { RevealHeading } from '../common/RevealHeading';

export const WorkflowSection: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);
  const current = WORKFLOW_STAGES[activeStage];

  return (
    <section
      id="process"
      className="relative min-h-[100svh] lg:h-screen w-full bg-[#080713] text-white py-20 lg:py-24 px-6 sm:px-10 md:px-14 flex flex-col justify-between overflow-hidden select-none border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between relative z-10">
        {/* Top Tag */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <span className="font-tech text-xs font-bold tracking-widest uppercase text-[#F20D16]">
            04 — Process
          </span>
          <span className="font-tech text-xs tracking-wider text-white/50 uppercase">
            How I Build
          </span>
        </div>

        {/* Main Split Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-5">
          {/* Left: Oversized Title & Interactive 5-Step List */}
          <div className="lg:col-span-5 flex flex-col">
            <RevealHeading
              as="h2"
              className="font-display font-black text-[clamp(2.2rem,4.5vw,4rem)] tracking-tight text-white uppercase leading-[0.92]"
              lines={[
                { text: 'From Idea to' },
                {
                  text: '60fps Reality.',
                  className: 'font-serif-italic capitalize font-normal text-[#F20D16]',
                },
              ]}
            />

            <div className="mt-6 border-t border-white/10 flex flex-col">
              {WORKFLOW_STAGES.map((stage, idx) => {
                const isActive = idx === activeStage;
                return (
                  <button
                    key={stage.step}
                    onClick={() => setActiveStage(idx)}
                    className={`group py-3 sm:py-3.5 border-b border-white/10 flex items-center justify-between text-left transition-colors ${
                      isActive ? 'text-white' : 'text-white/45 hover:text-white/80'
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        className={`font-tech text-xs font-bold ${
                          isActive ? 'text-[#F20D16]' : 'text-white/35'
                        }`}
                      >
                        {stage.number}
                      </span>
                      <span className="font-display font-bold text-xl sm:text-2xl uppercase tracking-tight">
                        {stage.title}
                      </span>
                    </div>
                    <span className="font-tech text-[11px] uppercase tracking-wider opacity-70">
                      {stage.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Stage Typography Spotlight */}
          <div className="lg:col-span-7 relative flex flex-col justify-center lg:pl-8">
            <span
              aria-hidden="true"
              className="font-display font-black text-[clamp(7rem,16vw,13rem)] leading-none text-white/[0.05] select-none pointer-events-none absolute -top-8 right-0"
            >
              {current.number}
            </span>

            <div className="relative z-10 flex flex-col">
              <span className="font-tech text-xs uppercase tracking-widest text-[#F20D16] font-bold">
                Stage {current.number} · {current.badge}
              </span>

              <h3 className="font-display font-black text-[clamp(2.5rem,5vw,4.4rem)] uppercase tracking-tight leading-[0.94] text-white mt-2">
                {current.title}
              </h3>

              <p className="mt-4 text-base sm:text-xl text-white/90 leading-relaxed max-w-xl font-medium">
                {current.summary}
              </p>

              <p className="mt-2.5 text-sm text-white/65 leading-relaxed max-w-xl">
                {current.details}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/10">
                {current.deliverables.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-xs sm:text-sm text-white/85">
                    <CheckCircle2 className="w-4 h-4 text-[#F20D16] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-tech text-white/50">
          <span>Five-stage engineering cycle</span>
          <button
            onClick={() => scrollToSection('#deep-dive')}
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-[#F20D16] transition-colors uppercase tracking-wider"
          >
            <span>Inspect Technical Code</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
