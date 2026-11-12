import * as THREE from 'three';

export interface StudioEnvMapResult {
  envMap: THREE.Texture;
  dispose: () => void;
}

/**
 * Generates a lightweight studio reflection environment map for metallic GLB materials.
 */
export function createStudioEnvMap(
  renderer: THREE.WebGLRenderer,
  midColor = '#707585',
  accentWidth = 50
): StudioEnvMapResult {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  const envGeo = new THREE.SphereGeometry(10, 12, 12);
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 128;
  envCanvas.height = 64;

  const ctx = envCanvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, 64);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.35, midColor);
  grad.addColorStop(0.65, '#141320');
  grad.addColorStop(1, '#05050A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 64);

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(16, 10, 36, 10);
  ctx.fillRect(78, 14, 32, 10);
  ctx.fillStyle = '#F20D16';
  ctx.fillRect(54, 24, accentWidth * 0.5, 8);

  const envTexture = new THREE.CanvasTexture(envCanvas);
  envTexture.mapping = THREE.EquirectangularReflectionMapping;
  const envMat = new THREE.MeshBasicMaterial({ map: envTexture, side: THREE.BackSide });
  envScene.add(new THREE.Mesh(envGeo, envMat));

  const envMap = pmremGenerator.fromScene(envScene).texture;

  // Source geometry/texture only needed to bake PMREM
  envTexture.dispose();
  envMat.dispose();
  envGeo.dispose();
  pmremGenerator.dispose();

  return {
    envMap,
    dispose: () => {
      envMap.dispose();
    },
  };
}
