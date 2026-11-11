import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { loadCachedGLB } from '../../utils/glbCache';
import { create3DViewerController, ViewerController } from '../../utils/create3DViewerController';
import { createSoftGroundShadow, GroundShadowResult } from '../../utils/createSoftGroundShadow';

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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      34,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.appendChild(renderer.domElement);

    // Environment reflection map
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const envScene = new THREE.Scene();
    const envGeo = new THREE.SphereGeometry(10, 16, 16);
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 256;
    envCanvas.height = 128;
    const ctx = envCanvas.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, '#FFFFFF');
    g.addColorStop(0.3, '#707585');
    g.addColorStop(1, '#080713');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(30, 20, 80, 20);
    ctx.fillStyle = '#F20D16';
    ctx.fillRect(140, 40, 50, 20);
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const envMat = new THREE.MeshBasicMaterial({ map: envTex, side: THREE.BackSide });
    envScene.add(new THREE.Mesh(envGeo, envMat));
    scene.environment = pmrem.fromScene(envScene).texture;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(3, 6, 5);
    scene.add(keyLight);

    const redRim = new THREE.DirectionalLight(0xf20d16, 2.8);
    redRim.position.set(-3, -2, -2);
    scene.add(redRim);

    // Ground Shadow (Feathered ellipse with no clipping)
    const shadow: GroundShadowResult = createSoftGroundShadow({
      width: 4.4,
      height: 2.2,
      opacity: 0.5,
      yPosition: -1.35,
    });
    scene.add(shadow.mesh);

    const stopwatchGroup = new THREE.Group();
    scene.add(stopwatchGroup);

    const baseRotX = 0.22;
    const baseRotY = -0.35;
    const baseRotZ = 0.08;
    stopwatchGroup.rotation.set(baseRotX, baseRotY, baseRotZ);
    stopwatchGroup.position.set(0, 0.05, 0);

    let mixer: THREE.AnimationMixer | null = null;
    const clock = new THREE.Clock();

    loadCachedGLB('/images/glb_model/stopwatch.glb')
      .then((gltf) => {
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
        const scale = 2.65 / (maxDim || 1);
        wrapper.scale.setScalar(scale);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.envMapIntensity = 2.2;
              mat.needsUpdate = true;
            }
          }
        });

        // Initialize animation clip if present
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.setEffectiveTimeScale(1.0);
          action.play();
        }

        stopwatchGroup.add(wrapper);
        controller.requestRender();
      })
      .catch((err) => {
        console.warn('StopwatchCanvas load error:', err);
      });

    // Universal 360° Interaction Controller
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
      floatAmplitude: 0.035,
      floatSpeed: 1.2,
      onRender: () => {
        if (mixer) {
          const delta = clock.getDelta();
          mixer.update(delta);
        }
      },
    });

    controller.start();
    controllerRef.current = controller;

    const hintTimer = setTimeout(() => setHintVisible(false), 6000);

    return () => {
      clearTimeout(hintTimer);
      controller.dispose();
      controllerRef.current = null;

      shadow.dispose();
      pmrem.dispose();
      envTex.dispose();
      envMat.dispose();
      envGeo.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className}`}>
      {/* 360 Interaction Indicator */}
      <div
        className={`absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#080713]/80 border border-white/15 text-[#F1EBDD] font-tech text-[10px] tracking-wider uppercase backdrop-blur-sm pointer-events-none transition-opacity duration-700 whitespace-nowrap shadow-md flex items-center gap-1.5 ${
          hintVisible ? 'opacity-90' : 'opacity-0'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#F20D16] animate-pulse" />
        <span>DRAG TO ROTATE 360° // DBL-CLICK RESET</span>
      </div>
    </div>
  );
};
