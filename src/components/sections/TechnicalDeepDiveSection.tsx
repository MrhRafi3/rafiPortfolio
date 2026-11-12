import React, { useState } from 'react';
import { TECHNICAL_DEEP_DIVE } from '../../data/portfolioData';
import { Cpu, Clock, Database, CheckCircle2, Copy, Check } from 'lucide-react';
import { TextScramble } from '../common/TextScramble';

export const TechnicalDeepDiveSection: React.FC = () => {
  const [selectedTopicIdx, setSelectedTopicIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeTopic = TECHNICAL_DEEP_DIVE.topics[selectedTopicIdx];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeTopic.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="deep-dive"
      className="relative min-h-[100svh] lg:h-screen w-full bg-[#F1EBDD] text-[#080713] py-20 lg:py-24 px-6 sm:px-10 md:px-14 flex flex-col justify-between overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between relative z-10">
        {/* Top Tag */}
        <div className="flex items-center justify-between border-b border-[#080713]/15 pb-3.5">
          <span className="font-tech text-xs font-bold tracking-widest uppercase text-[#F20D16]">
            05 — Engineering
          </span>
          <TextScramble
            text="Code & Architecture"
            className="font-tech text-xs tracking-wider text-[#080713]/60 uppercase"
          />
        </div>

        {/* Main Content */}
        <div className="my-auto py-4 flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2 className="font-display font-black text-[clamp(2rem,4.4vw,3.9rem)] tracking-tight text-[#080713] uppercase leading-[0.94]">
              <TextScramble text="Systems Engineering" className="block" />
              <span className="block text-[#F20D16] font-serif-italic capitalize font-normal">
                In A Mobile Runtime
              </span>
            </h2>

            {/* Topic Selector Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {TECHNICAL_DEEP_DIVE.topics.map((topic, idx) => {
                const isActive = selectedTopicIdx === idx;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopicIdx(idx)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-tech text-xs uppercase tracking-wider transition-colors border ${
                      isActive
                        ? 'bg-[#080713] text-white border-[#080713] font-bold'
                        : 'bg-[#080713]/5 text-[#080713]/70 hover:bg-[#080713]/10 border-[#080713]/15 hover:text-[#080713]'
                    }`}
                  >
                    {idx === 0 && <Cpu className="w-3.5 h-3.5" />}
                    {idx === 1 && <Clock className="w-3.5 h-3.5" />}
                    {idx === 2 && <Database className="w-3.5 h-3.5" />}
                    <span>{topic.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 border-t border-[#080713]/15">
            {/* Left: Rationale & Highlights */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="font-tech text-xs uppercase tracking-widest text-[#F20D16] font-bold mb-1.5">
                {activeTopic.badge}
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#080713]">
                {activeTopic.title}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#080713]/80 leading-relaxed">
                {activeTopic.description}
              </p>

              <div className="flex flex-col mt-5 border-t border-[#080713]/15">
                {activeTopic.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-2.5 py-2.5 border-b border-[#080713]/10 text-xs sm:text-sm text-[#080713]/85"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#F20D16] shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Crisp Code Viewer */}
            <div className="lg:col-span-7 bg-[#080713] border border-[#080713]/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.03]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F20D16]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="font-tech text-xs text-white/70 ml-2">
                    {activeTopic.filename}
                  </span>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-tech text-xs transition-colors"
                  aria-label="Copy code snippet"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-white/70" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 overflow-x-auto font-mono text-xs sm:text-[13px] leading-relaxed text-[#F1EBDD] bg-[#080713]">
                <pre className="whitespace-pre">
                  <code>{activeTopic.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-3 border-t border-[#080713]/15 flex items-center justify-between text-xs font-tech text-[#080713]/55">
          <span>C++17 · Dart FFI · CustomPainter · SQLite</span>
          <span>Production Patterns</span>
        </div>
      </div>
    </section>
  );
};
