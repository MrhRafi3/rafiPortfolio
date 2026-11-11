import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { loadCachedGLB } from '../../utils/glbCache';
import { create3DViewerController, ViewerController } from '../../utils/create3DViewerController';
import { createSoftGroundShadow, GroundShadowResult } from '../../utils/createSoftGroundShadow';

interface Camera3DCanvasProps {
  className?: string;
}

export const Camera3DCanvas: React.FC<Camera3DCanvasProps> = ({ className = '' }) => {
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
    camera.position.set(0, 0, 4.4);

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

    // Environment reflection
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
    g.addColorStop(0.4, '#404555');
    g.addColorStop(1, '#080713');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(40, 20, 70, 20);
    ctx.fillStyle = '#F20D16';
    ctx.fillRect(150, 40, 60, 20);
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const envMat = new THREE.MeshBasicMaterial({ map: envTex, side: THREE.BackSide });
    envScene.add(new THREE.Mesh(envGeo, envMat));
    scene.environment = pmrem.fromScene(envScene).texture;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const redRim = new THREE.DirectionalLight(0xf20d16, 3.0);
    redRim.position.set(-4, -2, -2);
    scene.add(redRim);

    // Realistic Soft Ground Shadow beneath floating camera
    const shadow: GroundShadowResult = createSoftGroundShadow({
      width: 4.8,
      height: 2.6,
      opacity: 0.5,
      yPosition: -1.35,
    });
    scene.add(shadow.mesh);

    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);

    // Initial angled display showing lens and dials
    const baseRotX = 0.18;
    const baseRotY = -0.45;
    const baseRotZ = 0.05;
    cameraGroup.rotation.set(baseRotX, baseRotY, baseRotZ);
    cameraGroup.position.set(0, 0.05, 0);

    loadCachedGLB('/images/glb_model/vintage_camera.glb')
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
        // Significantly increased visual size from 2.5 to 3.25
        const scale = 3.25 / (maxDim || 1);
        wrapper.scale.setScalar(scale);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.envMapIntensity = 2.0;
              mat.needsUpdate = true;
            }
          }
        });

        cameraGroup.add(wrapper);
        controller.requestRender();
      })
      .catch((err) => {
        console.warn('Camera3DCanvas load error:', err);
      });

    // Universal 360° Interaction Controller
    const controller = create3DViewerController({
      container,
      targetGroup: cameraGroup,
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
      onRender: (time) => {
        shadow.mesh.position.x = cameraGroup.position.x * 0.4;
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
        className={`absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#080713]/85 border border-white/15 text-[#F1EBDD] font-tech text-[10px] tracking-wider uppercase backdrop-blur-sm pointer-events-none transition-opacity duration-700 whitespace-nowrap shadow-md flex items-center gap-1.5 ${
          hintVisible ? 'opacity-90' : 'opacity-0'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#F20D16] animate-pulse" />
        <span>DRAG TO ROTATE 360° // DBL-CLICK RESET</span>
      </div>
    </div>
  );
};
