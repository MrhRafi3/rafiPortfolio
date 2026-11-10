import React, { useState } from 'react';
import { ArrowUpRight, Copy, Check, ArrowUp, Github, Linkedin, Mail, MapPin } from 'lucide-react';
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
      className="relative w-full bg-[#080713] text-white pt-24 sm:pt-28 pb-12 px-6 sm:px-10 md:px-16 overflow-hidden select-none border-t border-white/10"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#F20D16]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Header Tag */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-16">
          <div className="flex items-center gap-4">
            <span className="font-tech text-xs md:text-sm font-bold tracking-widest uppercase text-[#F20D16]">
              07 / CONTACT &amp; NETWORK
            </span>
            <span className="text-white/20">•</span>
            <span className="font-tech text-xs tracking-wider text-white/50 uppercase">
              NEW APPLICATIONS // DIRECT INQUIRIES
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-tech text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase">{PROFILE.status}</span>
          </div>
        </div>

        {/* Massive Headline & Contact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start pb-20 border-b border-white/10">
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-7 flex flex-col">
            <h2 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] uppercase text-white">
              HAVE A PROJECT
              <br />
              IN MIND?
            </h2>
            <div className="mt-3">
              <span className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-white">
                Let's build something{' '}
              </span>
              <span className="font-serif-italic font-normal text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#F20D16] tracking-tight leading-[0.85]">
                extraordinary.
              </span>
            </div>

            <p className="mt-8 text-base md:text-lg text-white/70 max-w-lg font-normal leading-relaxed">
              Available for high-performance Flutter mobile application development, cross-platform engineering, and native C++ integrations.
            </p>

            {/* Direct Email Display with Copy Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-10">
              <a
                href={`mailto:${PROFILE.email}`}
                className="font-display font-extrabold text-2xl sm:text-3xl text-white hover:text-[#F20D16] transition-colors tracking-tight flex items-center gap-3"
              >
                <Mail className="w-6 h-6 text-[#F20D16]" />
                <span>{PROFILE.email}</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#080713] font-tech text-xs uppercase tracking-wider transition-all border border-white/15"
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY EMAIL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Verified Professional Profiles & Metadata */}
          <div className="lg:col-span-5 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
            <span className="font-tech text-xs font-bold uppercase tracking-widest text-white/70">
              // VERIFIED PROFILES &amp; LOCATION
            </span>

            {/* Location & Timezone Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#F20D16] shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-display font-bold text-base text-white">
                  {PROFILE.location}
                </span>
                <span className="font-tech text-xs text-white/60 mt-0.5">
                  TIMEZONE: {PROFILE.timezone} (GMT+6)
                </span>
                <span className="font-tech text-[10px] text-white/40 mt-1">
                  COORDINATES: {PROFILE.coordinates}
                </span>
              </div>
            </div>

            {/* Verified Social Links */}
            <div className="flex flex-col gap-3">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-[#F20D16] transition-colors">
                    <Github className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-sm text-white">
                      GitHub Repository
                    </span>
                    <span className="font-tech text-[10px] text-white/50">
                      github.com/MrhRafi3
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-[#F20D16] transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-sm text-white">
                      LinkedIn Network
                    </span>
                    <span className="font-tech text-[10px] text-white/50">
                      linkedin.com/in/mrhrafi
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-[#F20D16]/10 border border-[#F20D16]/20 text-xs font-tech text-white/90">
              <span className="font-bold text-[#F20D16] block mb-1">// RESPONSE TIME</span>
              Direct communications are reviewed within 24 hours. No recruiter filters or third-party intermediaries.
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 text-xs font-tech text-white/50">
          <div className="flex items-center gap-4">
            <span className="font-bold text-white">© 2026 MRH RAFI</span>
            <span className="text-white/20">•</span>
            <span>FLUTTER APP DEVELOPER</span>
            <span className="text-white/20">•</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>

          <button
            onClick={() => scrollToSection('#hero')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#F20D16]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
