import React, { useEffect, useRef, useState } from 'react';

export const AnimatedCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const [cursorText, setCursorText] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on fine-pointer devices (desktop)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;

    let prevHovering = false;
    let prevPointer = false;
    let prevText = '';

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = '1';
        ring.style.opacity = '1';
      }

      // Hardware-accelerated direct transform update (zero React state overhead)
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = !!target.closest('button, a, input, [data-cursor-interactive]');
        const customText = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text') || '';

        const nextHovering = !!customText || interactive;
        const nextPointer = interactive;

        // Only update React state if state actually changed
        if (nextHovering !== prevHovering || nextPointer !== prevPointer || customText !== prevText) {
          prevHovering = nextHovering;
          prevPointer = nextPointer;
          prevText = customText;

          setIsHovering(nextHovering);
          setIsPointer(nextPointer);
          setCursorText(customText);
        }
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      cursor.style.opacity = '0';
      ring.style.opacity = '0';
    };

    // Smooth lerp loop for outer ring (sleeps when idle)
    let rafId = 0;
    const render = () => {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;

      if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) {
        ringX = mouseX;
        ringY = mouseY;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        rafId = 0;
        return;
      }

      ringX += dx * 0.18;
      ringY += dy * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(render);
    };

    const wakeLoop = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    const handleMouseMoveWithWake = (e: MouseEvent) => {
      handleMouseMove(e);
      wakeLoop();
    };

    window.addEventListener('mousemove', handleMouseMoveWithWake, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveWithWake);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden hidden md:block">
      {/* Precision Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-white opacity-0 transition-opacity duration-200"
      />

      {/* Trailing Fluid Ring / Bubble */}
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
          <span ref={textRef} className="font-tech text-[10px] font-bold tracking-widest uppercase">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
