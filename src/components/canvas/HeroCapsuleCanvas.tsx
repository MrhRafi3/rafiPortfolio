import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroCapsuleCanvasProps {
  className?: string;
  interactive?: boolean;
}

export const HeroCapsuleCanvas: React.FC<HeroCapsuleCanvasProps> = ({
  className = '',
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);

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

    // 2. High-quality Studio Environment Reflection Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    const envGeo = new THREE.SphereGeometry(10, 32, 32);
    // Gradient canvas for studio environment
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ctx = envCanvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#A0A5B5');
    grad.addColorStop(0.5, '#202028');
    grad.addColorStop(0.7, '#08080C');
    grad.addColorStop(1, '#020204');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Add bright studio light strips
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(80, 40, 90, 40);
    ctx.fillRect(320, 60, 110, 35);
    ctx.fillStyle = '#F20D16';
    ctx.fillRect(220, 100, 70, 30);

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    const envMat = new THREE.MeshBasicMaterial({
      map: envTexture,
      side: THREE.BackSide,
    });
    const envMesh = new THREE.Mesh(envGeo, envMat);
    envScene.add(envMesh);

    const envMap = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envMap;

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const redRimLight = new THREE.DirectionalLight(0xf20d16, 4.0);
    redRimLight.position.set(-6, -3, -3);
    scene.add(redRimLight);

    const fillLight = new THREE.PointLight(0xffffff, 2.0, 10);
    fillLight.position.set(0, -2, 4);
    scene.add(fillLight);

    // 4. Construct Capsule Object
    const capsuleGroup = new THREE.Group();
    scene.add(capsuleGroup);

    // Initial tilt matching the reference video (tilted ~35 degrees diagonally)
    capsuleGroup.rotation.z = -Math.PI / 4.8;
    capsuleGroup.rotation.x = 0.45;
    capsuleGroup.rotation.y = 0.35;

    // A. Main Chrome Chassis Body
    const bodyLength = 3.6;
    const bodyRadius = 1.05;
    const bodyGeo = new THREE.CapsuleGeometry(bodyRadius, bodyLength, 32, 64);
    bodyGeo.scale(1, 0.48, 0.65); // Aerodynamic flat pill shape

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe6e6e6,
      metalness: 0.95,
      roughness: 0.12,
      envMapIntensity: 2.2,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, chromeMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    capsuleGroup.add(bodyMesh);

    // B. Inner Cockpit / Chassis Cavity
    const innerCavityGeo = new THREE.CapsuleGeometry(bodyRadius * 0.88, bodyLength * 0.75, 24, 32);
    innerCavityGeo.scale(0.85, 0.42, 0.55);
    innerCavityGeo.rotateZ(Math.PI / 2);
    const darkInteriorMat = new THREE.MeshStandardMaterial({
      color: 0x0f1118,
      metalness: 0.8,
      roughness: 0.3,
    });
    const innerMesh = new THREE.Mesh(innerCavityGeo, darkInteriorMat);
    capsuleGroup.add(innerMesh);

    // C. Iconic Red Turbine Rotor inside (seen in reference video!)
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(-0.85, 0.05, 0.12);

    const turbineHousingGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.15, 32);
    turbineHousingGeo.rotateX(Math.PI / 2);
    const redLacquerMat = new THREE.MeshStandardMaterial({
      color: 0xf20d16,
      metalness: 0.4,
      roughness: 0.18,
      envMapIntensity: 1.8,
    });
    const turbineMesh = new THREE.Mesh(turbineHousingGeo, redLacquerMat);
    rotorGroup.add(turbineMesh);

    // Rotor Blades
    const bladeGeo = new THREE.BoxGeometry(0.08, 0.45, 0.02);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.2,
    });
    for (let i = 0; i < 8; i++) {
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.rotation.z = (i * Math.PI) / 4;
      rotorGroup.add(blade);
    }

    // Chrome Center Spinner Hub
    const hubGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const hubMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.08,
    });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.position.z = 0.1;
    rotorGroup.add(hub);

    capsuleGroup.add(rotorGroup);

    // D. Mechanical Core & Conduits (Right Side)
    const coreCylinderGeo = new THREE.CylinderGeometry(0.28, 0.28, 1.4, 24);
    coreCylinderGeo.rotateZ(Math.PI / 2);
    const blackTechMat = new THREE.MeshStandardMaterial({
      color: 0x111116,
      metalness: 0.85,
      roughness: 0.35,
    });
    const coreCylinder = new THREE.Mesh(coreCylinderGeo, blackTechMat);
    coreCylinder.position.set(0.65, 0.05, 0.08);
    capsuleGroup.add(coreCylinder);

    // Detail Copper Coils / Rings
    const ringGeo = new THREE.TorusGeometry(0.32, 0.035, 16, 32);
    ringGeo.rotateY(Math.PI / 2);
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xd97c48,
      metalness: 0.95,
      roughness: 0.2,
    });
    for (let r = 0; r < 4; r++) {
      const ring = new THREE.Mesh(ringGeo, copperMat);
      ring.position.set(0.2 + r * 0.3, 0.05, 0.08);
      capsuleGroup.add(ring);
    }

    // E. Outer Transparent Canopy Dome (Optimized high-performance glass)
    const canopyGeo = new THREE.CapsuleGeometry(bodyRadius * 0.96, bodyLength * 0.92, 24, 24);
    canopyGeo.scale(0.92, 0.44, 0.62);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.38,
      roughness: 0.08,
      metalness: 0.15,
      ior: 1.45,
      envMapIntensity: 2.2,
    });
    const canopyMesh = new THREE.Mesh(canopyGeo, glassMat);
    canopyMesh.position.set(0, 0.05, 0.1);
    capsuleGroup.add(canopyMesh);

    // F. Exterior Protective Tubular Cage Ribs (Seen wrapping around the top in the reference video!)
    const cageMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.98,
      roughness: 0.1,
    });

    const ribCurve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.8, -0.1, 0.1),
      new THREE.Vector3(-0.9, 0.65, 0.35),
      new THREE.Vector3(0.9, 0.65, 0.35),
      new THREE.Vector3(1.8, -0.1, 0.1),
    ]);
    const ribGeo1 = new THREE.TubeGeometry(ribCurve1, 48, 0.032, 8, false);
    const rib1 = new THREE.Mesh(ribGeo1, cageMaterial);
    capsuleGroup.add(rib1);

    const ribCurve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.7, 0.0, -0.1),
      new THREE.Vector3(-0.8, 0.55, 0.55),
      new THREE.Vector3(0.8, 0.55, 0.55),
      new THREE.Vector3(1.7, 0.0, -0.1),
    ]);
    const ribGeo2 = new THREE.TubeGeometry(ribCurve2, 48, 0.028, 8, false);
    const rib2 = new THREE.Mesh(ribGeo2, cageMaterial);
    capsuleGroup.add(rib2);

    // Cross brace arches
    for (let c = -1; c <= 1; c++) {
      const archCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(c * 0.7, -0.2, 0.45),
        new THREE.Vector3(c * 0.7, 0.65, 0.45),
        new THREE.Vector3(c * 0.7, 0.35, -0.3),
      ]);
      const archGeo = new THREE.TubeGeometry(archCurve, 32, 0.024, 8, false);
      const arch = new THREE.Mesh(archGeo, cageMaterial);
      capsuleGroup.add(arch);
    }

    // G. Soft Drop Shadow Floor Plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 64);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    sGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.25)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.set(0.3, -1.8, -1.0);
    shadowPlane.rotation.x = -Math.PI / 2.2;
    shadowPlane.scale.set(0.9, 0.45, 1);
    scene.add(shadowPlane);

    // 5. Mouse Interaction Handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.6;
      mouseRef.current.targetY = y * 0.6;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // 6. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 7. Visibility Observer & Animation Loop
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

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Floating oscillation
      const floatY = Math.sin(elapsedTime * 1.8) * 0.14;
      const floatX = Math.cos(elapsedTime * 1.2) * 0.08;
      const floatRoll = Math.sin(elapsedTime * 1.4) * 0.06;

      capsuleGroup.position.y = floatY + mouseRef.current.y * 0.4;
      capsuleGroup.position.x = floatX + mouseRef.current.x * 0.4;

      // Rotation response
      capsuleGroup.rotation.z = -Math.PI / 4.8 + floatRoll + mouseRef.current.x * 0.25;
      capsuleGroup.rotation.x = 0.45 + mouseRef.current.y * 0.25;

      // Spin internal turbine rotor
      rotorGroup.rotation.z = elapsedTime * 4.5;

      // Shadow tracks position and pulses
      shadowPlane.position.x = capsuleGroup.position.x * 0.8 + 0.3;
      shadowPlane.scale.set(
        0.9 + Math.sin(elapsedTime * 1.8) * 0.05,
        0.45 + Math.sin(elapsedTime * 1.8) * 0.02,
        1
      );

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      pmremGenerator.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return <div ref={containerRef} className={`w-full h-full relative ${className}`} />;
};
