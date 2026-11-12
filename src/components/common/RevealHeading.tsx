import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../../utils/motion';

export interface RevealLine {
  text: string;
  className?: string;
}

interface RevealHeadingProps {
  lines: RevealLine[];
  as?: 'h1' | 'h2' | 'h3' | 'div';
  className?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
}

/**
 * Editorial mask-reveal heading component.
 * Renders accessible text immediately and slides each line upward out of an overflow-hidden mask once on viewport entry.
 */
export const RevealHeading: React.FC<RevealHeadingProps> = ({
  lines,
  as: Tag = 'h2',
  className = '',
  stagger = 0.09,
  duration = 0.68,
  delay = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion()) return;

    const lineNodes = el.querySelectorAll<HTMLElement>('[data-reveal-line]');
    if (!lineNodes.length) return;

    let played = false;
    let ctx: gsap.Context | null = null;

    const play = () => {
      if (played) return;
      played = true;
      ctx = gsap.context(() => {
        gsap.fromTo(
          lineNodes,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration,
            delay,
            stagger,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          }
        );
      }, el);
    };

    // If element is already inside or near the viewport on mount, reveal cleanly right away
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      play();
      return () => ctx?.revert();
    }

    // Prepare offscreen mask state cleanly so scrolling into view never flashes before sliding up
    gsap.set(lineNodes, { yPercent: 105, opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            play();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      ctx?.revert();
    };
  }, [delay, duration, stagger]);

  return (
    <div ref={containerRef}>
      <Tag className={className}>
        {lines.map((line, idx) => (
          <span key={idx} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
            <span
              data-reveal-line
              className={`block ${line.className ?? ''}`}
            >
              {line.text}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
};
