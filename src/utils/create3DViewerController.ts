import * as THREE from 'three';

export interface ViewerControllerOptions {
  container: HTMLElement;
  targetGroup: THREE.Group;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  initialRotation?: [number, number, number];
  initialPosition?: [number, number, number];
  verticalClamp?: [number, number];
  sensitivity?: number;
  inertiaDamping?: number;
  enableFloating?: boolean;
  floatAmplitude?: number;
  floatSpeed?: number;
  hasActiveAnimation?: () => boolean;
  onResize?: (width: number, height: number, aspect: number) => void;
  onRender?: (time: number, delta: number) => void;
}

export interface ViewerController {
  start: () => void;
  stop: () => void;
  requestRender: () => void;
  dispose: () => void;
  resetRotation: () => void;
  setInteractive: (interactive: boolean) => void;
}

export function create3DViewerController(options: ViewerControllerOptions): ViewerController {
  const {
    container,
    targetGroup,
    camera,
    renderer,
    scene,
    initialRotation = [0, 0, 0],
    initialPosition = [0, 0, 0],
    verticalClamp = [-Math.PI / 3, Math.PI / 3],
    sensitivity = 0.0055,
    inertiaDamping = 0.92,
    enableFloating = false,
    floatAmplitude = 0.03,
    floatSpeed = 1.1,
    hasActiveAnimation,
    onResize,
    onRender,
  } = options;

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let isRunning = false;
  let isVisible = true;
  let isDragging = false;
  let interactive = true;
  let animationFrameId = 0;

  let rotX = initialRotation[0];
  let rotY = initialRotation[1];
  let rotZ = initialRotation[2];

  let velX = 0;
  let velY = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;

  const clock = new THREE.Clock();
  let needsRender = true;

  targetGroup.rotation.set(rotX, rotY, rotZ);
  targetGroup.position.set(initialPosition[0], initialPosition[1], initialPosition[2]);

  renderer.domElement.style.touchAction = 'none';
  renderer.domElement.style.cursor = 'grab';

  const requestRender = () => {
    needsRender = true;
    if (isRunning && isVisible && !document.hidden && !animationFrameId) {
      clock.getDelta();
      animationFrameId = requestAnimationFrame(animate);
    }
  };

  const renderScene = (time: number, delta: number) => {
    onRender?.(time, delta);
    renderer.render(scene, camera);
  };

  const animate = () => {
    animationFrameId = 0;
    if (!isRunning || !isVisible || document.hidden) {
      return;
    }

    const delta = Math.min(clock.getDelta(), 0.05);
    const elapsedTime = clock.getElapsedTime();

    if (!isDragging) {
      if (Math.abs(velX) > 0.0001 || Math.abs(velY) > 0.0001) {
        rotY += velX;
        rotX += velY;
        rotX = Math.max(verticalClamp[0], Math.min(verticalClamp[1], rotX));

        velX *= inertiaDamping;
        velY *= inertiaDamping;
        needsRender = true;
      } else {
        velX = 0;
        velY = 0;
      }
    }

    const ambientMotion = !prefersReducedMotion && (enableFloating || (hasActiveAnimation?.() ?? false));

    if (enableFloating && !prefersReducedMotion && !isDragging) {
      const floatY = Math.sin(elapsedTime * floatSpeed) * floatAmplitude;
      targetGroup.position.y = initialPosition[1] + floatY;
      needsRender = true;
    }

    targetGroup.rotation.x = rotX;
    targetGroup.rotation.y = rotY;
    targetGroup.rotation.z = rotZ;

    const hasVelocity = Math.abs(velX) > 0.0001 || Math.abs(velY) > 0.0001;
    if (needsRender || ambientMotion || isDragging || hasVelocity) {
      renderScene(elapsedTime, delta);
      needsRender = false;
      if (ambientMotion || isDragging || hasVelocity) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    if (!interactive) return;
    isDragging = true;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    velX = 0;
    velY = 0;

    renderer.domElement.style.cursor = 'grabbing';
    try {
      renderer.domElement.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if unsupported
    }
    requestRender();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging || !interactive) return;

    const deltaX = e.clientX - lastPointerX;
    const deltaY = e.clientY - lastPointerY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;

    const dRotY = deltaX * sensitivity;
    const dRotX = deltaY * sensitivity;

    rotY += dRotY;
    rotX = Math.max(verticalClamp[0], Math.min(verticalClamp[1], rotX + dRotX));

    velX = dRotY * 0.75;
    velY = dRotX * 0.75;

    requestRender();
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isDragging) return;
    isDragging = false;
    renderer.domElement.style.cursor = interactive ? 'grab' : 'default';

    try {
      renderer.domElement.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
    requestRender();
  };

  const onDblClick = () => {
    if (!interactive) return;
    rotX = initialRotation[0];
    rotY = initialRotation[1];
    rotZ = initialRotation[2];
    velX = 0;
    velY = 0;
    targetGroup.position.set(initialPosition[0], initialPosition[1], initialPosition[2]);
    requestRender();
  };

  const handleResize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    const aspect = width / height;
    camera.aspect = aspect;
    onResize?.(width, height, aspect);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    requestRender();
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    } else if (isVisible) {
      requestRender();
    }
  };

  const domEl = renderer.domElement;
  domEl.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointercancel', onPointerUp, { passive: true });
  domEl.addEventListener('dblclick', onDblClick);
  window.addEventListener('resize', handleResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);

  const resizeObserver =
    typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => handleResize())
      : null;
  resizeObserver?.observe(container);

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        clock.start();
        requestRender();
      } else if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    },
    { rootMargin: '60px' }
  );
  observer.observe(container);

  handleResize();

  return {
    start: () => {
      isRunning = true;
      requestRender();
    },
    stop: () => {
      isRunning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    },
    requestRender,
    resetRotation: onDblClick,
    setInteractive: (value: boolean) => {
      interactive = value;
      renderer.domElement.style.cursor = interactive ? 'grab' : 'default';
    },
    dispose: () => {
      isRunning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
      observer.disconnect();
      resizeObserver?.disconnect();
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      domEl.removeEventListener('dblclick', onDblClick);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    },
  };
}
