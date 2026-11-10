import React, { useState } from 'react';
import { Phone3DCanvas } from '../canvas/Phone3DCanvas';
import { PROJECTS } from '../../data/portfolioData';
import { ArrowUpRight, Sparkles, Smartphone, Eye } from 'lucide-react';
import { ProjectDetailModal } from './ProjectDetailModal';
import { ProjectItem } from '../../types';

export const Interactive3DPhoneSection: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);

  const activeProject = PROJECTS[selectedIdx];
  const activeImage = activeProject.screenshots[0] || activeProject.coverImage;

  return (
    <>
      <section
        id="interactive-3d"
        className="relative w-full bg-[#080713] text-white py-24 md:py-32 px-6 sm:px-10 md:px-16 overflow-hidden select-none border-t border-white/5"
      >
        {/* Ambient Glow */}
        <div
          className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-20 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: activeProject.accentColor }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-14">
            <div className="flex items-center gap-4">
              <span className="font-tech text-xs md:text-sm font-bold tracking-widest uppercase text-[#F20D16]">
                06 / 3D INTERACTION LAB
              </span>
              <span className="text-white/20">•</span>
              <span className="font-tech text-xs tracking-wider text-white/50 uppercase">
                REAL-TIME PHONE ENGINE &bull; INTERACTIVE PROJECTION
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-tech text-white/50">
              <Smartphone className="w-3.5 h-3.5 text-[#F20D16]" />
              <span>MOUSE PARALLAX &bull; PHYSICAL SHADERS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Interactive Project Switcher & Details */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <span className="font-tech text-xs uppercase tracking-widest text-[#F20D16] font-bold block mb-2">
                  // INTERACTIVE DEVICE SIMULATOR
                </span>
                <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase leading-[0.94]">
                  Tactile Mobile
                  <br />
                  <span className="font-serif-italic capitalize text-[#F20D16] font-normal">
                    In Real-time 3D
                  </span>
                </h2>
                <p className="mt-4 text-sm sm:text-base text-white/70 max-w-lg leading-relaxed">
                  Interact with the 3D phone model and switch between real Flutter application builds to inspect UI layouts, touch targets, and visual fidelity.
                </p>
              </div>

              {/* Project Pills Switcher */}
              <div className="flex flex-col gap-2 mt-8">
                <span className="font-tech text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">
                  SELECT APPLICATION TO RENDER ON SCREEN:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PROJECTS.map((project, idx) => {
                    const isActive = selectedIdx === idx;
                    return (
                      <button
                        key={project.id}
                        onClick={() => setSelectedIdx(idx)}
                        className={`group flex items-center gap-2 px-4 py-2.5 rounded-full font-tech text-xs uppercase tracking-wider transition-all duration-300 border ${
                          isActive
                            ? 'bg-[#F20D16] text-white border-[#F20D16] font-bold shadow-[0_0_20px_rgba(242,13,22,0.5)] scale-105'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/10 hover:text-white'
                        }`}
                      >
                        <span className="font-bold">{project.number}</span>
                        <span>{project.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Project Specs Card */}
              <div className="mt-8 p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-lg text-white">
                      {activeProject.title}
                    </span>
                    <span className="text-xs font-tech text-white/40">
                      // {activeProject.category}
                    </span>
                  </div>
                  <span className="font-tech text-xs text-[#F20D16] font-bold">
                    {activeProject.year}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal mb-4">
                  {activeProject.overview}
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs font-tech text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span className="leading-snug">{activeProject.metricsOrHighlight}</span>
                  </div>

                  <button
                    onClick={() => setModalProject(activeProject)}
                    className="inline-flex items-center gap-1.5 font-tech text-xs uppercase tracking-wider text-white hover:text-[#F20D16] transition-colors"
                  >
                    <span>Inspect Case Study</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Smartphone Viewport */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px] md:min-h-[580px]">
              <div className="w-full max-w-[460px] h-[460px] md:h-[580px]">
                <Phone3DCanvas
                  activeProjectImage={activeImage}
                  appName={activeProject.title}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Modal */}
      <ProjectDetailModal
        project={modalProject}
        onClose={() => setModalProject(null)}
      />
    </>
  );
};
