import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Point {
  x: number;
  y: number;
}

interface GradientStop {
  offset: string;
  color: string;
}

// Convert an array of 2D waypoints to a smooth C1-continuous cubic Bézier SVG path
function catmullRomToBezier(points: Point[]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i + 2 < points.length ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

interface ContinuousSnakeLineProps {
  color?: string;
  className?: string;
}

export const ContinuousSnakeLine: React.FC<ContinuousSnakeLineProps> = ({
  color = '#F20D16',
  className = '',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const shadowPathRef = useRef<SVGPathElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 1440,
    height: 12000,
  });
  const [pathData, setPathData] = useState<string>('');
  const [gradientStops, setGradientStops] = useState<GradientStop[]>([
    { offset: '0%', color: '#F1EBDD' },
    { offset: '7%', color: '#F1EBDD' },
    { offset: '8%', color: '#F20D16' },
    { offset: '63%', color: '#F20D16' },
    { offset: '64%', color: '#F1EBDD' },
    { offset: '69%', color: '#F1EBDD' },
    { offset: '70%', color: '#F20D16' },
    { offset: '100%', color: '#F20D16' },
  ]);

  const calculateWaypoints = useCallback(() => {
    const width = window.innerWidth;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.querySelector('main')?.scrollHeight || 0
    );

    const isMobile = width < 768;

    // Helper to get element's absolute top and height relative to document
    const getElBounds = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      return { top, height: el.offsetHeight };
    };

    const hero = getElBounds('hero') || { top: 0, height: 900 };
    const intermediate = getElBounds('intermediate-band') || { top: 900, height: 350 };
    const about = getElBounds('about') || { top: 1250, height: 1300 };
    const skills = getElBounds('skills') || { top: 2550, height: 1150 };
    const work = getElBounds('work') || { top: 3700, height: 1000 };
    const stage1 = getElBounds('stage-discover') || { top: 7700, height: 900 };
    const stage2 = getElBounds('stage-design') || { top: 8600, height: 900 };
    const stage3 = getElBounds('stage-develop') || { top: 9500, height: 900 };
    const stage4 = getElBounds('stage-engineer') || { top: 10400, height: 900 };
    const stage5 = getElBounds('stage-refine') || { top: 11300, height: 900 };
    const deepDive = getElBounds('deep-dive') || { top: 12200, height: 1200 };
    const phone3d = getElBounds('interactive-3d') || { top: 13400, height: 1000 };
    const contact = getElBounds('contact') || { top: 14400, height: 1200 };

    // Distance multiplier for horizontal pin in Work section
    const workEl = document.getElementById('work');
    const pinSpacer = workEl?.closest('.pin-spacer') as HTMLElement | null;
    const workEffectiveHeight = pinSpacer ? pinSpacer.offsetHeight : (stage1.top - work.top);

    // Coordinate clamps for mobile vs desktop
    const clampX = (ratio: number) => {
      if (isMobile) {
        return width * (0.2 + ratio * 0.6); // keep between 20% and 80% on mobile
      }
      return width * ratio;
    };

    const waypoints: Point[] = [
      // 1. Begin at base of Hero / top of Intermediate Band
      { x: clampX(0.72), y: hero.top + hero.height * 0.88 },

      // 2. Swoop through Intermediate Band
      { x: clampX(0.35), y: intermediate.top + intermediate.height * 0.55 },

      // 3. Enter About Me Section (sweeps under editorial headline)
      { x: clampX(0.22), y: about.top + 220 },
      { x: clampX(0.55), y: about.top + about.height * 0.42 },

      // 4. About Me loop framing the floating 3D capsule on the right
      { x: clampX(0.85), y: about.top + about.height * 0.70 },
      { x: clampX(0.70), y: about.top + about.height * 0.88 },

      // 5. Cross into Technical Skills Section
      { x: clampX(0.26), y: skills.top + 160 },
      { x: clampX(0.72), y: skills.top + skills.height * 0.52 },
      { x: clampX(0.48), y: skills.top + skills.height * 0.88 },

      // 6. Selected Projects Showcase (Travels across the pinned canvas)
      { x: clampX(0.32), y: work.top + workEffectiveHeight * 0.18 },
      { x: clampX(0.74), y: work.top + workEffectiveHeight * 0.50 },
      { x: clampX(0.38), y: work.top + workEffectiveHeight * 0.82 },

      // 7. Workflow Methodology Stages (01 to 05)
      { x: clampX(0.76), y: stage1.top + stage1.height * 0.5 },
      { x: clampX(0.24), y: stage2.top + stage2.height * 0.5 },
      { x: clampX(0.78), y: stage3.top + stage3.height * 0.5 },
      { x: clampX(0.22), y: stage4.top + stage4.height * 0.5 },
      { x: clampX(0.76), y: stage5.top + stage5.height * 0.5 },

      // 8. Technical Deep Dive Section
      { x: clampX(0.30), y: deepDive.top + deepDive.height * 0.45 },
      { x: clampX(0.68), y: deepDive.top + deepDive.height * 0.85 },

      // 9. Interactive 3D Phone Lab
      { x: clampX(0.75), y: phone3d.top + phone3d.height * 0.5 },

      // 10. Contact & Footer Section
      { x: clampX(0.32), y: contact.top + 340 },
      { x: clampX(0.50), y: contact.top + contact.height * 0.75 },
    ];

    setDimensions({ width, height: docHeight });
    const d = catmullRomToBezier(waypoints);
    setPathData(d);

    // Background-aware seamless color adaptation gradient
    const stops: GradientStop[] = [];
    const addStop = (y: number, stopColor: string) => {
      const clampedY = Math.max(0, Math.min(docHeight, y));
      const pct = ((clampedY / docHeight) * 100).toFixed(2) + '%';
      stops.push({ offset: pct, color: stopColor });
    };

    const RED = '#F20D16';
    const CREAM = '#F1EBDD';
    const transitionZone = 160;

    // 1. Hero is Red background -> Line is Warm Cream (#F1EBDD) for high contrast
    addStop(0, CREAM);
    addStop(hero.top + hero.height - transitionZone, CREAM);

    // Seamlessly blend into Red as it enters Intermediate Band & About Me
    addStop(hero.top + hero.height, RED);

    // 2. IntermediateBand, AboutMe, Skills, Work, Stage1, Stage2 -> Line is Red
    addStop(stage3.top - transitionZone, RED);

    // Seamlessly blend into Cream as it enters Stage 03 Develop (Red background)
    addStop(stage3.top + 40, CREAM);
    addStop(stage3.top + stage3.height - 40, CREAM);

    // Seamlessly blend back to Red as it enters Stage 04 Engineer (Dark background)
    addStop(stage3.top + stage3.height + transitionZone, RED);

    // 3. Stage 04, Stage 05, Deep Dive, 3D Phone, Contact -> Line is Red
    addStop(docHeight, RED);

    setGradientStops(stops);
  }, []);

  // Recalculate waypoints on mount, fonts ready, and resize (debounced)
  useEffect(() => {
    calculateWaypoints();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        calculateWaypoints();
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    if (document.fonts) {
      document.fonts.ready.then(() => {
        calculateWaypoints();
        ScrollTrigger.refresh();
      });
    }

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateWaypoints]);

  // High-performance GSAP scrub tween (zero onUpdate allocations)
  useEffect(() => {
    const path = pathRef.current;
    const shadowPath = shadowPathRef.current;
    if (!path || !pathData) return;

    let length = 0;
    try {
      length = path.getTotalLength();
    } catch {
      return;
    }

    if (length <= 0) return;

    const targets = [path, shadowPath].filter(Boolean);
    const initialRevealedRatio = 0.035;
    const startOffset = length * (1 - initialRevealedRatio);

    // Set initial dasharray and offset
    gsap.set(targets, {
      strokeDasharray: length,
      strokeDashoffset: startOffset,
    });

    // Native scrubbed tween directly on GSAP ticker - zero per-frame closures/allocations
    const tween = gsap.to(targets, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [pathData]);

  const isMobile = dimensions.width < 768;
  const strokeWidth = isMobile ? 36 : dimensions.width < 1024 ? 48 : 56;

  return (
    <svg
      ref={svgRef}
      className={`absolute top-0 left-0 w-full pointer-events-none select-none z-[5] ${className}`}
      style={{
        height: `${dimensions.height}px`,
        transform: 'translateZ(0)',
      }}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="continuous-snake-gradient"
          x1="0"
          y1="0"
          x2="0"
          y2={dimensions.height}
          gradientUnits="userSpaceOnUse"
        >
          {gradientStops.map((stop, idx) => (
            <stop key={idx} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
      </defs>

      {pathData && (
        <>
          {/* Hardware-accelerated soft drop shadow path (zero SVG filter buffer allocation) */}
          <path
            ref={shadowPathRef}
            d={pathData}
            stroke="rgba(0, 0, 0, 0.28)"
            strokeWidth={strokeWidth + 6}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(0, 6)"
            vectorEffect="non-scaling-stroke"
          />
          {/* Main Vibrant Organic Stroke with Background-Aware Color Adaptation */}
          <path
            ref={pathRef}
            d={pathData}
            stroke="url(#continuous-snake-gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
    </svg>
  );
};
