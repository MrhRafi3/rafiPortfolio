import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

const gltfLoader = new GLTFLoader();
const cache = new Map<string, Promise<GLTF>>();

/**
 * Loads a GLB model with memory-level promise caching.
 * Prevents multiple duplicate network requests and re-parsing.
 */
export function loadCachedGLB(url: string): Promise<GLTF> {
  if (cache.has(url)) {
    return cache.get(url)!;
  }

  const loadPromise = new Promise<GLTF>((resolve, reject) => {
    gltfLoader.load(
      url,
      (gltf) => {
        resolve(gltf);
      },
      undefined,
      (err) => {
        console.warn(`Failed to load GLB: ${url}`, err);
        cache.delete(url); // allow retry on failure
        reject(err);
      }
    );
  });

  cache.set(url, loadPromise);
  return loadPromise;
}

/**
 * Clones a cached GLTF scene hierarchy cleanly.
 */
export function cloneGLTFScene(scene: THREE.Group): THREE.Group {
  return SkeletonUtils.clone(scene) as THREE.Group;
}
