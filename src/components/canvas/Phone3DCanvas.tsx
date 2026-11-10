import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Phone3DCanvasProps {
  className?: string;
  activeProjectImage?: string;
  appName?: string;
}

export const Phone3DCanvas: React.FC<Phone3DCanvasProps> = ({
  className = '',
  activeProjectImage,
  appName = 'Clocky',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const screenMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);
  const currentTextureRef = useRef<THREE.Texture | null>(null);

  // Update screen texture when activeProjectImage changes
  useEffect(() => {
    if (!textureLoaderRef.current || !screenMatRef.current) return;

    if (activeProjectImage) {
      textureLoaderRef.current.load(
        activeProjectImage,
        (tex) => {
          tex.generateMipmaps = true;
          tex.colorSpace = THREE.SRGBColorSpace;
          if (currentTextureRef.current) {
            currentTextureRef.current.dispose();
          }
          currentTextureRef.current = tex;
          if (screenMatRef.current) {
            screenMatRef.current.map = tex;
            screenMatRef.current.needsUpdate = true;
          }
        },
        undefined,
        (err) => {
          console.warn('Failed to load project texture on phone screen:', err);
        }
      );
    }
  }, [activeProjectImage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    textureLoaderRef.current = textureLoader;

    // Studio Reflection Map
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
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const envMat = new THREE.MeshBasicMaterial({ map: envTex, side: THREE.BackSide });
    envScene.add(new THREE.Mesh(envGeo, envMat));
    scene.environment = pmrem.fromScene(envScene).texture;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const redBackLight = new THREE.DirectionalLight(0xf20d16, 2.5);
    redBackLight.position.set(-3, -2, -2);
    scene.add(redBackLight);

    // Phone Model Group
    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);

    phoneGroup.rotation.y = -0.15;
    phoneGroup.rotation.x = 0.08;

    // 1. Phone Body Geometry
    const phoneWidth = 1.95;
    const phoneHeight = 3.95;
    const phoneDepth = 0.16;
    const cornerRadius = 0.28;

    const shape = new THREE.Shape();
    const x = -phoneWidth / 2;
    const y = -phoneHeight / 2;
    shape.moveTo(x + cornerRadius, y);
    shape.lineTo(x + phoneWidth - cornerRadius, y);
    shape.quadraticCurveTo(x + phoneWidth, y, x + phoneWidth, y + cornerRadius);
    shape.lineTo(x + phoneWidth, y + phoneHeight - cornerRadius);
    shape.quadraticCurveTo(x + phoneWidth, y + phoneHeight, x + phoneWidth - cornerRadius, y + phoneHeight);
    shape.lineTo(x + cornerRadius, y + phoneHeight);
    shape.quadraticCurveTo(x, y + phoneHeight, x, y + phoneHeight - cornerRadius);
    shape.lineTo(x, y + cornerRadius);
    shape.quadraticCurveTo(x, y, x + cornerRadius, y);

    const extrudeSettings = {
      depth: phoneDepth,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };

    const phoneGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    phoneGeo.center();

    // Dark Titanium Chassis Material
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x161622,
      metalness: 0.95,
      roughness: 0.16,
      envMapIntensity: 2.4,
    });
    const phoneMesh = new THREE.Mesh(phoneGeo, frameMat);
    phoneGroup.add(phoneMesh);

    // 2. High-res Screen Texture Canvas Fallback / Initial State
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 1024;
    const sCtx = screenCanvas.getContext('2d')!;

    // Screen Background
    sCtx.fillStyle = '#080713';
    sCtx.fillRect(0, 0, 512, 1024);

    // Status Bar
    sCtx.fillStyle = '#FFFFFF';
    sCtx.font = '600 24px -apple-system, sans-serif';
    sCtx.fillText('9:41', 48, 54);
    sCtx.fillRect(430, 38, 36, 18);
    sCtx.fillRect(468, 42, 4, 10);

    // Dynamic Island
    sCtx.beginPath();
    sCtx.roundRect(180, 28, 152, 38, 19);
    sCtx.fillStyle = '#000000';
    sCtx.fill();

    // Red Hero Banner Card
    sCtx.beginPath();
    sCtx.roundRect(32, 100, 448, 360, 24);
    sCtx.fillStyle = '#F20D16';
    sCtx.fill();

    sCtx.fillStyle = '#FFFFFF';
    sCtx.font = '800 36px Syne, sans-serif';
    sCtx.fillText(appName.toUpperCase(), 60, 170);
    sCtx.font = '400 20px system-ui, sans-serif';
    sCtx.fillText('Flutter Mobile Application', 60, 215);

    // Pill
    sCtx.beginPath();
    sCtx.roundRect(60, 260, 180, 44, 22);
    sCtx.fillStyle = '#FFFFFF';
    sCtx.fill();
    sCtx.fillStyle = '#080713';
    sCtx.font = '700 16px system-ui, sans-serif';
    sCtx.fillText('TAP TO INSPECT →', 78, 288);

    // Bottom App Screen Mockup
    sCtx.beginPath();
    sCtx.roundRect(32, 490, 448, 440, 24);
    sCtx.fillStyle = '#121124';
    sCtx.fill();

    sCtx.fillStyle = '#FFFFFF';
    sCtx.font = '700 24px Syne, sans-serif';
    sCtx.fillText('60FPS FLUID MOTION', 60, 560);
    sCtx.fillStyle = '#A69F99';
    sCtx.font = '400 18px system-ui, sans-serif';
    sCtx.fillText('Native Touch Ergonomics', 60, 600);

    // Home indicator
    sCtx.beginPath();
    sCtx.roundRect(176, 990, 160, 6, 3);
    sCtx.fillStyle = '#FFFFFF';
    sCtx.fill();

    const initialScreenTex = new THREE.CanvasTexture(screenCanvas);
    initialScreenTex.generateMipmaps = true;
    currentTextureRef.current = initialScreenTex;

    // Screen plane
    const screenGeo = new THREE.PlaneGeometry(phoneWidth * 0.94, phoneHeight * 0.95);
    const screenMat = new THREE.MeshBasicMaterial({ map: initialScreenTex });
    screenMatRef.current = screenMat;
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = phoneDepth / 2 + 0.045;
    phoneGroup.add(screenMesh);

    // Load initial project image if provided
    if (activeProjectImage) {
      textureLoader.load(activeProjectImage, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        screenMat.map = tex;
        screenMat.needsUpdate = true;
      });
    }

    // Screen Glass Gloss Layer (Optimized glass reflection)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      roughness: 0.04,
      metalness: 0.1,
      envMapIntensity: 2.2,
    });
    const glassMesh = new THREE.Mesh(screenGeo, glassMat);
    glassMesh.position.z = phoneDepth / 2 + 0.05;
    phoneGroup.add(glassMesh);

    // Camera bump on back
    const camBumpGeo = new THREE.BoxGeometry(0.85, 0.85, 0.08);
    const camBump = new THREE.Mesh(camBumpGeo, frameMat);
    camBump.position.set(0.42, 1.25, -phoneDepth / 2 - 0.04);
    phoneGroup.add(camBump);

    // Dual Camera Lenses
    const lensGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.06, 24);
    lensGeo.rotateX(Math.PI / 2);
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0x050508,
      metalness: 0.9,
      roughness: 0.1,
    });
    const lens1 = new THREE.Mesh(lensGeo, lensMat);
    lens1.position.set(0.42, 1.45, -phoneDepth / 2 - 0.08);
    phoneGroup.add(lens1);

    const lens2 = new THREE.Mesh(lensGeo, lensMat);
    lens2.position.set(0.42, 1.05, -phoneDepth / 2 - 0.08);
    phoneGroup.add(lens2);

    // Soft Radial Shadow
    const shadowGeo = new THREE.PlaneGeometry(3.6, 4.8);
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 128;
    sCanvas.height = 128;
    const sC = sCanvas.getContext('2d')!;
    const sg = sC.createRadialGradient(64, 64, 15, 64, 64, 64);
    sg.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    sg.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sC.fillStyle = sg;
    sC.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(sCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.55 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.position.set(0.4, -0.2, -0.6);
    shadow.scale.set(1, 0.8, 1);
    scene.add(shadow);

    // Mouse tilt interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.45;
      mouseRef.current.targetY = y * 0.45;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // IntersectionObserver to pause rendering when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          renderer.render(scene, camera);
        }
      },
      { rootMargin: '150px' }
    );
    observer.observe(container);

    // Initial render pass so the canvas is never blank or uninitialized
    renderer.render(scene, camera);

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = clock.getElapsedTime();

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      phoneGroup.position.y = Math.sin(t * 1.6) * 0.12;
      phoneGroup.position.x = Math.cos(t * 1.2) * 0.05;

      phoneGroup.rotation.y = -0.15 + mouseRef.current.x * 0.45;
      phoneGroup.rotation.x = 0.08 + mouseRef.current.y * 0.3;
      phoneGroup.rotation.z = Math.sin(t * 1.4) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      pmrem.dispose();
      envTex.dispose();
      if (currentTextureRef.current) currentTextureRef.current.dispose();
      initialScreenTex.dispose();
      shadowTex.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={`w-full h-full relative ${className}`} />;
};
