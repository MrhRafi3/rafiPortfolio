import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, Github, Linkedin } from 'lucide-react';
import { scrollToSection } from '../../utils/scroll';
import { PROFILE } from '../../data/portfolioData';

interface NavbarProps {
  onContactClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onContactClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [dhakaTime, setDhakaTime] = useState('');

  // Live real-time Dhaka clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Dhaka',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        setDhakaTime(formatter.format(now));
      } catch {
        setDhakaTime('DHAKA');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['hero', 'about', 'skills', 'work', 'process', 'deep-dive', 'interactive-3d', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 260 && rect.bottom >= 260) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'About', target: '#about', id: 'about' },
    { label: 'Skills', target: '#skills', id: 'skills' },
    { label: 'Projects', target: '#work', id: 'work' },
    { label: 'Process', target: '#process', id: 'process' },
    { label: 'Deep Dive', target: '#deep-dive', id: 'deep-dive' },
    { label: '3D Lab', target: '#interactive-3d', id: 'interactive-3d' },
  ];

  const handleNavClick = (target: string) => {
    setMobileMenuOpen(false);
    scrollToSection(target);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-5 sm:px-8 md:px-12 py-3.5 md:py-4 flex items-center justify-between ${
          isScrolled
            ? 'bg-[#080713]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-xl'
            : 'bg-transparent'
        }`}
      >
        {/* Brand Identity */}
        <div
          className="flex flex-col cursor-pointer group"
          onClick={() => handleNavClick('#hero')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleNavClick('#hero')}
        >
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-white group-hover:text-[#F20D16] transition-colors">
              MRH RAFI
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F20D16] animate-pulse" />
          </div>
          <span className="font-tech text-[8.5px] sm:text-[9.5px] tracking-widest uppercase text-white/70">
            FLUTTER APP DEVELOPER &bull; MOBILE UI
          </span>
        </div>

        {/* Center Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-6 xl:gap-8 px-6 py-2 rounded-full bg-black/35 backdrop-blur-md border border-white/10"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.target)}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-white transition-colors relative py-1"
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F20D16] shadow-[0_0_8px_#F20D16]" />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status / Clock & Direct Actions */}
        <div className="hidden sm:flex items-center gap-4 xl:gap-6">
          {/* Dhaka Local Time indicator */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-tech text-white/75">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>DHAKA {dhakaTime} GMT+6</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors border border-white/10"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors border border-white/10"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* CTA */}
          <button
            onClick={onContactClick || (() => handleNavClick('#contact'))}
            className="group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[#F20D16] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#d40b13] transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(242,13,22,0.4)]"
          >
            <span>Let's Talk</span>
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[#F20D16] transition-colors">
              <ArrowUpRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#080713]/98 backdrop-blur-2xl flex flex-col justify-between px-8 py-20 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex flex-col gap-5 my-auto">
            <span className="font-tech text-xs tracking-widest uppercase text-[#F20D16]">
              // NAVIGATION // MRH RAFI
            </span>
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.target)}
                className="text-left font-display text-3xl sm:text-4xl font-extrabold text-white hover:text-[#F20D16] transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                <span className="text-sm font-tech text-white/30">→</span>
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
              <span>DHAKA, BANGLADESH</span>
              <span>{dhakaTime} GMT+6</span>
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
