import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../../utils/motion';

const BOUNDARY_IDS = ['skills', 'work', 'process', 'contact'] as const;
const GLOBAL_COOLDOWN_MS = 700;

/**
 * Minimal horizontal Racing Red transition light streak triggered at selected major section boundaries.
 * Uses pure GPU transforms/opacity with pointer-events: none and strict rapid-scroll cooldown protection.
 */
export const SectionTransitionStreak: React.FC = () => {
  const streakRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const streakEl = streakRef.current;
    if (!streakEl || prefersReducedMotion()) return;

    let lastFiredAt = performance.now(); // Ignore immediate boundary triggers right at page load
    let activeTween: gsap.core.Tween | null = null;
    const prevTops = new Map<string, number>();

    const triggerStreak = () => {
      const now = performance.now();
      if (now - lastFiredAt < GLOBAL_COOLDOWN_MS) return;
      lastFiredAt = now;

      activeTween?.kill();
      activeTween = gsap.fromTo(
        streakEl,
        {
          xPercent: -115,
          scaleX: 0.35,
          opacity: 0,
        },
        {
          xPercent: 115,
          scaleX: 1,
          opacity: 0.85,
          duration: 0.42,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.set(streakEl, { opacity: 0, xPercent: -115 });
          },
        }
      );
    };

    // Observe crossing of major section top boundaries smoothly via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          const curTop = entry.boundingClientRect.top;
          const prevTop = prevTops.get(id);
          prevTops.set(id, curTop);

          if (prevTop === undefined) continue;

          // Fire only when section boundary actively enters the central band during scroll navigation
          if (entry.isIntersecting && Math.abs(curTop - prevTop) > 12) {
            triggerStreak();
            break;
          }
        }
      },
      {
        rootMargin: '-46% 0px -46% 0px',
        threshold: 0,
      }
    );

    for (const id of BOUNDARY_IDS) {
      const target = document.getElementById(id);
      if (target) {
        prevTops.set(id, target.getBoundingClientRect().top);
        observer.observe(target);
      }
    }

    return () => {
      observer.disconnect();
      activeTween?.kill();
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-[72px] pointer-events-none select-none z-40 overflow-hidden h-[4px]"
      aria-hidden="true"
    >
      <div
        ref={streakRef}
        className="w-[46vw] max-w-[540px] h-[2px] opacity-0 will-change-transform rounded-full"
        style={{
          background:
            'linear-gradient(90deg, rgba(242,13,22,0) 0%, rgba(242,13,22,0.92) 55%, rgba(241,235,221,0.75) 85%, rgba(242,13,22,0) 100%)',
          boxShadow: '0 0 12px rgba(242,13,22,0.55)',
          filter: 'blur(0.4px)',
        }}
      />
    </div>
  );
};
