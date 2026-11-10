import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Rocket3DCanvasProps {
  className?: string;
}

export const Rocket3DCanvas: React.FC<Rocket3DCanvasProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

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
    camera.position.set(0, 0, 7.0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.appendChild(renderer.domElement);

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
    g.addColorStop(0.4, '#404555');
    g.addColorStop(1, '#080713');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(60, 20, 100, 30);
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const envMat = new THREE.MeshBasicMaterial({ map: envTex, side: THREE.BackSide });
    envScene.add(new THREE.Mesh(envGeo, envMat));
    scene.environment = pmrem.fromScene(envScene).texture;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const redAccentLight = new THREE.DirectionalLight(0xf20d16, 3.0);
    redAccentLight.position.set(-4, -2, -2);
    scene.add(redAccentLight);

    const thrusterGlow = new THREE.PointLight(0xff4422, 4.0, 5);
    thrusterGlow.position.set(0, -2.2, 0);
    scene.add(thrusterGlow);

    // Rocket Group
    const rocketGroup = new THREE.Group();
    scene.add(rocketGroup);

    // Angle as seen in video (tilted ~25 degrees towards upper right)
    rocketGroup.rotation.z = -Math.PI / 7;
    rocketGroup.rotation.x = 0.2;
    rocketGroup.rotation.y = 0.25;

    // 1. Aerodynamic Fuselage (White Satin Finish)
    // Custom lathe curve for classic retro-futuristic rocket body
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.48, -1.8)); // Engine base
    points.push(new THREE.Vector2(0.68, -1.2));
    points.push(new THREE.Vector2(0.85, -0.4));
    points.push(new THREE.Vector2(0.92, 0.4));  // Widest mid-section
    points.push(new THREE.Vector2(0.84, 1.1));
    points.push(new THREE.Vector2(0.65, 1.7));  // Transition to nose
    points.push(new THREE.Vector2(0.01, 2.7));  // Tip

    const bodyGeo = new THREE.LatheGeometry(points, 48);
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xfcfcfc,
      metalness: 0.15,
      roughness: 0.22,
      envMapIntensity: 1.8,
    });
    const body = new THREE.Mesh(bodyGeo, whiteMat);
    rocketGroup.add(body);

    // 2. High-Gloss Red Nose Cone
    const nosePoints: THREE.Vector2[] = [];
    nosePoints.push(new THREE.Vector2(0.65, 1.7));
    nosePoints.push(new THREE.Vector2(0.48, 2.1));
    nosePoints.push(new THREE.Vector2(0.25, 2.45));
    nosePoints.push(new THREE.Vector2(0.01, 2.72));
    const noseGeo = new THREE.LatheGeometry(nosePoints, 48);
    const redGlossMat = new THREE.MeshStandardMaterial({
      color: 0xf20d16,
      metalness: 0.4,
      roughness: 0.12,
      envMapIntensity: 2.2,
    });
    const nose = new THREE.Mesh(noseGeo, redGlossMat);
    rocketGroup.add(nose);

    // 3. Iconic Circular Chrome Porthole Window
    const portholeGroup = new THREE.Group();
    portholeGroup.position.set(0, 0.65, 0.88);

    const frameGeo = new THREE.TorusGeometry(0.32, 0.05, 16, 32);
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.98,
      roughness: 0.08,
      envMapIntensity: 2.5,
    });
    const portholeFrame = new THREE.Mesh(frameGeo, chromeMat);
    portholeGroup.add(portholeFrame);

    const glassGeo = new THREE.CircleGeometry(0.28, 32);
    const windowGlassMat = new THREE.MeshStandardMaterial({
      color: 0x111624,
      roughness: 0.1,
      metalness: 0.85,
    });
    const portholeGlass = new THREE.Mesh(glassGeo, windowGlassMat);
    portholeGroup.add(portholeGlass);

    rocketGroup.add(portholeGroup);

    // 4. Stabilizing Red Aerodynamic Fins (3 fins symmetrically placed)
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.9, -0.6);
    finShape.quadraticCurveTo(0.85, -0.9, 0.2, -0.85);
    finShape.lineTo(0, -0.4);
    finShape.closePath();

    const finExtrude = { depth: 0.06, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 };
    const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrude);
    finGeo.center();

    for (let i = 0; i < 3; i++) {
      const fin = new THREE.Mesh(finGeo, redGlossMat);
      const angle = (i * Math.PI * 2) / 3;
      fin.position.set(Math.cos(angle) * 0.88, -1.35, Math.sin(angle) * 0.88);
      fin.rotation.y = -angle + Math.PI / 2;
      rocketGroup.add(fin);
    }

    // 5. Thruster Nozzle & Exhaust Glow Ring
    const nozzlePoints: THREE.Vector2[] = [];
    nozzlePoints.push(new THREE.Vector2(0.48, -1.8));
    nozzlePoints.push(new THREE.Vector2(0.55, -2.1));
    nozzlePoints.push(new THREE.Vector2(0.38, -2.12));
    const nozzleGeo = new THREE.LatheGeometry(nozzlePoints, 32);
    const nozzleMat = new THREE.MeshStandardMaterial({
      color: 0x181820,
      metalness: 0.9,
      roughness: 0.3,
    });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    rocketGroup.add(nozzle);

    // Glow Ring
    const ringGeo = new THREE.TorusGeometry(0.45, 0.04, 16, 32);
    ringGeo.rotateX(Math.PI / 2);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xff3311 });
    const glowRing = new THREE.Mesh(ringGeo, glowMat);
    glowRing.position.y = -2.1;
    rocketGroup.add(glowRing);

    // Soft Shadow
    const shadowGeo = new THREE.PlaneGeometry(4.5, 4.5);
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 128;
    sCanvas.height = 128;
    const sC = sCanvas.getContext('2d')!;
    const sg = sC.createRadialGradient(64, 64, 15, 64, 64, 64);
    sg.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    sg.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sC.fillStyle = sg;
    sC.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(sCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.55 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.position.set(0.6, -1.0, -1.2);
    shadow.scale.set(1.2, 0.7, 1);
    scene.add(shadow);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.5;
      mouseRef.current.targetY = y * 0.5;
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

      // Rocket hover thrusting motion
      rocketGroup.position.y = Math.sin(t * 2.0) * 0.15;
      rocketGroup.position.x = Math.cos(t * 1.5) * 0.08;

      rocketGroup.rotation.z = -Math.PI / 7 + mouseRef.current.x * 0.25;
      rocketGroup.rotation.x = 0.2 + mouseRef.current.y * 0.25;

      thrusterGlow.intensity = 3.5 + Math.sin(t * 8.0) * 1.5;

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
