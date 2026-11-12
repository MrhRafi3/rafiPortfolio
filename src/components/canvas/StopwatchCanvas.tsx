import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { loadCachedGLB } from '../../utils/glbCache';
import { create3DViewerController, ViewerController } from '../../utils/create3DViewerController';
import { createSoftGroundShadow } from '../../utils/createSoftGroundShadow';
import { createStudioEnvMap } from '../../utils/createStudioEnvMap';

interface StopwatchCanvasProps {
  className?: string;
}

export const StopwatchCanvas: React.FC<StopwatchCanvasProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ViewerController | null>(null);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 440;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    const studioEnv = createStudioEnvMap(renderer, '#707585', 50);
    scene.environment = studioEnv.envMap;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(3, 6, 5);
    scene.add(keyLight);

    const redRim = new THREE.DirectionalLight(0xf20d16, 2.5);
    redRim.position.set(-3, -2, -2);
    scene.add(redRim);

    const shadow = createSoftGroundShadow({
      width: 4.0,
      height: 2.0,
      opacity: 0.42,
      yPosition: -1.35,
    });
    scene.add(shadow.mesh);

    const stopwatchGroup = new THREE.Group();
    scene.add(stopwatchGroup);

    const baseRotX = 0.18;
    const baseRotY = -0.32;
    const baseRotZ = 0.06;

    let isDisposed = false;
    let mixer: THREE.AnimationMixer | null = null;

    loadCachedGLB('/images/glb_model/stopwatch.glb')
      .then((gltf) => {
        if (isDisposed) return;

        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        const wrapper = new THREE.Group();
        wrapper.add(model);
        model.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.45 / (maxDim || 1);
        wrapper.scale.setScalar(scale);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.envMapIntensity = 2.1;
              mat.needsUpdate = true;
            }
          }
        });

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.setEffectiveTimeScale(1.0);
          action.play();
        }

        stopwatchGroup.add(wrapper);
        controller.requestRender();
      })
      .catch((err) => console.warn('StopwatchCanvas load error:', err));

    const controller = create3DViewerController({
      container,
      targetGroup: stopwatchGroup,
      camera,
      renderer,
      scene,
      initialRotation: [baseRotX, baseRotY, baseRotZ],
      initialPosition: [0, 0.05, 0],
      verticalClamp: [-Math.PI / 3, Math.PI / 3],
      sensitivity: 0.0055,
      inertiaDamping: 0.92,
      enableFloating: true,
      floatAmplitude: 0.025,
      floatSpeed: 1.0,
      hasActiveAnimation: () => mixer !== null,
      onResize: (_w, _h, aspect) => {
        const distanceScale = aspect < 1.0 ? 1.0 / Math.max(aspect, 0.7) : 1;
        camera.position.set(0, 0, Math.min(7.4, 5.2 * distanceScale));
      },
      onRender: (time, delta) => {
        if (mixer) {
          mixer.update(delta);
        }
        shadow.mesh.scale.set(
          1 + Math.sin(time) * 0.015,
          1 + Math.sin(time) * 0.012,
          1
        );
      },
    });

    controller.start();
    controllerRef.current = controller;

    const hintTimer = setTimeout(() => setHintVisible(false), 5000);

    return () => {
      isDisposed = true;
      clearTimeout(hintTimer);
      controller.dispose();
      controllerRef.current = null;
      mixer?.stopAllAction();
      shadow.dispose();
      studioEnv.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className}`}>
      <div
        className={`absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#080713]/85 border border-white/15 text-[#F1EBDD] font-tech text-[10px] tracking-wider uppercase backdrop-blur-sm pointer-events-none transition-opacity duration-700 whitespace-nowrap shadow-md flex items-center gap-1.5 ${
          hintVisible ? 'opacity-90' : 'opacity-0'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#F20D16]" />
        <span>Drag to rotate 360°</span>
      </div>
    </div>
  );
};
