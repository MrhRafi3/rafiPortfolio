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

export const ContinuousSnakeLine: React.FC<{ className?: string }> = ({ className = '' }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1440, height: 6000 });
  const [pathData, setPathData] = useState('');
  const [gradientStops, setGradientStops] = useState<GradientStop[]>([
    { offset: '0%', color: '#F1EBDD' },
    { offset: '15%', color: '#F20D16' },
    { offset: '100%', color: '#F20D16' },
  ]);

  const calculateWaypoints = useCallback(() => {
    const width = window.innerWidth;
    if (width < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPathData('');
      return;
    }

    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.querySelector('main')?.scrollHeight || 0
    );

    const getBounds = (id: string, fallbackTop: number, fallbackHeight: number) => {
      const el = document.getElementById(id);
      if (!el) return { top: fallbackTop, height: fallbackHeight };
      const rect = el.getBoundingClientRect();
      return { top: rect.top + window.scrollY, height: el.offsetHeight };
    };

    const hero = getBounds('hero', 0, 900);
    const about = getBounds('about', 900, 900);
    const skills = getBounds('skills', 1800, 900);
    const work = getBounds('work', 2700, 900);
    const process = getBounds('process', 6300, 900);
    const deepDive = getBounds('deep-dive', 7200, 900);
    const contact = getBounds('contact', 8100, 900);

    const workEl = document.getElementById('work');
    const pinSpacer = workEl?.closest('.pin-spacer') as HTMLElement | null;
    const workEffectiveHeight = pinSpacer ? pinSpacer.offsetHeight : Math.max(work.height, process.top - work.top);

    // Keep waypoints along the outer right margin so content & 3D canvases stay unobstructed
    const xOuter = width * 0.975;
    const xInner = width * 0.945;

    const waypoints: Point[] = [
      { x: xInner, y: hero.top + hero.height * 0.85 },
      { x: xOuter, y: about.top + about.height * 0.35 },
      { x: xInner, y: about.top + about.height * 0.78 },
      { x: xOuter, y: skills.top + skills.height * 0.45 },
      { x: xInner, y: work.top + workEffectiveHeight * 0.25 },
      { x: xOuter, y: work.top + workEffectiveHeight * 0.65 },
      { x: xInner, y: process.top + process.height * 0.45 },
      { x: xOuter, y: deepDive.top + deepDive.height * 0.50 },
      { x: xInner, y: contact.top + contact.height * 0.45 },
      { x: xOuter, y: contact.top + contact.height * 0.82 },
    ];

    setDimensions({ width, height: docHeight });
    setPathData(catmullRomToBezier(waypoints));

    const RED = '#F20D16';
    const CREAM = '#F1EBDD';
    const pct = (y: number) => `${((Math.max(0, Math.min(docHeight, y)) / docHeight) * 100).toFixed(2)}%`;

    setGradientStops([
      { offset: '0%', color: CREAM },
      { offset: pct(hero.top + hero.height - 120), color: CREAM },
      { offset: pct(hero.top + hero.height), color: RED },
      { offset: '100%', color: RED },
    ]);
  }, []);

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
    document.fonts?.ready.then(() => {
      calculateWaypoints();
      ScrollTrigger.refresh();
    });

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateWaypoints]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !pathData) return;

    let totalLength = 0;
    try {
      totalLength = path.getTotalLength();
    } catch {
      return;
    }
    if (totalLength <= 0) return;

    const samplesCount = 120;
    const samples: { len: number; y: number }[] = [];
    for (let i = 0; i <= samplesCount; i++) {
      const len = (i / samplesCount) * totalLength;
      samples.push({ len, y: path.getPointAtLength(len).y });
    }

    const getLengthForY = (targetY: number): number => {
      if (targetY <= samples[0].y) return 0;
      if (targetY >= samples[samples.length - 1].y) return totalLength;
      let low = 0;
      let high = samples.length - 1;
      while (low <= high) {
        const mid = (low + high) >> 1;
        if (samples[mid].y < targetY) low = mid + 1;
        else high = mid - 1;
      }
      const idx = Math.max(0, low - 1);
      const s0 = samples[idx];
      const s1 = samples[Math.min(samples.length - 1, idx + 1)];
      const dy = s1.y - s0.y;
      const t = dy > 0.001 ? (targetY - s0.y) / dy : 0;
      return s0.len + t * (s1.len - s0.len);
    };

    gsap.set(path, {
      strokeDasharray: totalLength,
      strokeDashoffset: totalLength,
    });

    let rafId = 0;
    let prevOffset = -1;
    const updateStroke = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const targetY = window.scrollY + window.innerHeight * 0.72;
        const offset = Math.max(0, totalLength - getLengthForY(targetY));
        if (Math.abs(offset - prevOffset) < 1) return;
        prevOffset = offset;
        path.style.strokeDashoffset = `${offset}px`;
      });
    };

    updateStroke();

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: updateStroke,
      onRefresh: updateStroke,
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      trigger.kill();
    };
  }, [pathData]);

  if (!pathData) return null;

  return (
    <svg
      className={`hidden md:block absolute top-0 left-0 w-full pointer-events-none select-none z-[2] opacity-40 ${className}`}
      style={{ height: `${dimensions.height}px` }}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
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
      <path
        ref={pathRef}
        d={pathData}
        stroke="url(#continuous-snake-gradient)"
        strokeWidth={24}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};
