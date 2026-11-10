import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TECHNICAL_DEEP_DIVE } from '../../data/portfolioData';
import { Terminal, Cpu, Clock, Database, CheckCircle2, Copy, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const TechnicalDeepDiveSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
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
      ref={sectionRef}
      className="relative w-full bg-[#080713] text-white py-24 md:py-32 px-6 sm:px-10 md:px-16 overflow-hidden select-none border-t border-white/5"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-[#F20D16]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-14">
          <div className="flex items-center gap-4">
            <span className="font-tech text-xs md:text-sm font-bold tracking-widest uppercase text-[#F20D16]">
              05 / TECHNICAL DEEP DIVE
            </span>
            <span className="text-white/20">•</span>
            <span className="font-tech text-xs tracking-wider text-white/50 uppercase">
              C++ CORE &bull; DART FFI &bull; LOW-LATENCY ARCHITECTURE
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-tech text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>REAL ENGINE SOURCE SAMPLES</span>
          </div>
        </div>

        {/* Headline */}
        <div className="max-w-4xl mb-12">
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase leading-[0.95]">
            Systems Engineering
            <br />
            <span className="text-[#F20D16] font-serif-italic capitalize font-normal">
              In A Mobile Runtime
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-white/70 max-w-2xl leading-relaxed">
            Where Flutter's declarative expressiveness meets native C++ compute efficiency. Real architectural solutions implemented to solve actual performance constraints.
          </p>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 border-b border-white/10 mb-10 no-scrollbar">
          {TECHNICAL_DEEP_DIVE.topics.map((topic, idx) => {
            const isActive = selectedTopicIdx === idx;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicIdx(idx)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full font-tech text-xs uppercase tracking-wider transition-all duration-300 whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#F20D16] text-white border-[#F20D16] font-bold shadow-[0_0_20px_rgba(242,13,22,0.4)]'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/10 hover:text-white'
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

        {/* Deep Dive Content Stage: Left Highlights + Right Code Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Details & Technical Rationale */}
          <div className="lg:col-span-5 flex flex-col">
            <span className="font-tech text-xs uppercase tracking-widest text-[#F20D16] font-bold mb-2">
              {activeTopic.badge}
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-4">
              {activeTopic.title}
            </h3>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal mb-8">
              {activeTopic.description}
            </p>

            {/* Key Engineering Pillars */}
            <div className="flex flex-col gap-3">
              <span className="font-tech text-[10px] uppercase tracking-widest text-white/50 font-bold">
                CORE TECHNICAL ADVANTAGES:
              </span>
              {activeTopic.highlights.map((highlight, hIdx) => (
                <div
                  key={hIdx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Code Snippet Viewer */}
          <div className="lg:col-span-7 bg-[#0c0b1a] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Terminal Titlebar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F20D16]" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="font-tech text-xs text-white/60 ml-3">
                  {activeTopic.codeLang === 'cpp'
                    ? 'aevique_engine.h'
                    : activeTopic.codeLang === 'dart'
                    ? 'clock_painter.dart'
                    : 'schema.sql'}
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

            {/* Code Body */}
            <div className="p-5 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-white/90 bg-black/40">
              <pre className="text-white/90 whitespace-pre">
                <code>{activeTopic.codeSnippet}</code>
              </pre>
            </div>

            {/* Terminal Footer */}
            <div className="px-5 py-2.5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[11px] font-tech text-white/50">
              <span>ZERO MOCK BENCHMARKS &bull; DIRECT REPO IMPLEMENTATION</span>
              <span>SYNTAX // {activeTopic.codeLang.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
