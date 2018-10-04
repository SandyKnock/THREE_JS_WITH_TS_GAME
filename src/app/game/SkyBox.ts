import { CubeTextureLoader, Object3D, TextureLoader } from 'three';
import * as THREE from 'three';


interface ISkyBox {
  model: Object3D
}


export class SkyBox implements ISkyBox {
  private _model: Object3D;
  private _textureCube: Array<string>;
  private _width: number;
  private _height: number;
  private _depth: number;
  private _path: string;

  constructor(path: string,
              textureCube: Array<string>,
              widthCube: number,
              heightCube: number,
              depthCube: number
  ) {
    this._textureCube = textureCube;
    this._width = widthCube;
    this._height = heightCube;
    this._depth = depthCube;
    this._model = new Object3D();
    this._path = path;
  }

  getMaterialShader() {
    let shader = THREE.ShaderLib['cube'];
    shader.uniforms['tCube'].value = this.getTextures();
    return new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide
    });
  }

  getMaterial(){
    let materialArray = [];
    for (let i = 0; i < 6; i++) {
      materialArray.push(new THREE.MeshBasicMaterial({
        map: new TextureLoader().load(this.path + this.textureCube[i]),
        side: THREE.BackSide
      }));
    }
    return materialArray;
  }

  getTextures() {
    return new CubeTextureLoader().setPath(this.path).load(this.textureCube);
  }

  getSkyBoxModel() {
    let material = this.getMaterial();
    this._model = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      material
    );
    return this._model;
  }


  get path(): string {
    return this._path;
  }

  set path(value: string) {
    this._path = value;
  }

  get model(): Object3D {
    return this._model;
  }

  set model(value: Object3D) {
    this._model = value;
  }

  get textureCube(): Array<string> {
    return this._textureCube;
  }

  set textureCube(value: Array<string>) {
    this._textureCube = value;
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
  }

  get depth(): number {
    return this._depth;
  }

  set depth(value: number) {
    this._depth = value;
  }
}
