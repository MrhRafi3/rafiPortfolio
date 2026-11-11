import * as THREE from 'three';

export interface GroundShadowOptions {
  width?: number;
  height?: number;
  opacity?: number;
  yPosition?: number;
  innerRadius?: number;
  outerRadius?: number;
  color?: string;
}

export interface GroundShadowResult {
  mesh: THREE.Mesh;
  dispose: () => void;
}

export function createSoftGroundShadow(options: GroundShadowOptions = {}): GroundShadowResult {
  const {
    width = 4.0,
    height = 2.4,
    opacity = 0.55,
    yPosition = -1.35,
    innerRadius = 15,
    outerRadius = 90,
    color = '0, 0, 0',
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(128, 128, innerRadius, 128, 128, outerRadius);
  gradient.addColorStop(0, `rgba(${color}, 0.85)`);
  gradient.addColorStop(0.35, `rgba(${color}, 0.45)`);
  gradient.addColorStop(0.7, `rgba(${color}, 0.15)`);
  gradient.addColorStop(1, `rgba(${color}, 0)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;

  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, yPosition, 0);

  return {
    mesh,
    dispose: () => {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    },
  };
}
