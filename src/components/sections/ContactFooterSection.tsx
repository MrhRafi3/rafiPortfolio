import React, { useState } from 'react';
import { ArrowUpRight, Copy, Check, ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { scrollToSection } from '../../utils/scroll';
import { PROFILE } from '../../data/portfolioData';

export const ContactFooterSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer
      id="contact"
      className="relative min-h-[100svh] lg:h-screen w-full bg-[#080713] text-white pt-20 lg:pt-24 pb-8 px-6 sm:px-10 md:px-14 flex flex-col justify-between overflow-hidden select-none border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between relative z-10">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <span className="font-tech text-xs font-bold tracking-widest uppercase text-[#F20D16]">
            06 — Contact
          </span>
          <div className="flex items-center gap-2 text-xs font-tech text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="uppercase">{PROFILE.status}</span>
          </div>
        </div>

        {/* Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center my-auto py-6">
          <div className="lg:col-span-7 flex flex-col">
            <h2 className="font-display font-black text-[clamp(2.6rem,6vw,5.4rem)] tracking-tight leading-[0.88] uppercase text-white">
              Have a project
              <br />
              in mind?
            </h2>
            <p className="mt-2 font-display font-black text-[clamp(2.2rem,5vw,4.5rem)] tracking-tight leading-[0.95] text-white">
              Let&apos;s build something{' '}
              <span className="font-serif-italic font-normal text-[#F20D16] text-[1.12em]">
                extraordinary.
              </span>
            </p>

            <p className="mt-5 text-sm sm:text-base text-white/70 max-w-lg leading-relaxed">
              Available for mobile application engineering, cross-platform Flutter products, and native C++ performance work.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-7">
              <a
                href={`mailto:${PROFILE.email}`}
                className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-white hover:text-[#F20D16] transition-colors tracking-tight inline-flex items-center gap-3"
              >
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#F20D16]" />
                <span>{PROFILE.email}</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#080713] font-tech text-xs uppercase tracking-wider transition-colors border border-white/15"
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Clean Hairline Directory */}
          <div className="lg:col-span-5 flex flex-col border-t border-white/15">
            <div className="py-5 border-b border-white/15 flex items-baseline justify-between gap-4">
              <span className="font-tech text-xs uppercase tracking-widest text-white/50">
                Location
              </span>
              <span className="font-display font-bold text-base sm:text-lg text-white text-right">
                {PROFILE.location} (GMT+6)
              </span>
            </div>

            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group py-5 border-b border-white/15 flex items-center justify-between gap-4 hover:border-[#F20D16] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5 text-[#F20D16]" />
                <div className="flex flex-col">
                  <span className="font-display font-bold text-base sm:text-lg text-white group-hover:text-[#F20D16] transition-colors">
                    GitHub
                  </span>
                  <span className="font-tech text-xs text-white/50">
                    github.com/MrhRafi3
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group py-5 border-b border-white/15 flex items-center justify-between gap-4 hover:border-[#F20D16] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Linkedin className="w-5 h-5 text-[#F20D16]" />
                <div className="flex flex-col">
                  <span className="font-display font-bold text-base sm:text-lg text-white group-hover:text-[#F20D16] transition-colors">
                    LinkedIn
                  </span>
                  <span className="font-tech text-xs text-white/50">
                    linkedin.com/in/mrhrafi
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-tech text-white/55">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">© 2026 {PROFILE.name}</span>
            <span>·</span>
            <span>{PROFILE.primaryTitle}</span>
          </div>

          <button
            onClick={() => scrollToSection('#hero')}
            className="inline-flex items-center gap-2 text-white/75 hover:text-white transition-colors uppercase tracking-wider"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#F20D16]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
