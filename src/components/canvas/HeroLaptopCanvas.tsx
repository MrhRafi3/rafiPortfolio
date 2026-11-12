import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { loadCachedGLB } from '../../utils/glbCache';
import { create3DViewerController, ViewerController } from '../../utils/create3DViewerController';
import { createSoftGroundShadow } from '../../utils/createSoftGroundShadow';
import { createStudioEnvMap } from '../../utils/createStudioEnvMap';

interface HeroLaptopCanvasProps {
  className?: string;
  interactive?: boolean;
}

// Physical display dimensions in Object_6 local space (exact 16:10 matching Mac screenshot)
const SCREEN_WIDTH = 29.6;
const SCREEN_HEIGHT = 18.5;
const SCREEN_CORNER_RADIUS = 0.16;
const SCREEN_CENTER_Y = 11.5;
const SCREEN_LOCAL_Z = -10.775;
const SCREEN_TEXTURE_URL = '/images/glb_model/hero-macbook-screen.webp';

function createMacBookDisplayGeometry(
  width: number,
  height: number,
  radius: number
): THREE.BufferGeometry {
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

  const geometry = new THREE.ShapeGeometry(shape, 10);
  const pos = geometry.attributes.position;
  const uvs = new Float32Array(pos.count * 2);

  for (let i = 0; i < pos.count; i++) {
    uvs[i * 2] = (pos.getX(i) - x0) / width;
    uvs[i * 2 + 1] = (pos.getY(i) - y0) / height;
  }

  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  return geometry;
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

    const width = container.clientWidth || 760;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.04, 5.75);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const studioEnv = createStudioEnvMap(renderer, '#9DA3B4', 40);
    scene.environment = studioEnv.envMap;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.1);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(-4, -1, 3);
    scene.add(fillLight);

    const redRimLight = new THREE.DirectionalLight(0xf20d16, 2.4);
    redRimLight.position.set(-3, -3, -2);
    scene.add(redRimLight);

    const shadow = createSoftGroundShadow({
      width: 5.4,
      height: 3.2,
      opacity: 0.5,
      yPosition: -1.3,
    });
    scene.add(shadow.mesh);

    const laptopGroup = new THREE.Group();
    scene.add(laptopGroup);

    const baseRotX = 0.34;
    const baseRotY = -0.46;
    const baseRotZ = -0.07;

    let isDisposed = false;
    let screenTexture: THREE.Texture | null = null;

    const screenGeo = createMacBookDisplayGeometry(
      SCREEN_WIDTH,
      SCREEN_HEIGHT,
      SCREEN_CORNER_RADIUS
    );
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x050508,
      emissive: 0xffffff,
      emissiveIntensity: 0.92,
      roughness: 0.14,
      metalness: 0.0,
      envMapIntensity: 0.18,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.name = 'hero-macbook-display';
    screenMesh.position.set(0, SCREEN_CENTER_Y, SCREEN_LOCAL_Z);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      SCREEN_TEXTURE_URL,
      (loadedTex) => {
        if (isDisposed) {
          loadedTex.dispose();
          return;
        }
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.generateMipmaps = true;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTex.magFilter = THREE.LinearFilter;
        loadedTex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
        loadedTex.wrapS = THREE.ClampToEdgeWrapping;
        loadedTex.wrapT = THREE.ClampToEdgeWrapping;
        loadedTex.needsUpdate = true;

        if (screenTexture && screenTexture !== loadedTex) {
          screenTexture.dispose();
        }
        screenTexture = loadedTex;
        screenMat.emissiveMap = loadedTex;
        screenMat.needsUpdate = true;
        controller.requestRender();
      },
      undefined,
      (err) => console.warn('HeroLaptopCanvas screen texture load error:', err)
    );

    loadCachedGLB('/images/glb_model/macbook.glb')
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
        const targetScale = 2.75 / (maxDim || 1);
        wrapper.scale.setScalar(targetScale);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.envMapIntensity = 1.75;
              mat.needsUpdate = true;
            }
          }
        });

        const displayHost = model.getObjectByName('Object_6') ?? model;
        displayHost.add(screenMesh);

        laptopGroup.add(wrapper);
        controller.requestRender();
      })
      .catch((err) => console.warn('HeroLaptopCanvas load error:', err));

    // Demand-based 360° controller: renders only on load, drag, inertia, reset, and resize
    const controller = create3DViewerController({
      container,
      targetGroup: laptopGroup,
      camera,
      renderer,
      scene,
      initialRotation: [baseRotX, baseRotY, baseRotZ],
      initialPosition: [0, 0.06, 0],
      verticalClamp: [-Math.PI / 3, Math.PI / 3],
      sensitivity: 0.0055,
      inertiaDamping: 0.92,
      enableFloating: false,
      onResize: (_w, _h, aspect) => {
        // Keep full laptop + bottom edge unclipped across narrow mobile and wide desktop stages
        const distanceScale = aspect < 1.38 ? 1.38 / Math.max(aspect, 0.72) : 1;
        camera.position.set(0, 0.04, Math.min(8.6, 5.75 * distanceScale));
      },
      onRender: () => {
        shadow.mesh.position.x = laptopGroup.position.x * 0.4;
      },
    });

    controller.setInteractive(interactive);
    controller.start();
    controllerRef.current = controller;

    const hintTimer = setTimeout(() => setHintVisible(false), 5000);

    return () => {
      isDisposed = true;
      clearTimeout(hintTimer);
      controller.dispose();
      controllerRef.current = null;

      screenMesh.parent?.remove(screenMesh);
      if (screenTexture) {
        screenTexture.dispose();
        screenTexture = null;
      }
      screenGeo.dispose();
      screenMat.dispose();
      shadow.dispose();
      studioEnv.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className}`}>
      <div
        className={`absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#080713]/85 border border-white/15 text-[#F1EBDD] font-tech text-[10px] tracking-wider uppercase backdrop-blur-md pointer-events-none transition-opacity duration-700 whitespace-nowrap shadow-md flex items-center gap-2 ${
          hintVisible ? 'opacity-90' : 'opacity-0'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#F20D16]" />
        <span>Drag to rotate 360°</span>
      </div>
    </div>
  );
};
