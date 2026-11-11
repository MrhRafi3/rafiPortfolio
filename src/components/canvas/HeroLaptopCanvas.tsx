import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { loadCachedGLB } from '../../utils/glbCache';
import { create3DViewerController, ViewerController } from '../../utils/create3DViewerController';
import { createSoftGroundShadow, GroundShadowResult } from '../../utils/createSoftGroundShadow';

interface HeroLaptopCanvasProps {
  className?: string;
  interactive?: boolean;
}

export const HeroLaptopCanvas: React.FC<HeroLaptopCanvasProps> = ({
  className = '',
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ViewerController | null>(null);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 5.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.appendChild(renderer.domElement);

    // 2. High-quality Studio Environment Reflection Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    const envGeo = new THREE.SphereGeometry(10, 16, 16);
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 256;
    envCanvas.height = 128;
    const ctx = envCanvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#A0A5B5');
    grad.addColorStop(0.5, '#202028');
    grad.addColorStop(0.7, '#080713');
    grad.addColorStop(1, '#020204');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(40, 20, 60, 20);
    ctx.fillRect(160, 30, 60, 20);
    ctx.fillStyle = '#F20D16';
    ctx.fillRect(110, 50, 40, 15);

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    const envMat = new THREE.MeshBasicMaterial({ map: envTexture, side: THREE.BackSide });
    envScene.add(new THREE.Mesh(envGeo, envMat));
    const envMap = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envMap;

    // 3. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.6);
    fillLight.position.set(-4, -1, 3);
    scene.add(fillLight);

    const redRimLight = new THREE.DirectionalLight(0xf20d16, 3.0);
    redRimLight.position.set(-3, -3, -2);
    scene.add(redRimLight);

    // 4. Ground Shadow (Realistic soft drop shadow centered under base)
    const shadow: GroundShadowResult = createSoftGroundShadow({
      width: 5.6,
      height: 3.4,
      opacity: 0.55,
      yPosition: -1.35,
    });
    scene.add(shadow.mesh);

    // 5. Laptop Group & Model Loading
    const laptopGroup = new THREE.Group();
    scene.add(laptopGroup);

    // Initial 3/4 perspective angles
    const baseRotX = 0.36;
    const baseRotY = -0.50;
    const baseRotZ = -0.10;

    laptopGroup.rotation.set(baseRotX, baseRotY, baseRotZ);
    laptopGroup.position.set(0, 0.05, 0);

    let loadedModel: THREE.Group | null = null;

    loadCachedGLB('/images/glb_model/macbook.glb')
      .then((gltf) => {
        const model = gltf.scene;
        loadedModel = model;

        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        const wrapper = new THREE.Group();
        wrapper.add(model);
        model.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 2.75 / (maxDim || 1);
        wrapper.scale.setScalar(targetScale);

        // Enhance material reflectivity
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.envMapIntensity = 1.8;
              mat.needsUpdate = true;
            }
          }
        });

        laptopGroup.add(wrapper);
        controller.requestRender();
      })
      .catch((err) => {
        console.warn('HeroLaptopCanvas load error:', err);
      });

    // 6. Universal 360° Interaction Controller
    const controller = create3DViewerController({
      container,
      targetGroup: laptopGroup,
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
        // Shadow tracks position subtly with gentle scale breathing
        shadow.mesh.position.x = laptopGroup.position.x * 0.4;
        shadow.mesh.scale.set(
          1.0 + Math.sin(time * 1.2) * 0.02,
          1.0 + Math.sin(time * 1.2) * 0.015,
          1
        );
      },
    });

    controller.setInteractive(interactive);
    controller.start();
    controllerRef.current = controller;

    // Fade hint after 6 seconds
    const hintTimer = setTimeout(() => {
      setHintVisible(false);
    }, 6000);

    // 7. Cleanup
    return () => {
      clearTimeout(hintTimer);
      controller.dispose();
      controllerRef.current = null;

      shadow.dispose();
      pmremGenerator.dispose();
      envTexture.dispose();
      envMat.dispose();
      envGeo.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className}`}>
      {/* 360 Interaction Indicator */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#080713]/85 border border-white/20 text-[#F1EBDD] font-tech text-[10px] tracking-widest uppercase backdrop-blur-md pointer-events-none transition-opacity duration-700 whitespace-nowrap shadow-lg flex items-center gap-2 ${
          hintVisible ? 'opacity-90' : 'opacity-0'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#F20D16] animate-pulse" />
        <span>DRAG TO ROTATE 360° // DBL-CLICK RESET</span>
      </div>
    </div>
  );
};
