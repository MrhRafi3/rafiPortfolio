import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { loadCachedGLB } from '../../utils/glbCache';
import { create3DViewerController, ViewerController } from '../../utils/create3DViewerController';
import { createSoftGroundShadow, GroundShadowResult } from '../../utils/createSoftGroundShadow';

interface Phone3DCanvasProps {
  className?: string;
  activeProjectImage?: string;
  appName?: string;
}

// Generates a true rounded-corner display screen geometry matching iPhone display ergonomics
function createRoundedScreenGeometry(width: number, height: number, radius: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const x0 = -width / 2;
  const y0 = -height / 2;
  const x1 = width / 2;
  const y1 = height / 2;

  shape.moveTo(x0 + radius, y0);
  shape.lineTo(x1 - radius, y0);
  shape.quadraticCurveTo(x1, y0, x1, y0 + radius);
  shape.lineTo(x1, y1 - radius);
  shape.quadraticCurveTo(x1, y1, x1 - radius, y1);
  shape.lineTo(x0 + radius, y1);
  shape.quadraticCurveTo(x0, y1, x0, y1 - radius);
  shape.lineTo(x0, y0 + radius);
  shape.quadraticCurveTo(x0, y0, x0 + radius, y0);

  const geo = new THREE.ShapeGeometry(shape, 18);

  // Compute normalized [0, 1] UVs for the rounded geometry
  const pos = geo.attributes.position;
  const uvs = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    uvs[i * 2] = (x - x0) / width;
    uvs[i * 2 + 1] = (y - y0) / height;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  return geo;
}

