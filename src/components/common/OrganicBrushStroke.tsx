import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface OrganicStrokeProps {
  sectionId?: string;
  variant?: 'hero-to-studio' | 'studio-loop' | 'services-diagonal' | 'chapter-01' | 'chapter-02' | 'chapter-03' | 'chapter-04' | 'selected-work';
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export const OrganicBrushStroke: React.FC<OrganicStrokeProps> = ({
  variant = 'studio-loop',
  color = '#F20D16',
  strokeWidth = 72,
  className = '',
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length * 0.15, // Partially revealed initially
    });

    // Create scroll-driven path drawing
    const trigger = ScrollTrigger.create({
      trigger: svgRef.current,
      start: 'top 85%',
      end: 'bottom 20%',
      scrub: 1.2,
      onUpdate: (self) => {
        const drawProgress = 0.15 + self.progress * 0.85;
        gsap.to(path, {
          strokeDashoffset: length * (1 - drawProgress),
          ease: 'power1.out',
          overwrite: 'auto',
          duration: 0.3,
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [variant]);

  // Specific bespoke paths matching each transition in the reference video:
  const getPathDefinition = () => {
    switch (variant) {
      case 'hero-to-studio':
        // Descends diagonally from Hero, curves right and down into the studio canvas
        return {
          viewBox: '0 0 1440 900',
          d: 'M 180 -100 C 350 180, 520 380, 780 440 C 1040 500, 1260 620, 1380 920',
        };
      case 'studio-loop':
        // The signature loop that dips down and cradles the floating capsule (frame 005 and 006)
        return {
          viewBox: '0 0 1200 800',
          d: 'M 420 40 C 650 120, 950 20, 980 200 C 1010 380, 720 390, 580 460 C 440 530, 420 680, 640 760 C 860 840, 1100 700, 1180 580',
        };
      case 'services-diagonal':
        // Diagonal slash crossing the dark "What we do" boundary (frame 012 and 013)
        return {
          viewBox: '0 0 1200 700',
          d: 'M 240 20 C 460 220, 680 410, 920 540 C 1060 610, 1160 660, 1220 720',
        };
      case 'chapter-01':
        // Loop framing Design title and browser mockup (frame 014 and 015)
        return {
          viewBox: '0 0 1200 700',
          d: 'M 120 180 C 420 60, 880 40, 980 240 C 1080 440, 820 620, 700 580 C 580 540, 620 380, 820 340',
        };
      case 'chapter-02':
        // Black stroke on red background curving into 3D terminal (frame 017 and 018)
        return {
          viewBox: '0 0 1200 700',
          d: 'M 160 20 C 220 220, 480 340, 760 380 C 1020 420, 1180 480, 1240 680',
        };
      case 'chapter-03':
        // Red loop curling behind smartphone and giant 03 (frame 020)
        return {
          viewBox: '0 0 1200 700',
          d: 'M 680 20 C 780 140, 940 180, 940 340 C 940 520, 640 590, 480 540 C 340 490, 420 360, 640 380',
        };
      case 'chapter-04':
        // S-curve sweeping past rocket (frame 023 and 024)
        return {
          viewBox: '0 0 1200 700',
          d: 'M 440 20 C 460 220, 520 380, 480 520 C 440 660, 620 720, 780 740',
        };
      case 'selected-work':
        // Signature horizontal slash cutting across "Selected Work" heading (frame 026 and 027)
        return {
          viewBox: '0 0 1200 600',
          d: 'M 80 120 C 380 40, 680 160, 860 340 C 940 420, 780 480, 620 460 C 480 440, 260 480, 120 380',
        };
      default:
        return {
          viewBox: '0 0 1200 800',
          d: 'M 200 100 Q 600 300 1000 600',
        };
    }
  };

  const { viewBox, d } = getPathDefinition();

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none z-10 ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Subtle drop shadow for organic depth */}
        <filter id={`stroke-shadow-${variant}`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(0, 0, 0, 0.28)" />
        </filter>
      </defs>

      <path
        ref={pathRef}
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#stroke-shadow-${variant})`}
        className="transition-colors duration-500 ease-out"
      />
    </svg>
  );
};
