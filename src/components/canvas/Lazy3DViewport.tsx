import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface Lazy3DViewportProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  rootMargin?: string;
}

/**
 * Lazy3DViewport
 * Defers mounting heavy WebGL components until they approach the viewport (300px rootMargin).
 * Once mounted, keeps the canvas in memory while allowing its internal demand-based loop
 * to sleep completely when offscreen. This prevents context-loss/recreation hitching on scroll.
 */
export const Lazy3DViewport: React.FC<Lazy3DViewportProps> = ({
  children,
  fallback,
  className = '',
  rootMargin = '300px 0px 300px 0px',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (hasEntered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [hasEntered, rootMargin]);

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className}`}>
      {hasEntered ? (
        children
      ) : (
        fallback || (
          <div className="w-full h-full flex items-center justify-center opacity-30 pointer-events-none">
            <div className="w-8 h-8 rounded-full border border-white/20 border-t-[#F20D16] animate-spin" />
          </div>
        )
      )}
    </div>
  );
};