export const Phone3DCanvas: React.FC<Phone3DCanvasProps> = ({
  className = '',
  activeProjectImage,
  appName = 'Clocky',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ViewerController | null>(null);
  const screenMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const currentTexRef = useRef<THREE.CanvasTexture | null>(null);
  const [hintVisible, setHintVisible] = useState(true);

  // Helper to draw crisp masked screenshot on offscreen canvas
  const renderScreenTexture = (imageSrc: string | undefined, title: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1170;
    canvas.height = 2532;
    const ctx = canvas.getContext('2d')!;

    // Base background
    ctx.fillStyle = '#080713';
    ctx.fillRect(0, 0, 1170, 2532);

    const applyTexture = () => {
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;

      if (currentTexRef.current) {
        currentTexRef.current.dispose();
      }
      currentTexRef.current = tex;

      if (screenMatRef.current) {
        screenMatRef.current.map = tex;
        screenMatRef.current.needsUpdate = true;
      }
      controllerRef.current?.requestRender();
    };

    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw image clipped inside rounded screen bounds
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(0, 0, 1170, 2532, 130);
        ctx.clip();

        // Scale aspect cover
        const scale = Math.max(1170 / img.width, 2532 / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (1170 - w) / 2;
        const y = (2532 - h) / 2;
        ctx.drawImage(img, x, y, w, h);

        // Dynamic Island pill cutout at top
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.roundRect(435, 42, 300, 92, 46);
        ctx.fill();

        // Subtle camera lens sensor highlight in Dynamic Island
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        ctx.arc(680, 88, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        applyTexture();
      };
      img.onerror = () => {
        // Fallback placeholder card
        drawFallbackScreen(ctx, title);
        applyTexture();
      };
      img.src = imageSrc;
    } else {
      drawFallbackScreen(ctx, title);
      applyTexture();
    }
  };

  const drawFallbackScreen = (ctx: CanvasRenderingContext2D, title: string) => {
    ctx.fillStyle = '#080713';
    ctx.fillRect(0, 0, 1170, 2532);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, 1170, 2532, 130);
    ctx.clip();

    ctx.fillStyle = '#F20D16';
    ctx.beginPath();
    ctx.roundRect(70, 220, 1030, 800, 50);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 76px Syne, sans-serif';
    ctx.fillText(title.toUpperCase(), 120, 360);

    ctx.font = '400 42px -apple-system, sans-serif';
    ctx.fillText('Flutter Mobile Application', 120, 440);
    ctx.fillText('60FPS Native UI & Dart Compute', 120, 510);

    // Dynamic Island
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(435, 42, 300, 92, 46);
    ctx.fill();

    ctx.restore();
  };

  // Update screen texture whenever activeProjectImage or appName changes
  useEffect(() => {
    renderScreenTexture(activeProjectImage, appName);
  }, [activeProjectImage, appName]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      33,
      container.clientWidth / container.clientHeight,
      0.005,
      100
    );
    // Camera placed facing from -Z
    camera.position.set(0, 0, -0.42);
    camera.lookAt(0, 0, 0);

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

    // Studio Environment reflection
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
    g.addColorStop(0.5, '#404555');
    g.addColorStop(1, '#080713');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(100, 20, 80, 25);
    ctx.fillStyle = '#F20D16';
    ctx.fillRect(140, 50, 40, 15);
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const envMat = new THREE.MeshBasicMaterial({ map: envTex, side: THREE.BackSide });
    envScene.add(new THREE.Mesh(envGeo, envMat));
    scene.environment = pmrem.fromScene(envScene).texture;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(1, 3, -3);
    scene.add(keyLight);

    const redRimLight = new THREE.DirectionalLight(0xf20d16, 2.8);
    redRimLight.position.set(-2, -1, 1);
    scene.add(redRimLight);

    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);

    const baseRotY = 0.16;
    const baseRotX = 0.08;
    const baseRotZ = -0.04;
    phoneGroup.rotation.set(baseRotX, baseRotY, baseRotZ);
    phoneGroup.position.set(0, 0, 0);

    // Initial Material & Screen Mesh with exact rounded corners
    const screenMat = new THREE.MeshBasicMaterial({ toneMapped: false });
    screenMatRef.current = screenMat;

    // Exact inner display proportions matching iPhone 15/16/17 Pro chassis
    const screenGeo = createRoundedScreenGeometry(0.0645, 0.1415, 0.0075);
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    // Placed facing camera at -Z
    screenMesh.position.set(0, 0, -0.0036);
    screenMesh.rotation.y = Math.PI;

    // Soft ground shadow beneath phone
    const shadow: GroundShadowResult = createSoftGroundShadow({
      width: 0.36,
      height: 0.24,
      opacity: 0.55,
      yPosition: -0.09,
    });
    scene.add(shadow.mesh);

    loadCachedGLB('/images/glb_model/iphone_17_pro.glb')
      .then((gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);

        // Hide default static wallpaper meshes and tune glass reflection
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.name === 'Object_22' || mesh.name === 'Object_23') {
              mesh.visible = false;
            } else if (mesh.name === 'Object_21') {
              // Protective front glass layer
              if (mesh.material) {
                const mat = mesh.material as THREE.MeshStandardMaterial;
                mat.transparent = true;
                mat.opacity = 0.12;
                mat.roughness = 0.05;
              }
            } else if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.envMapIntensity = 2.0;
              mat.needsUpdate = true;
            }
          }
        });

        model.add(screenMesh);
        phoneGroup.add(model);

        // Render screen texture
        renderScreenTexture(activeProjectImage, appName);
        controller.requestRender();
      })
      .catch((err) => {
        console.warn('Phone3DCanvas load error:', err);
      });

    // Universal 360° Interaction Controller
    const controller = create3DViewerController({
      container,
      targetGroup: phoneGroup,
      camera,
      renderer,
      scene,
      initialRotation: [baseRotX, baseRotY, baseRotZ],
      initialPosition: [0, 0, 0],
      verticalClamp: [-Math.PI / 2.5, Math.PI / 2.5],
      sensitivity: 0.006,
      inertiaDamping: 0.92,
      enableFloating: true,
      floatAmplitude: 0.005,
      floatSpeed: 1.2,
      onRender: (time) => {
        shadow.mesh.position.x = phoneGroup.position.x * 0.4;
      },
    });

    controller.start();
    controllerRef.current = controller;

    const hintTimer = setTimeout(() => setHintVisible(false), 6000);

    return () => {
      clearTimeout(hintTimer);
      controller.dispose();
      controllerRef.current = null;

      if (currentTexRef.current) currentTexRef.current.dispose();
      screenGeo.dispose();
      screenMat.dispose();
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
