import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, Github, Linkedin } from 'lucide-react';
import { scrollToSection } from '../../utils/scroll';
import { PROFILE } from '../../data/portfolioData';

interface NavbarProps {
  onContactClick?: () => void;
}

const NAV_ITEMS = [
  { label: 'About', target: '#about', id: 'about' },
  { label: 'Skills', target: '#skills', id: 'skills' },
  { label: 'Projects', target: '#work', id: 'work' },
  { label: 'Process', target: '#process', id: 'process' },
  { label: 'Engineering', target: '#deep-dive', id: 'deep-dive' },
];

const SECTION_IDS = ['hero', 'about', 'skills', 'work', 'process', 'deep-dive', 'contact'];

export const Navbar: React.FC<NavbarProps> = ({ onContactClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [dhakaTime, setDhakaTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      if (document.hidden) return;
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Dhaka',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        setDhakaTime(formatter.format(new Date()));
      } catch {
        setDhakaTime('DHAKA');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 15000);
    document.addEventListener('visibilitychange', updateTime);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', updateTime);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        setIsScrolled(window.scrollY > 40);

        for (const section of SECTION_IDS) {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 260 && rect.bottom >= 260) {
              setActiveSection(section);
              break;
            }
          }
        }
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (target: string) => {
    setMobileMenuOpen(false);
    scrollToSection(target);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-5 sm:px-8 md:px-12 flex items-center justify-between ${
          isScrolled
            ? 'bg-[#080713]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-xl'
            : 'bg-transparent py-4'
        }`}
      >
        <div
          className="flex flex-col cursor-pointer group"
          onClick={() => handleNavClick('#hero')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleNavClick('#hero')}
        >
          <div className="flex items-center gap-2">
            <span
              className={`font-display font-black text-lg sm:text-xl tracking-tight text-white transition-colors ${
                !isScrolled ? 'group-hover:text-[#080713]' : 'group-hover:text-[#F20D16]'
              }`}
            >
              {PROFILE.name}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                !isScrolled ? 'bg-white' : 'bg-[#F20D16]'
              }`}
            />
          </div>
          <span className="font-tech text-[9px] tracking-widest uppercase text-white/75">
            {PROFILE.primaryTitle}
          </span>
        </div>

        <nav
          className="hidden lg:flex items-center gap-6 xl:gap-8 px-6 py-2 rounded-full bg-black/35 backdrop-blur-md border border-white/10"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.target)}
                className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors relative py-1 ${
                  isActive ? 'text-white' : 'text-white/75 hover:text-white'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F20D16]" />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="hidden sm:flex items-center gap-3 xl:gap-5">
          {dhakaTime && (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/25 border border-white/10 text-[11px] font-tech text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>DHAKA {dhakaTime}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          </div>

          <button
            onClick={onContactClick || (() => handleNavClick('#contact'))}
            className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
              !isScrolled
                ? 'bg-[#080713] text-white hover:bg-white hover:text-[#080713] border border-white/20'
                : 'bg-[#F20D16] text-white hover:bg-[#d40b13]'
            }`}
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors border border-white/15"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#080713]/98 backdrop-blur-2xl flex flex-col justify-between px-8 py-24 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex flex-col gap-5 my-auto">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.target)}
                className="text-left font-display text-3xl sm:text-4xl font-extrabold text-white hover:text-[#F20D16] transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                <span className="text-sm font-tech text-white/40">→</span>
              </button>
            ))}
            <button
              onClick={() => handleNavClick('#contact')}
              className="text-left font-display text-3xl sm:text-4xl font-extrabold text-[#F20D16] hover:text-white transition-colors flex items-center justify-between"
            >
              <span>Contact</span>
              <span className="text-sm font-tech text-[#F20D16]">→</span>
            </button>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-tech text-white/60">
              <span>{PROFILE.location}</span>
              <span>{dhakaTime ? `${dhakaTime} GMT+6` : 'GMT+6'}</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-full bg-white/5 border border-white/10 text-center font-tech text-xs text-white uppercase tracking-wider"
              >
                GitHub
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-full bg-white/5 border border-white/10 text-center font-tech text-xs text-white uppercase tracking-wider"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
