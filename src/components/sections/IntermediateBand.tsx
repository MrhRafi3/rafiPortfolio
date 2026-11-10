import React from 'react';

export const IntermediateBand: React.FC = () => {
  return (
    <section
      id="intermediate-band"
      className="relative w-full bg-[#080713] text-white py-16 md:py-24 px-6 sm:px-12 md:px-16 overflow-hidden border-t border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10 relative z-10">
        <div className="flex flex-col gap-2">
          {/* Wireframe Outline Text + Star */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-outline-white tracking-tight">
              Mobile UI
            </span>
            <span className="text-[#F20D16] text-2xl sm:text-4xl font-black">✦</span>
            <span className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
              Flutter Apps
            </span>
          </div>

          {/* Layered Text Echo: Native C++ Integration */}
          <div
            className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight text-white/90 text-echo"
            data-text="Native C++ Integration"
          >
            Native C++ Integration
          </div>
        </div>

        {/* Technical Frame & Coordinates */}
        <div className="flex flex-col items-start md:items-end gap-3 self-start md:self-center">
          <div className="w-32 h-32 border border-white/20 rounded-xl p-3.5 flex flex-col justify-between relative bg-white/[0.02] backdrop-blur-sm shadow-xl">
            <div className="flex justify-between items-center text-[10px] font-tech text-white/50">
              <span>LOCATION</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F20D16]" />
            </div>
            <div className="flex flex-col">
              <span className="font-tech text-xs text-white/50">DHAKA // BD</span>
              <span className="font-tech text-lg font-bold text-white tracking-wider">
                23.81° N
              </span>
              <span className="font-tech text-[10px] text-[#F20D16] font-semibold">
                90.41° E
              </span>
            </div>
            <div className="flex justify-between items-center text-[9px] font-tech text-white/40 border-t border-white/10 pt-1">
              <span>60–120 FPS</span>
              <span className="text-emerald-400">OPTIMIZED</span>
            </div>
          </div>
          <span className="font-tech text-[10px] uppercase tracking-widest text-[#A69F99]">
            PRECISION MOBILE CRAFT // ZERO BLOAT
          </span>
        </div>
      </div>
    </section>
  );
};
