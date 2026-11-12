import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Github, Sparkles, Clock, Image as ImageIcon } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../../data/portfolioData';
import { ProjectItem } from '../../types';
import { ProjectDetailModal } from './ProjectDetailModal';
import { StopwatchCanvas } from '../canvas/StopwatchCanvas';
import { Lazy3DViewport } from '../canvas/Lazy3DViewport';
import { getLenis } from '../../utils/scroll';
import { RevealHeading } from '../common/RevealHeading';
import { TextScramble } from '../common/TextScramble';
import { prefersReducedMotion } from '../../utils/motion';

gsap.registerPlugin(ScrollTrigger);

interface ProjectSlideProps {
  project: ProjectItem;
  clockyView: '3d' | 'image';
  onToggleClockyView: (mode: '3d' | 'image') => void;
  onSelect: (project: ProjectItem) => void;
  setParallaxRef?: (el: HTMLDivElement | null) => void;
}

const ProjectEditorialSlide: React.FC<ProjectSlideProps> = ({
  project,
  clockyView,
  onToggleClockyView,
  onSelect,
  setParallaxRef,
}) => {
  const isClocky = project.id === 'clocky';
  const showStopwatch = isClocky && clockyView === '3d';

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
      {/* Left Visual Column */}
      <div className="lg:col-span-6 flex flex-col gap-3">
        <div
          className={`relative w-full h-[250px] sm:h-[310px] lg:h-[380px] xl:h-[420px] max-h-[52vh] rounded-2xl overflow-hidden ${
            showStopwatch
              ? 'bg-[#080713]/[0.05] border border-[#080713]/10'
              : 'bg-[#080713] shadow-2xl cursor-pointer group/img'
          }`}
          onClick={!showStopwatch ? () => onSelect(project) : undefined}
        >
          {showStopwatch ? (
            <Lazy3DViewport
              rootMargin="250px"
              fallback={
                <div className="w-full h-full flex items-center justify-center font-tech text-xs text-[#080713]/60">
                  Loading 3D Stopwatch...
                </div>
              }
            >
              <StopwatchCanvas />
            </Lazy3DViewport>
          ) : (
            <>
              <div ref={setParallaxRef} className="w-full h-full will-change-transform">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-[1.06]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#080713]/75 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="font-tech text-[11px] uppercase tracking-wider text-white bg-[#080713]/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                  {project.screenshots.length > 0
                    ? `${project.screenshots.length} Screenshots`
                    : 'Visual Identity · Case Study'}
                </span>
                <span className="w-9 h-9 rounded-full bg-[#F20D16] text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/img:scale-110">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </>
          )}

          {/* Clocky 3D Stopwatch / App Preview Toggle */}
          {isClocky && (
            <div className="absolute top-3 left-3 z-20 inline-flex items-center p-1 rounded-full bg-[#080713]/90 backdrop-blur-md border border-white/15 shadow-lg">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleClockyView('3d');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-tech text-[10px] uppercase tracking-wider transition-colors ${
                  clockyView === '3d'
                    ? 'bg-[#F20D16] text-white font-bold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>3D Clock</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleClockyView('image');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-tech text-[10px] uppercase tracking-wider transition-colors ${
                  clockyView === 'image'
                    ? 'bg-[#F20D16] text-white font-bold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>App Preview</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Editorial Typography Column */}
      <div className="lg:col-span-6 flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-3 text-xs font-tech uppercase tracking-widest text-[#080713]/60 mb-2">
          <span className="text-[#F20D16] font-bold">{project.number}</span>
          <span>·</span>
          <TextScramble text={project.category} />
          <span>·</span>
          <span>{project.year}</span>
        </div>

        <h3 className="font-display font-black text-[clamp(2rem,4.5vw,3.9rem)] text-[#080713] tracking-tight uppercase leading-[0.94]">
          {project.title}
        </h3>
        <p className="font-serif-italic text-[clamp(1.25rem,2.3vw,1.9rem)] text-[#F20D16] leading-tight mt-1">
          {project.subtitle}
        </p>

        <p className="mt-4 text-sm sm:text-base text-[#080713]/80 leading-relaxed max-w-xl">
          {project.overview}
        </p>

        <div className="mt-4 pt-4 border-t border-[#080713]/15 flex items-center gap-2 text-xs font-tech text-[#080713]/85">
          <Sparkles className="w-3.5 h-3.5 text-[#F20D16] shrink-0" />
          <span>{project.metricsOrHighlight}</span>
        </div>

        {/* Minimal Inline Tech List */}
        <div className="flex flex-wrap gap-2 mt-4">
          {project.techStack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-full border border-[#080713]/20 text-[#080713]/80 font-tech text-[11px] uppercase tracking-wider"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <button
            onClick={() => onSelect(project)}
            data-test={`explore-${project.id}`}
            className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#080713] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#F20D16] transition-colors"
          >
            <span>View Case Study</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#080713]/25 text-[#080713] hover:bg-[#080713] hover:text-white font-tech text-xs uppercase tracking-wider transition-colors"
              aria-label={`${project.title} GitHub`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>Source</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const HorizontalProjectGallery: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastActiveIdxRef = useRef(0);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [clockyView, setClockyView] = useState<'3d' | 'image'>('3d');

  const scrollToProject = (index: number) => {
    const st = triggerRef.current;
    if (st) {
      const scrollDist = st.end - st.start;
      const targetY = st.start + scrollDist * (index / (PROJECTS.length - 1));
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(targetY, { duration: 0.85 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    } else {
      setSelectedProject(PROJECTS[index]);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const reduced = prefersReducedMotion();
      let entranceObserver: IntersectionObserver | null = null;
      let entranceScale = reduced ? 1 : 1.05;

      const applyParallax = (progress: number) => {
        if (reduced) return;
        const currentSlide = progress * (PROJECTS.length - 1);
        for (let i = 0; i < PROJECTS.length; i++) {
          const el = parallaxRefs.current[i];
          if (!el) continue;
          const delta = Math.max(-1, Math.min(1, i - currentSlide));
          const shiftX = -delta * 18;
          el.style.transform = `translate3d(${shiftX.toFixed(1)}px, 0, 0) scale(${(
            1.07 * entranceScale
          ).toFixed(3)})`;
        }
      };

      if (!reduced) {
        applyParallax(0);
        entranceObserver = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                const obj = { s: 1.05 };
                gsap.to(obj, {
                  s: 1,
                  duration: 0.75,
                  ease: 'power2.out',
                  onUpdate: () => {
                    entranceScale = obj.s;
                    applyParallax(triggerRef.current?.progress ?? 0);
                  },
                });
                entranceObserver?.disconnect();
                break;
              }
            }
          },
          { threshold: 0.15 }
        );
        entranceObserver.observe(section);
      }

      const totalSlides = PROJECTS.length;
      const tween = gsap.to(track, {
        x: () => -(window.innerWidth * (totalSlides - 1)),
        ease: 'none',
      });

      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerWidth * (totalSlides - 1)}`,
        pin: true,
        animation: tween,
        scrub: 0.9,
        snap: 1 / (totalSlides - 1),
        invalidateOnRefresh: true,
        refreshPriority: 1,
        onUpdate: (self) => {
          applyParallax(self.progress);
          const idx = Math.min(
            Math.round(self.progress * (totalSlides - 1)),
            totalSlides - 1
          );
          if (idx !== lastActiveIdxRef.current) {
            lastActiveIdxRef.current = idx;
            setActiveProjectIdx(idx);
          }
        },
      });

      return () => {
        entranceObserver?.disconnect();
        triggerRef.current = null;
        for (const el of parallaxRefs.current) {
          if (el) el.style.transform = '';
        }
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <>
      <section
        id="work"
        ref={sectionRef}
        className="relative z-10 w-full bg-[#F1EBDD] text-[#080713] overflow-hidden select-none lg:h-screen lg:flex lg:flex-col lg:justify-between scroll-mt-20"
      >
        {/* Top Header */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-10 md:px-14 pt-20 lg:pt-[84px] pb-3 flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-[#080713]/15 shrink-0">
          <div className="flex flex-col">
            <span className="font-tech text-xs font-bold tracking-widest uppercase text-[#F20D16] mb-1">
              03 — Projects
            </span>
            <RevealHeading
              as="h2"
              className="font-display font-black text-[clamp(1.9rem,3.4vw,3rem)] tracking-tight text-[#080713] uppercase leading-[0.94] flex flex-wrap gap-x-3"
              lines={[
                { text: 'Selected', className: 'inline-block' },
                {
                  text: 'Applications',
                  className: 'font-serif-italic capitalize text-[#F20D16] font-normal inline-block',
                },
              ]}
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {PROJECTS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => scrollToProject(idx)}
                className={`px-3 py-1.5 rounded-full font-tech text-[11px] font-bold transition-colors ${
                  activeProjectIdx === idx
                    ? 'bg-[#080713] text-white'
                    : 'bg-[#080713]/10 text-[#080713]/70 hover:bg-[#080713]/20'
                }`}
              >
                {p.number} {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Horizontal Pinned Track */}
        <div className="hidden lg:flex flex-1 min-h-0 relative z-20 w-full items-center overflow-hidden">
          <div
            ref={trackRef}
            className="flex items-center will-change-transform"
            style={{ width: `${PROJECTS.length * 100}vw` }}
          >
            {PROJECTS.map((project, idx) => (
              <div
                key={project.id}
                className="w-screen shrink-0 flex items-center justify-center px-10 xl:px-14"
              >
                <div className="w-full max-w-7xl mx-auto">
                  <ProjectEditorialSlide
                    project={project}
                    clockyView={clockyView}
                    onToggleClockyView={setClockyView}
                    onSelect={setSelectedProject}
                    setParallaxRef={(el) => {
                      parallaxRefs.current[idx] = el;
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile & Tablet Clean Editorial Stack */}
        <div className="lg:hidden w-full px-6 sm:px-10 py-8 flex flex-col divide-y divide-[#080713]/15 relative z-20">
          {PROJECTS.map((project) => (
            <div key={project.id} className="py-8 first:pt-2 last:pb-4">
              <ProjectEditorialSlide
                project={project}
                clockyView={clockyView}
                onToggleClockyView={setClockyView}
                onSelect={setSelectedProject}
              />
            </div>
          ))}
        </div>

        {/* Minimal Base Bar */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-10 md:px-14 py-3 border-t border-[#080713]/15 flex items-center justify-between text-xs font-tech text-[#080713]/60 shrink-0">
          <span>{PROJECTS.length} Flutter &amp; C++ Applications</span>
          <span>Click any project for screenshots &amp; notes</span>
        </div>
      </section>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};
