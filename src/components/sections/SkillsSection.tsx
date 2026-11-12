import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../../data/portfolioData';
import { RevealHeading } from '../common/RevealHeading';
import { TextScramble } from '../common/TextScramble';

export const SkillsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const currentCategory = SKILL_CATEGORIES[activeTab];

  return (
    <section
      id="skills"
      className="relative min-h-[100svh] lg:h-screen w-full bg-[#080713] text-white py-20 lg:py-24 px-6 sm:px-10 md:px-14 flex flex-col justify-between overflow-hidden select-none border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between relative z-10">
        {/* Top Tag */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <TextScramble
            text="02 — Skills"
            className="font-tech text-xs font-bold tracking-widest uppercase text-[#F20D16]"
          />
          <TextScramble
            text="Technical Stack"
            className="font-tech text-xs tracking-wider text-white/50 uppercase"
            delayMs={90}
          />
        </div>

        {/* Heading + Category Tabs */}
        <div className="my-auto py-5 flex flex-col gap-7">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <RevealHeading
                as="h2"
                className="font-display font-black text-[clamp(2.3rem,5vw,4.5rem)] tracking-tight text-white leading-[0.92] uppercase"
                lines={[
                  { text: 'Technical Stack &' },
                  {
                    text: 'Systems Foundation',
                    className: 'text-[#F20D16] font-serif-italic capitalize font-normal',
                  },
                ]}
              />
            </div>

            {/* Category Selector */}
            <div className="flex flex-wrap items-center gap-2">
              {SKILL_CATEGORIES.map((cat, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(idx)}
                    className={`px-4 py-2 rounded-full font-tech text-xs uppercase tracking-wider transition-colors border ${
                      isActive
                        ? 'bg-[#F20D16] text-white border-[#F20D16] font-bold'
                        : 'bg-white/5 text-white/65 border-white/10 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography-Led Skill List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-white/10">
            <div className="lg:col-span-4 flex flex-col justify-between">
              <span className="font-tech text-xs uppercase tracking-widest text-[#F20D16] font-bold">
                {currentCategory.name}
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mt-2">
                {currentCategory.headline}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed mt-3 max-w-sm">
                Applied across shipped Flutter apps, local SQLite databases, and native C++ pipelines.
              </p>
            </div>

            <div className="lg:col-span-8 flex flex-col border-t border-white/10 lg:border-t-0">
              {currentCategory.skills.map((skill, idx) => (
                <div
                  key={skill.name}
                  className="group py-4 sm:py-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6"
                >
                  <div className="flex items-baseline gap-4 min-w-0">
                    <span className="font-tech text-xs text-white/35 shrink-0">
                      0{idx + 1}
                    </span>
                    <h4 className="font-display font-bold text-lg sm:text-xl md:text-2xl text-white group-hover:text-[#F20D16] transition-colors">
                      {skill.name}
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm text-white/65 leading-relaxed sm:max-w-md sm:text-right">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Subtle Line */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-tech text-white/45">
          <span>Flutter · Dart · C++17 · SQLite</span>
          <span>Clean Architecture</span>
        </div>
      </div>
    </section>
  );
};
