import { Observable } from 'rxjs/Observable';
import { MaterialCreator, Object3D } from 'three';
//@ts-ignore
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader';
import * as THREE from 'three';


interface ISceneObjects {
  model: Object3D
}


export class SceneObjects implements ISceneObjects {
  model: Object3D;

  constructor(model: Object3D) {
    this.model = model;
  }

  public static getModelObservable(materialURL: string, modelURL: string): Observable<any> {
    return new Observable((observer: any) => {
      const mtlLoader = new MTLLoader();
      mtlLoader.setTexturePath('/models/');
      mtlLoader.load(materialURL, (materials: MaterialCreator) => {
        materials.preload();
        let alphaMap = new THREE.TextureLoader().load('/models/DB2X2_L02_NRM.png');
        materials.materials['DB2X2_L01'].bumpMap = alphaMap;
        materials.materials['DB2X2_L01'].bumpScale = 3;
        // materials.materials['DB2X2_L01'].transparent = true;
        materials.materials['DB2X2_L01'].alphaTest = 0.5;
        // let test = new THREE.MeshStandardMaterial(materials);
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(modelURL, (object: any) => {
          observer.next(object);
        });
      });
    });
  }


}
