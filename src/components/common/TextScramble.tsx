import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../utils/motion';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+-·';

interface TextScrambleProps {
  text: string;
  as?: 'span' | 'h2' | 'h3' | 'h4';
  className?: string;
  durationMs?: number;
  delayMs?: number;
}

/**
 * Lightweight technical text scramble effect.
 * Screen readers always read the intact final text via an sr-only span, while the visible
 * aria-hidden span mutates directly inside requestAnimationFrame (zero React re-renders per frame).
 */
export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  as: Tag = 'span',
  className = '',
  durationMs = 460,
  delayMs = 0,
}) => {
  const hostRef = useRef<HTMLElement | null>(null);
  const visualRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const visual = visualRef.current;
    if (!host || !visual) return;

    visual.textContent = text;
    if (prefersReducedMotion()) return;

    let hasTriggered = false;
    let rafId = 0;
    let delayTimer: ReturnType<typeof setTimeout> | null = null;

    const runScramble = () => {
      if (hasTriggered) return;
      hasTriggered = true;

      const startAt = performance.now();
      const len = text.length;
      let lastFrame = 0;

      const step = (now: number) => {
        // Throttle visual glyph swaps slightly (~30fps) for crisp editorial readability
        if (now - lastFrame < 30 && now - startAt < durationMs) {
          rafId = requestAnimationFrame(step);
          return;
        }
        lastFrame = now;

        const progress = Math.min(1, (now - startAt) / durationMs);
        const resolvedCount = Math.floor(progress * len);
        let out = '';

        for (let i = 0; i < len; i++) {
          const ch = text[i];
          if (i < resolvedCount || ch === ' ' || ch === '·' || ch === '&' || ch === '—') {
            out += ch;
          } else {
            const randIdx = Math.floor(Math.random() * SCRAMBLE_CHARS.length);
            const glyph = SCRAMBLE_CHARS[randIdx];
            out += ch === ch.toLowerCase() && ch !== ch.toUpperCase() ? glyph.toLowerCase() : glyph;
          }
        }

        visual.textContent = out;

        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          visual.textContent = text;
          rafId = 0;
        }
      };

      const kick = () => {
        rafId = requestAnimationFrame(step);
      };

      if (delayMs > 0) {
        delayTimer = setTimeout(kick, delayMs);
      } else {
        kick();
      }
    };

    const rect = host.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
      runScramble();
      return () => {
        if (delayTimer) clearTimeout(delayTimer);
        if (rafId) cancelAnimationFrame(rafId);
        visual.textContent = text;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            runScramble();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(host);

    return () => {
      observer.disconnect();
      if (delayTimer) clearTimeout(delayTimer);
      if (rafId) cancelAnimationFrame(rafId);
      visual.textContent = text;
    };
  }, [text, durationMs, delayMs]);

  return (
    <Tag
      ref={hostRef as React.RefObject<never>}
      className={className}
    >
      <span className="sr-only">{text}</span>
      <span ref={visualRef} aria-hidden="true">
        {text}
      </span>
    </Tag>
  );
};
