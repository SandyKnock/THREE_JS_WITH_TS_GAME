import * as THREE from 'three';
import { OrbitControls, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

interface IGameCycle {
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  orbit: OrbitControls
}

export class GameCycle implements IGameCycle {
  private _camera: PerspectiveCamera;
  private _orbit: OrbitControls;
  private _renderer: WebGLRenderer;
  private _scene: Scene;

  constructor(camera: PerspectiveCamera, orbit: OrbitControls, renderer: WebGLRenderer, scene: Scene) {
    this._camera = camera;
    this._orbit = orbit;
    this._renderer = renderer;
    this._scene = scene;
  }

  get camera(): PerspectiveCamera {
    return this._camera;
  }

  set camera(value: PerspectiveCamera) {
    this._camera = value;
  }

  get orbit(): OrbitControls {
    return this._orbit;
  }

  set orbit(value: OrbitControls) {
    this._orbit = value;
  }

  get renderer(): WebGLRenderer {
    return this._renderer;
  }

  set renderer(value: WebGLRenderer) {
    this._renderer = value;
  }

  get scene(): Scene {
    return this._scene;
  }

  set scene(value: Scene) {
    this._scene = value;
  }

  setSettingsCamera(fov: number, aspect: number, near: number, far: number) {
    this._camera.fov = fov;
    this._camera.aspect = aspect;
    this._camera.near = near;
    this._camera.far = far;
    return this._camera;
  }

  onWindowResize() {
    let resize = () => {
      const SCREEN_WIDTH = window.innerWidth;
      const SCREEN_HEIGHT = window.innerHeight;
      this._renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      this._camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
      this._camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize, false);
  }

  // gameRender = () => {
  //   this._renderer.render(this._scene, this._camera);
  //   requestAnimationFrame(this.gameRender);
  //   this.orbit.update()
  // };

}
