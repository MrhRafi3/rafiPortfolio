import React, { useEffect, useState } from 'react';
import { X, ArrowUpRight, ChevronLeft, ChevronRight, CheckCircle2, Github, Smartphone, Cpu } from 'lucide-react';
import { ProjectItem } from '../../types';
import { getLenis } from '../../utils/scroll';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [project]);

  useEffect(() => {
    if (!project) return;

    // Pause Lenis smooth scroll while modal is active
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && project.screenshots.length > 0) {
        setActiveImageIdx((prev) => (prev + 1) % project.screenshots.length);
      } else if (e.key === 'ArrowLeft' && project.screenshots.length > 0) {
        setActiveImageIdx((prev) => (prev - 1 + project.screenshots.length) % project.screenshots.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      lenis?.start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const currentScreenshot = project.screenshots[activeImageIdx] || project.coverImage;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-[#080713]/90 backdrop-blur-xl animate-fadeIn select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#0c0b1a] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Top Sticky Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/10 bg-[#0c0b1a]/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <span className="font-tech text-xs sm:text-sm font-bold text-[#F20D16]">
              PROJECT {project.number}
            </span>
            <span className="text-white/20">•</span>
            <span className="font-tech text-xs uppercase tracking-wider text-white/60">
              {project.category}
            </span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="font-tech text-xs text-white/40 hidden sm:inline">
              {project.year}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#080713] font-tech text-xs uppercase tracking-wider transition-colors border border-white/15"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repo</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-[#F20D16] text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 flex flex-col gap-10">
          {/* Project Title & Overview */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="flex flex-col max-w-2xl">
              <h2
                id="modal-title"
                className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase"
              >
                {project.title}
              </h2>
              <span className="font-serif-italic text-xl sm:text-2xl text-[#F20D16] mt-1">
                {project.subtitle}
              </span>
              <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed font-normal">
                {project.overview}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              <span className="font-tech text-xs uppercase tracking-wider text-white/50">
                PLATFORM &bull; ROLE
              </span>
              <span className="font-tech text-xs sm:text-sm font-semibold text-white">
                {project.platform}
              </span>
              <span className="font-tech text-xs text-white/70">
                {project.role}
              </span>
            </div>
          </div>

          {/* Interactive Screenshot Showcase */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#F20D16]" />
                <span className="font-tech text-xs uppercase tracking-widest text-white/80 font-bold">
                  VERIFIED APPLICATION SCREENSHOTS ({activeImageIdx + 1}/{project.screenshots.length})
                </span>
              </div>

              {project.screenshots.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setActiveImageIdx((prev) => (prev - 1 + project.screenshots.length) % project.screenshots.length)
                    }
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Previous screenshot"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIdx((prev) => (prev + 1) % project.screenshots.length)
                    }
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Next screenshot"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Main Stage Image */}
            <div className="relative w-full h-[360px] sm:h-[460px] md:h-[540px] bg-black/60 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center p-4">
              <img
                src={currentScreenshot}
                alt={`${project.title} screenshot ${activeImageIdx + 1}`}
                className="max-h-full max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Thumbnail Strip */}
            {project.screenshots.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-2 no-scrollbar">
                {project.screenshots.map((shot, idx) => (
                  <button
                    key={shot}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 sm:w-28 h-24 sm:h-32 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-black/40 ${
                      activeImageIdx === idx
                        ? 'border-[#F20D16] scale-105 shadow-[0_0_12px_rgba(242,13,22,0.6)]'
                        : 'border-white/15 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={shot} alt="thumbnail" loading="lazy" decoding="async" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Problem Statement & Development Direction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="font-tech text-xs uppercase tracking-widest text-[#F20D16] font-bold block mb-2">
                Problem &amp; Motivation
              </span>
              <p className="text-sm text-white/80 leading-relaxed font-normal">
                {project.problemStatement}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="font-tech text-xs uppercase tracking-widest text-emerald-400 font-bold">
                  Performance Highlight
                </span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed font-normal">
                {project.metricsOrHighlight}
              </p>
              {project.developmentDirection && (
                <p className="text-xs text-white/60 mt-3 border-t border-white/10 pt-3">
                  {project.developmentDirection}
                </p>
              )}
            </div>
          </div>

          {/* Verified Feature Checklist */}
          <div className="flex flex-col gap-4">
            <span className="font-tech text-xs uppercase tracking-widest text-white/60 font-bold">
              VERIFIED IMPLEMENTED FEATURES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.verifiedFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/10"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Tech Stack & Footer Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-white/10 text-white font-tech text-xs uppercase tracking-wider border border-white/15"
                >
                  {tech}
                </span>
              ))}
            </div>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F20D16] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#d40b13] transition-colors shadow-lg"
              >
                <Github className="w-4 h-4" />
                <span>View On GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
