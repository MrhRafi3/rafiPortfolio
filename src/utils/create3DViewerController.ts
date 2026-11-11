import * as THREE from 'three';

export interface ViewerControllerOptions {
  container: HTMLElement;
  targetGroup: THREE.Group;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  initialRotation?: [number, number, number];
  initialPosition?: [number, number, number];
  verticalClamp?: [number, number]; // [minPitch, maxPitch] in radians
  sensitivity?: number;
  inertiaDamping?: number;
  enableFloating?: boolean;
  floatAmplitude?: number;
  floatSpeed?: number;
  onRender?: (time: number) => void;
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
    enableFloating = true,
    floatAmplitude = 0.04,
    floatSpeed = 1.2,
    onRender,
  } = options;

  let isRunning = false;
  let isVisible = true;
  let isDragging = false;
  let interactive = true;
  let animationFrameId = 0;

  // Rotation state
  let rotX = initialRotation[0];
  let rotY = initialRotation[1];
  let rotZ = initialRotation[2];

  // Inertia velocities
  let velX = 0;
  let velY = 0;

  // Pointer tracking
  let lastPointerX = 0;
  let lastPointerY = 0;
  let hasMoved = false;

  // Clock
  const clock = new THREE.Clock();
  let needsRender = true;

  // Set initial transform
  targetGroup.rotation.set(rotX, rotY, rotZ);
  targetGroup.position.set(initialPosition[0], initialPosition[1], initialPosition[2]);

  // Ensure canvas has touch-action: none so dragging does not conflict with scroll
  renderer.domElement.style.touchAction = 'none';
  renderer.domElement.style.cursor = 'grab';

  const requestRender = () => {
    needsRender = true;
    if (isRunning && isVisible && !animationFrameId) {
      animate();
    }
  };

  const renderScene = (time: number) => {
    if (onRender) {
      onRender(time);
    }
    renderer.render(scene, camera);
  };

  const animate = () => {
    if (!isRunning || !isVisible) {
      animationFrameId = 0;
      return;
    }

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // 1. Apply inertia when not dragging
    if (!isDragging) {
      if (Math.abs(velX) > 0.0001 || Math.abs(velY) > 0.0001) {
        rotY += velX;
        rotX += velY;

        // Clamp vertical pitch
        rotX = Math.max(verticalClamp[0], Math.min(verticalClamp[1], rotX));

        velX *= inertiaDamping;
        velY *= inertiaDamping;
        needsRender = true;
      } else {
        velX = 0;
        velY = 0;
      }
    }

    // 2. Gentle Floating Oscillation (if enabled and not dragging)
    if (enableFloating && !isDragging) {
      const floatY = Math.sin(elapsedTime * floatSpeed) * floatAmplitude;
      targetGroup.position.y = initialPosition[1] + floatY;
      needsRender = true;
    }

    // Update target rotation
    targetGroup.rotation.x = rotX;
    targetGroup.rotation.y = rotY;
    targetGroup.rotation.z = rotZ;

    // 3. Render if dirty, or keep loop alive if animating
    if (needsRender || enableFloating || isDragging || Math.abs(velX) > 0.0001 || Math.abs(velY) > 0.0001) {
      renderScene(elapsedTime);
      needsRender = false;
      animationFrameId = requestAnimationFrame(animate);
    } else {
      // Idle sleep: halt RAF loop completely to save battery & GPU
      animationFrameId = 0;
    }
  };

  // Pointer event handlers
  const onPointerDown = (e: PointerEvent) => {
    if (!interactive) return;
    isDragging = true;
    hasMoved = false;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    velX = 0;
    velY = 0;

    renderer.domElement.style.cursor = 'grabbing';
    try {
      renderer.domElement.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture unsupported
    }
    requestRender();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging || !interactive) return;

    const deltaX = e.clientX - lastPointerX;
    const deltaY = e.clientY - lastPointerY;

    if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
      hasMoved = true;
    }

    lastPointerX = e.clientX;
    lastPointerY = e.clientY;

    // Apply rotation
    const dRotY = deltaX * sensitivity;
    const dRotX = deltaY * sensitivity;

    rotY += dRotY;
    rotX += dRotX;

    // Clamp vertical pitch to prevent flipping upside down
    rotX = Math.max(verticalClamp[0], Math.min(verticalClamp[1], rotX));

    // Update instantaneous velocity for inertia
    velX = dRotY * 0.75;
    velY = dRotX * 0.75;

    requestRender();
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isDragging) return;
    isDragging = false;
    renderer.domElement.style.cursor = 'grab';

    try {
      renderer.domElement.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
    requestRender();
  };

  // Double click / tap reset to initial orientation
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

  // Resize handler
  const onResize = () => {
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    requestRender();
  };

  // Page visibility handler (halt loops when tab is hidden)
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

  // Attach event listeners
  const domEl = renderer.domElement;
  domEl.addEventListener('pointerdown', onPointerDown, { passive: false });
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp, { passive: false });
  window.addEventListener('pointercancel', onPointerUp, { passive: false });
  domEl.addEventListener('dblclick', onDblClick);
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);

  // IntersectionObserver for canvas visibility
  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        clock.start();
        requestRender();
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = 0;
        }
      }
    },
    { rootMargin: '100px' }
  );

  observer.observe(container);

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
    resetRotation: () => {
      rotX = initialRotation[0];
      rotY = initialRotation[1];
      rotZ = initialRotation[2];
      velX = 0;
      velY = 0;
      targetGroup.position.set(initialPosition[0], initialPosition[1], initialPosition[2]);
      requestRender();
    },
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
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      domEl.removeEventListener('dblclick', onDblClick);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    },
  };
}
