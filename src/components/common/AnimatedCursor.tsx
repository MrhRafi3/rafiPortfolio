import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../utils/motion';

const TRAIL_SPECS = [
  { size: 7, maxOpacity: 0.42, ease: 0.27, drift: 0.06 },
  { size: 5.5, maxOpacity: 0.31, ease: 0.2, drift: -0.07 },
  { size: 4.5, maxOpacity: 0.21, ease: 0.145, drift: 0.05 },
  { size: 3.5, maxOpacity: 0.13, ease: 0.105, drift: -0.04 },
] as const;

export const AnimatedCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cursorText, setCursorText] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) {
      return;
    }

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let lastMoveAt = 0;
    let trailAlpha = 0;
    let prevHovering = false;
    let prevPointer = false;
    let prevText = '';
    let rafId = 0;

    const trailState = TRAIL_SPECS.map(() => ({ x: -100, y: -100 }));

    const hideTrail = () => {
      trailAlpha = 0;
      for (let i = 0; i < TRAIL_SPECS.length; i++) {
        const node = trailRefs.current[i];
        if (node) node.style.opacity = '0';
      }
    };

    const render = (now: number) => {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      const ringSettled = Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15;

      if (ringSettled) {
        ringX = mouseX;
        ringY = mouseY;
      } else {
        ringX += dx * 0.18;
        ringY += dy * 0.18;
      }
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      const velX = mouseX - prevMouseX;
      const velY = mouseY - prevMouseY;
      prevMouseX += velX * 0.35;
      prevMouseY += velY * 0.35;

      const idleMs = now - lastMoveAt;
      if (idleMs > 120) {
        trailAlpha *= 0.84;
      } else {
        trailAlpha = Math.min(1, trailAlpha + 0.25);
      }

      let trailActive = trailAlpha >= 0.015;
      for (let i = 0; i < TRAIL_SPECS.length; i++) {
        const spec = TRAIL_SPECS[i];
        const pt = trailState[i];
        const target = i === 0 ? { x: mouseX, y: mouseY } : trailState[i - 1];
        const offsetX = velY * spec.drift;
        const offsetY = -velX * spec.drift;

        pt.x += (target.x + offsetX - pt.x) * spec.ease;
        pt.y += (target.y + offsetY - pt.y) * spec.ease;

        if (Math.abs(target.x - pt.x) > 0.25 || Math.abs(target.y - pt.y) > 0.25) {
          trailActive = true;
        }

        const node = trailRefs.current[i];
        if (node) {
          node.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -50%)`;
          node.style.opacity = trailAlpha < 0.015 ? '0' : (spec.maxOpacity * trailAlpha).toFixed(3);
        }
      }

      if (ringSettled && !trailActive && idleMs > 160) {
        hideTrail();
        rafId = 0;
        return;
      }

      rafId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMoveAt = performance.now();

      if (!isVisible) {
        isVisible = true;
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        ringX = mouseX;
        ringY = mouseY;
        for (let i = 0; i < trailState.length; i++) {
          trailState[i].x = mouseX;
          trailState[i].y = mouseY;
        }
        cursor.style.opacity = '1';
        ring.style.opacity = '1';
      }

      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = !!target.closest('button, a, input, [data-cursor-interactive]');
        const customText = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text') || '';
        const nextHovering = !!customText || interactive;

        if (nextHovering !== prevHovering || interactive !== prevPointer || customText !== prevText) {
          prevHovering = nextHovering;
          prevPointer = interactive;
          prevText = customText;
          setIsHovering(nextHovering);
          setIsPointer(interactive);
          setCursorText(customText);
        }
      }

      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      cursor.style.opacity = '0';
      ring.style.opacity = '0';
      hideTrail();
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden hidden md:block" aria-hidden="true">
      {/* Racing Red Magnetic Cursor Trail (3-4 subtle trailing particles, desktop fine-pointer only) */}
      {TRAIL_SPECS.map((spec, idx) => (
        <div
          key={idx}
          ref={(el) => {
            trailRefs.current[idx] = el;
          }}
          className="fixed top-0 left-0 rounded-full bg-[#F20D16] opacity-0 will-change-transform"
          style={{
            width: `${spec.size}px`,
            height: `${spec.size}px`,
            boxShadow: '0 0 8px rgba(242, 13, 22, 0.45)',
          }}
        />
      ))}

      <div
        ref={cursorRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-white opacity-0 transition-opacity duration-200"
      />
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full flex items-center justify-center transition-all duration-300 ease-out border border-white/60 opacity-0 ${
          isHovering
            ? cursorText
              ? 'w-16 h-16 bg-[#080713] border-white/30 text-white shadow-2xl scale-110'
              : 'w-12 h-12 bg-white/20 backdrop-blur-sm scale-110'
            : isPointer
            ? 'w-10 h-10 bg-white/20 scale-100'
            : 'w-8 h-8 opacity-60 scale-75'
        }`}
      >
        {cursorText && (
          <span className="font-tech text-[10px] font-bold tracking-widest uppercase">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
