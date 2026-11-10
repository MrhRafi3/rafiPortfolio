import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onLoaded?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let current = 0;
    let fontsLoaded = false;

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready
        .then(() => {
          fontsLoaded = true;
        })
        .catch(() => {
          fontsLoaded = true;
        });
    } else {
      fontsLoaded = true;
    }

    // Safety timeout: ensure font delays never cause indefinite loading states
    const safetyTimer = setTimeout(() => {
      fontsLoaded = true;
    }, 1800);

    const interval = setInterval(() => {
      // Advance to 85% swiftly, then wait for fonts to resolve before 100%
      if (current < 85) {
        current += Math.floor(Math.random() * 16) + 12;
        if (current > 85) current = 85;
        setProgress(current);
      } else if (fontsLoaded) {
        current += 15;
        if (current >= 100) {
          current = 100;
          setProgress(100);
          clearInterval(interval);
          clearTimeout(safetyTimer);

          // Notify parent immediately as the reveal transition starts
          onLoaded?.();

          // Unmount after opacity fade-out completes
          setTimeout(() => {
            setIsDone(true);
          }, 650);
        } else {
          setProgress(current);
        }
      }
    }, 45);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimer);
    };
  }, [onLoaded]);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] bg-[#080713] text-white flex flex-col justify-between p-8 sm:p-12 transition-opacity duration-700 select-none ${
        progress === 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-xs font-tech text-white/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F20D16] animate-pulse" />
          <span className="tracking-widest uppercase">MRH RAFI // PORTFOLIO 2026</span>
        </div>
        <span className="tracking-widest uppercase">DHAKA, BANGLADESH</span>
      </div>

      {/* Center Monogram & Title */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        <div className="relative mb-6">
          <span className="font-display font-extrabold text-7xl sm:text-9xl tracking-tighter text-white">
            MR
          </span>
          <span className="absolute -top-2 -right-4 text-[#F20D16] text-3xl sm:text-4xl font-serif-italic">
            ✦
          </span>
        </div>

        <h1 className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white uppercase">
          MRH RAFI
        </h1>
        <p className="font-tech text-xs sm:text-sm text-white/60 tracking-widest uppercase mt-2">
          FLUTTER APP DEVELOPER &bull; MOBILE UI ENGINEER
        </p>

        {/* Minimal Progress Bar */}
        <div className="w-48 sm:w-64 h-[2px] bg-white/10 rounded-full mt-8 overflow-hidden relative">
          <div
            className="h-full bg-[#F20D16] transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Information */}
      <div className="flex items-center justify-between text-xs font-tech text-white/50">
        <span className="tracking-widest">INITIALIZING EXPERIENCE</span>
        <span className="font-bold text-white tracking-widest">{progress}%</span>
      </div>
    </div>
  );
};
