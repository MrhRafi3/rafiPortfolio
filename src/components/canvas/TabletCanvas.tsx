import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { loadCachedGLB } from '../../utils/glbCache';
import { create3DViewerController, ViewerController } from '../../utils/create3DViewerController';
import { createSoftGroundShadow, GroundShadowResult } from '../../utils/createSoftGroundShadow';

interface TabletCanvasProps {
  className?: string;
}

export const TabletCanvas: React.FC<TabletCanvasProps> = ({ className = '' }) => {
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
    camera.position.set(0, 0, 5.6);

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

    // Studio Environment reflection map
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
    g.addColorStop(0.35, '#808595');
    g.addColorStop(1, '#080713');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(30, 20, 80, 25);
    ctx.fillStyle = '#F20D16';
    ctx.fillRect(150, 40, 50, 20);
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const envMat = new THREE.MeshBasicMaterial({ map: envTex, side: THREE.BackSide });
    envScene.add(new THREE.Mesh(envGeo, envMat));
    scene.environment = pmrem.fromScene(envScene).texture;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const redRim = new THREE.DirectionalLight(0xf20d16, 3.0);
    redRim.position.set(-4, -2, -2);
    scene.add(redRim);

    // Soft Realistic Ground Shadow
    const shadow: GroundShadowResult = createSoftGroundShadow({
      width: 5.0,
      height: 3.4,
      opacity: 0.5,
      yPosition: -1.4,
    });
    scene.add(shadow.mesh);

    const tabletGroup = new THREE.Group();
    scene.add(tabletGroup);

    const baseRotX = 0.15;
    const baseRotY = -0.32;
    const baseRotZ = -0.05;
    tabletGroup.rotation.set(baseRotX, baseRotY, baseRotZ);
    tabletGroup.position.set(0, 0.05, 0);

    // Responsive design token screen canvas
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 1366;
    const sCtx = screenCanvas.getContext('2d')!;

    sCtx.fillStyle = '#080713';
    sCtx.fillRect(0, 0, 1024, 1366);

    // Top status / header
    sCtx.fillStyle = '#181726';
    sCtx.fillRect(40, 40, 944, 90);
    sCtx.fillStyle = '#FFFFFF';
    sCtx.font = 'bold 36px -apple-system, sans-serif';
    sCtx.fillText('DESIGN SYSTEM // FLUTTER TOKENS', 70, 98);

    // Color Swatches
    const colors = [
      { name: 'PRIMARY RED', hex: '#F20D16', label: 'Brand Lead' },
      { name: 'WARM CREAM', hex: '#F1EBDD', label: 'Background / Paper' },
      { name: 'MIDNIGHT DARK', hex: '#080713', label: 'Base Canvas' },
    ];
    colors.forEach((c, i) => {
      sCtx.fillStyle = c.hex;
      sCtx.beginPath();
      sCtx.roundRect(40 + i * 324, 160, 296, 220, 24);
      sCtx.fill();

      sCtx.fillStyle = i === 1 ? '#080713' : '#FFFFFF';
      sCtx.font = 'bold 28px -apple-system, sans-serif';
      sCtx.fillText(c.name, 65 + i * 324, 230);
      sCtx.font = '22px monospace';
      sCtx.fillText(c.hex, 65 + i * 324, 275);
      sCtx.font = '20px -apple-system, sans-serif';
      sCtx.fillText(c.label, 65 + i * 324, 325);
    });

    // Typography specs card
    sCtx.fillStyle = '#111020';
    sCtx.beginPath();
    sCtx.roundRect(40, 420, 944, 440, 24);
    sCtx.fill();

    sCtx.fillStyle = '#F20D16';
    sCtx.font = 'bold 24px monospace';
    sCtx.fillText('// TYPOGRAPHY PAIRING & TOKEN SPECIFICATION', 70, 475);

    sCtx.fillStyle = '#FFFFFF';
    sCtx.font = 'bold 56px Syne, sans-serif';
    sCtx.fillText('HEADLINE DISPLAY // SYNE 900', 70, 560);

    sCtx.fillStyle = '#F1EBDD';
    sCtx.font = 'italic 52px "Instrument Serif", Georgia, serif';
    sCtx.fillText('Editorial Nuance // Instrument Serif Italic', 70, 640);

    sCtx.fillStyle = '#A69F99';
    sCtx.font = '24px "JetBrains Mono", monospace';
    sCtx.fillText('const EdgeInsets kPaddingTablet = EdgeInsets.symmetric(horizontal: 32.0);', 70, 720);
    sCtx.fillText('const double kThumbTarget = 48.0; // WCAG 2.2 AA Ergonomic Baseline', 70, 765);

    // Responsive Preview Grid
    sCtx.fillStyle = '#181726';
    sCtx.beginPath();
    sCtx.roundRect(40, 890, 944, 420, 24);
    sCtx.fill();

    sCtx.fillStyle = '#4ade80';
    sCtx.font = 'bold 24px monospace';
    sCtx.fillText('✦ RESPONSIVE BREAKPOINT: TABLET 1024×1366 @2x', 70, 945);

    sCtx.fillStyle = '#FFFFFF';
    sCtx.font = '32px -apple-system, sans-serif';
    sCtx.fillText('Adaptive Master-Detail View // Touch Target Verified', 70, 1010);

    const tokenTexture = new THREE.CanvasTexture(screenCanvas);
    tokenTexture.colorSpace = THREE.SRGBColorSpace;
    tokenTexture.center.set(0.5, 0.5);
    tokenTexture.rotation = Math.PI;
    tokenTexture.generateMipmaps = true;

    loadCachedGLB('/images/glb_model/apple_ipad_pro.glb')
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
        const scale = 2.75 / (maxDim || 1);
        wrapper.scale.setScalar(scale);

        // Apply custom token texture to screen mesh
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.name.includes('screen') || (mesh.material && (mesh.material as THREE.Material).name === 'screen')) {
              mesh.material = new THREE.MeshBasicMaterial({
                map: tokenTexture,
                toneMapped: false,
              });
            } else if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.envMapIntensity = 1.8;
              mat.needsUpdate = true;
            }
          }
        });

        tabletGroup.add(wrapper);
        controller.requestRender();
      })
      .catch((err) => {
        console.warn('TabletCanvas load error:', err);
      });

    // Universal 360° Interaction Controller
    const controller = create3DViewerController({
      container,
      targetGroup: tabletGroup,
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
        shadow.mesh.position.x = tabletGroup.position.x * 0.4;
      },
    });

    controller.start();
    controllerRef.current = controller;

    const hintTimer = setTimeout(() => setHintVisible(false), 6000);

    return () => {
      clearTimeout(hintTimer);
      controller.dispose();
      controllerRef.current = null;

      tokenTexture.dispose();
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
