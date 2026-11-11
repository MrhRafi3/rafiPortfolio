import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Github, ExternalLink, Sparkles, Layers } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../../data/portfolioData';
import { ProjectItem } from '../../types';
import { ProjectDetailModal } from './ProjectDetailModal';
import { getLenis } from '../../utils/scroll';

gsap.registerPlugin(ScrollTrigger);

export const HorizontalProjectGallery: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);

  const scrollToProject = (index: number) => {
    const st = triggerRef.current;
    if (st) {
      const scrollDist = st.end - st.start;
      const targetY = st.start + scrollDist * (index / (PROJECTS.length - 1));
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(targetY, { duration: 0.9 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    } else {
      setSelectedProject(PROJECTS[index]);
    }
  };

  useEffect(() => {
    // Only apply GSAP pinning on large screens (desktop >= 1024px)
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    if (!mediaQuery.matches) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let ctx = gsap.context(() => {
      const totalSlides = PROJECTS.length;
      const getScrollAmount = () => -(window.innerWidth * (totalSlides - 1));

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
      });

      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerWidth * (totalSlides - 1)}`,
        pin: true,
        animation: tween,
        scrub: 1,
        snap: 1 / (totalSlides - 1),
        invalidateOnRefresh: true,
        refreshPriority: 1,
        onUpdate: (self) => {
          const idx = Math.min(
            Math.round(self.progress * (totalSlides - 1)),
            totalSlides - 1
          );
          setActiveProjectIdx(idx);
        },
      });
    }, section);

    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, []);

  return (
    <>
      <section
        id="work"
        ref={sectionRef}
        className="relative z-10 w-full bg-[#F1EBDD] text-[#080713] overflow-hidden select-none lg:h-screen lg:flex lg:flex-col lg:justify-between scroll-mt-24"
      >
        {/* Section Top Header */}
        <div className="relative z-20 w-full px-6 sm:px-10 md:px-16 pt-20 sm:pt-24 lg:pt-[88px] xl:pt-[94px] pb-3 lg:pb-3 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#080713]/10 shrink-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-2">
              <span className="font-tech text-xs md:text-sm font-bold tracking-widest uppercase text-[#F20D16]">
                03 / SELECTED PROJECTS
              </span>
              <span className="text-[#080713]/30">•</span>
              <span className="font-tech text-xs tracking-wider text-[#080713]/60 uppercase">
                PRODUCTION APPLICATIONS &bull; FLUTTER / DART / C++
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-[2.6rem] xl:text-[3rem] tracking-tight text-[#080713] uppercase leading-[0.92]">
              Engineered
              <br />
              <span className="font-serif-italic capitalize text-[#F20D16] font-normal">
                Applications
              </span>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="font-tech text-xs uppercase tracking-widest text-[#080713]/60">
              <span className="hidden lg:inline">PINNED HORIZONTAL SCROLL &bull; </span>
              <span className="lg:hidden">FEATURED PROJECTS &bull; </span>
              SELECT CASE STUDY
            </span>
            <div className="flex items-center gap-2">
              {PROJECTS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => scrollToProject(idx)}
                  className={`px-3 py-1 rounded-full font-tech text-xs font-bold transition-all ${
                    activeProjectIdx === idx
                      ? 'bg-[#080713] text-white shadow-md'
                      : 'bg-[#080713]/10 text-[#080713]/70 hover:bg-[#080713]/20'
                  }`}
                >
                  {p.number} {p.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Horizontal Track (>= 1024px) - Clean, independent viewport-framed slides */}
        <div className="hidden lg:flex flex-1 min-h-0 relative z-20 w-full items-center overflow-hidden">
          <div
            ref={trackRef}
            className="flex items-center will-change-transform"
            style={{ width: `${PROJECTS.length * 100}vw` }}
          >
            {PROJECTS.map((project, index) => (
              <div
                key={project.id}
                className="w-screen shrink-0 flex items-center justify-center px-6 sm:px-10 lg:px-16"
              >
                <div
                  className="relative z-20 w-full max-w-[880px] xl:max-w-[960px] h-[450px] xl:h-[490px] max-h-[calc(100vh-250px)] rounded-3xl bg-[#080713] text-white p-7 xl:p-8 flex flex-col justify-between shadow-2xl border border-white/10 group transition-all duration-300"
                >
                  {/* Card Background Ambient Glow */}
                  <div
                    className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-[90px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
                    style={{ backgroundColor: project.accentColor }}
                  />

                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F20D16] animate-pulse" />
                      <span className="font-tech text-xs uppercase tracking-widest text-white/70">
                        {project.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-tech text-xs text-white/40">{project.year}</span>
                      <span className="font-display font-extrabold text-2xl text-white/40 group-hover:text-white transition-colors">
                        {project.number}
                      </span>
                    </div>
                  </div>

                  {/* Card Body: Split Visual Left + Details Right */}
                  <div className="grid grid-cols-12 gap-6 items-center my-auto relative z-10">
                    {/* Left: Project Cover Art Image */}
                    <div
                      onClick={() => setSelectedProject(project)}
                      className="col-span-6 relative h-[230px] xl:h-[260px] rounded-2xl overflow-hidden bg-black/60 border border-white/10 group-hover:border-[#F20D16]/50 transition-colors cursor-pointer group/img"
                    >
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080713] via-transparent to-transparent opacity-60" />

                      {/* View Details Badge Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="font-tech text-[10px] uppercase tracking-wider text-white/80 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                          {project.screenshots.length} SCREENSHOTS
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#F20D16] text-white flex items-center justify-center shadow-lg group-hover/img:scale-110 transition-transform">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Right: Typography & Meta */}
                    <div className="col-span-6 flex flex-col justify-between h-full pl-2 min-w-0">
                      <div>
                        <h3 className="font-display font-black text-2xl xl:text-3xl text-white tracking-tight uppercase leading-tight">
                          {project.title}
                        </h3>
                        <span className="font-serif-italic text-base xl:text-lg text-[#F20D16] block mt-0.5">
                          {project.subtitle}
                        </span>
                        <p className="mt-2.5 text-xs xl:text-sm text-white/80 leading-relaxed font-normal">
                          {project.overview}
                        </p>
                      </div>

                      <div className="mt-3 xl:mt-4 pt-3 border-t border-white/10 flex flex-col gap-2.5">
                        <div className="flex items-center gap-2 text-xs font-tech text-emerald-400">
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          <span className="leading-snug">{project.metricsOrHighlight}</span>
                        </div>

                        {/* Tech stack badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/80 font-tech text-[10px] uppercase tracking-wider"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 relative z-10">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="group/btn inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-[#F20D16] transition-colors"
                    >
                      <span>View Case Study &amp; Screenshots</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </button>

                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                          aria-label={`${project.title} GitHub`}
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile & Tablet Vertical / Snap Gallery (< 1024px) */}
        <div className="lg:hidden w-full px-5 sm:px-8 py-10 flex flex-col gap-8 relative z-20">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="w-full rounded-2xl bg-[#080713] text-white p-6 shadow-xl border border-black/15 flex flex-col gap-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-tech text-xs text-[#F20D16] font-bold">
                  {project.number} / {project.category}
                </span>
                <span className="font-tech text-xs text-white/40">{project.year}</span>
              </div>

              {/* Cover Art Image */}
              <div
                onClick={() => setSelectedProject(project)}
                className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden bg-black/60 cursor-pointer"
              >
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080713] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="font-tech text-[10px] text-white/90 bg-black/60 px-2.5 py-1 rounded-full">
                    {project.screenshots.length} SCREENSHOTS
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#F20D16] text-white flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase">
                  {project.title}
                </h3>
                <span className="font-serif-italic text-base text-[#F20D16] block mt-0.5">
                  {project.subtitle}
                </span>
                <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed font-normal">
                  {project.overview}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded-full bg-white/5 text-white/70 font-tech text-[10px] uppercase"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedProject(project)}
                className="w-full py-3 rounded-xl bg-[#F20D16] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#d40b13] transition-colors"
              >
                <span>View Full Case Study</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Gallery Base Bar */}
        <div className="relative z-20 w-full px-6 sm:px-10 md:px-16 py-4 lg:py-3 border-t border-[#080713]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-tech text-[#080713]/70 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#F20D16]" />
            <span>5 PRODUCTION CASE STUDIES &bull; REAL DEVICE VERIFIED</span>
          </div>

          <div className="flex items-center gap-4">
            <span>FLUTTER &bull; DART &bull; C++ ARCHITECTURE</span>
            <span className="text-[#080713]/30">•</span>
            <span>NO PLACEHOLDER SCREENS</span>
          </div>
        </div>
      </section>

      {/* Full-Screen Case Study Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};
