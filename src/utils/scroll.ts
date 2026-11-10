import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;

export function initSmoothScroll(): Lenis {
  if (lenisInstance && !(lenisInstance as any).isDestroyed) {
    return lenisInstance;
  }

  // Clean up any stale ticker or instance
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }

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

  // Connect Lenis to ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);

  tickerCallback = (time: number) => {
    lenisInstance?.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(500, 33);

  return lenisInstance;
}

export function destroySmoothScroll() {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
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
}

export function scrollToSection(target: string) {
  if (lenisInstance && !(lenisInstance as any).isDestroyed) {
    lenisInstance.scrollTo(target, { offset: 0, duration: 1.4 });
  } else {
    const el = document.querySelector(target);
    el?.scrollIntoView({ behavior: 'smooth' });
  }
}
