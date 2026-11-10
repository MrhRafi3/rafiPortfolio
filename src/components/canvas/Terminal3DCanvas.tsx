import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Terminal3DCanvasProps {
  className?: string;
}

export const Terminal3DCanvas: React.FC<Terminal3DCanvasProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(3.8, 3.2, 5.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

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
    g.addColorStop(0.5, '#303038');
    g.addColorStop(1, '#080713');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 128);
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const envMat = new THREE.MeshBasicMaterial({ map: envTex, side: THREE.BackSide });
    envScene.add(new THREE.Mesh(envGeo, envMat));
    scene.environment = pmrem.fromScene(envScene).texture;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    const redCodeGlow = new THREE.PointLight(0xf20d16, 5.0, 6);
    redCodeGlow.position.set(0, 0.4, 0);
    scene.add(redCodeGlow);

    // Main Group
    const group = new THREE.Group();
    scene.add(group);

    // 1. Base Beveled Tray
    const trayGeo = new THREE.BoxGeometry(2.6, 0.16, 2.4);
    const trayMat = new THREE.MeshStandardMaterial({
      color: 0xf1ebdd,
      metalness: 0.2,
      roughness: 0.35,
    });
    const tray = new THREE.Mesh(trayGeo, trayMat);
    tray.position.y = -0.55;
    group.add(tray);

    // 2. Inner Console Deck
    const deckGeo = new THREE.BoxGeometry(2.3, 0.25, 2.1);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x12131a,
      metalness: 0.9,
      roughness: 0.25,
    });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.y = -0.38;
    group.add(deck);

    // 3. Mini Keyboard Grid
    const keyMat = new THREE.MeshStandardMaterial({ color: 0x222430, roughness: 0.4 });
    const keyGeo = new THREE.BoxGeometry(0.12, 0.05, 0.12);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        const key = new THREE.Mesh(keyGeo, keyMat);
        key.position.set(-0.6 + c * 0.17, -0.22, 0.35 + r * 0.18);
        group.add(key);
      }
    }

    // 4. Floating Holographic Glowing Code glyph `< / >`
    const glyphGroup = new THREE.Group();
    glyphGroup.position.set(0, 0.35, -0.15);

    const redGlowMat = new THREE.MeshStandardMaterial({
      color: 0xf20d16,
      emissive: 0xf20d16,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });

    // Left bracket `<`
    const leftBracket = new THREE.Group();
    const seg1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.08), redGlowMat);
    seg1.rotation.z = Math.PI / 4;
    seg1.position.set(0.15, 0.15, 0);
    const seg2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.08), redGlowMat);
    seg2.rotation.z = -Math.PI / 4;
    seg2.position.set(0.15, -0.15, 0);
    leftBracket.add(seg1, seg2);
    leftBracket.position.x = -0.65;
    glyphGroup.add(leftBracket);

    // Slash `/`
    const slash = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.75, 0.08), redGlowMat);
    slash.rotation.z = -Math.PI / 6;
    glyphGroup.add(slash);

    // Right bracket `>`
    const rightBracket = new THREE.Group();
    const seg3 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.08), redGlowMat);
    seg3.rotation.z = -Math.PI / 4;
    seg3.position.set(-0.15, 0.15, 0);
    const seg4 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.08), redGlowMat);
    seg4.rotation.z = Math.PI / 4;
    seg4.position.set(-0.15, -0.15, 0);
    rightBracket.add(seg3, seg4);
    rightBracket.position.x = 0.65;
    glyphGroup.add(rightBracket);

    group.add(glyphGroup);

    // 5. Smoked Glass Protective Enclosure / Casing (Optimized glass)
    const glassCasingGeo = new THREE.BoxGeometry(2.0, 1.4, 1.8);
    const smokedGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x222228,
      transparent: true,
      opacity: 0.35,
      roughness: 0.12,
      metalness: 0.2,
      ior: 1.5,
    });
    const glassCasing = new THREE.Mesh(glassCasingGeo, smokedGlassMat);
    glassCasing.position.set(0, 0.3, -0.1);
    group.add(glassCasing);

    // Soft Shadow
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 128;
    sCanvas.height = 128;
    const sCtx = sCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 64);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(sCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.6 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.65;
    scene.add(shadow);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.4;
      mouseRef.current.targetY = y * 0.4;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Visibility Observer to pause offscreen RAF rendering
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

    // Initial render pass
    renderer.render(scene, camera);

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = clock.getElapsedTime();

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      group.position.y = Math.sin(t * 1.5) * 0.08;
      group.rotation.y = mouseRef.current.x * 0.35;
      group.rotation.x = mouseRef.current.y * 0.2;

      // Glow pulse
      glyphGroup.position.y = 0.35 + Math.sin(t * 2.2) * 0.05;
      redCodeGlow.intensity = 4.0 + Math.sin(t * 3.0) * 1.5;

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
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={`w-full h-full relative ${className}`} />;
};
