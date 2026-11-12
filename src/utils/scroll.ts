import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let visibilityHandler: (() => void) | null = null;

export function initSmoothScroll(): Lenis | null {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return null;
  }

  if (lenisInstance && !(lenisInstance as unknown as { isDestroyed?: boolean }).isDestroyed) {
    return lenisInstance;
  }

  destroySmoothScroll();

  lenisInstance = new Lenis({
    duration: 0.85,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.2,
    autoRaf: false,
  });

  lenisInstance.on('scroll', ScrollTrigger.update);

  tickerCallback = (time: number) => {
    if (document.hidden) return;
    lenisInstance?.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(500, 33);

  visibilityHandler = () => {
    if (!document.hidden) {
      ScrollTrigger.update();
    }
  };
  document.addEventListener('visibilitychange', visibilityHandler);

  return lenisInstance;
}

export function destroySmoothScroll() {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }

  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler);
    visibilityHandler = null;
  }

  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
  ScrollTrigger.update();
}

export function scrollToSection(target: string) {
  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isReducedMotion && lenisInstance && !(lenisInstance as unknown as { isDestroyed?: boolean }).isDestroyed) {
    lenisInstance.scrollTo(target, { offset: 0, duration: 1.1 });
  } else {
    const el = document.querySelector(target);
    el?.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth' });
  }
}
