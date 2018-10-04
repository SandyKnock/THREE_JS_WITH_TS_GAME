import * as THREE from 'three';
import { Mesh, MeshLambertMaterial, PlaneBufferGeometry } from 'three';
import { Observable } from 'rxjs/Observable';

export class Terrain {
  private width: number;
  private height: number;
  // @ts-ignore
  private _mesh: any;
  // @ts-ignore
  private _array: any;
  // @ts-ignore
  private material: MeshLambertMaterial;


  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this._mesh = null;
    this._array = null;
  }

  getPixelData(img: any) {
    let width = img.width;
    let height = img.height;
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      return ctx.getImageData(0, 0, width, width).data;
    } else return null;
  }


  getGeometry(pixels: Uint8ClampedArray, width: number, height: number) {
    let array: any;
    const geometry = new THREE.PlaneBufferGeometry(
      width,
      width,
      width - 1,
      height - 1
    );

    let rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);

    // let width_half = width / 2;
    // let height_half = height / 2;
    //
    // let gridX = Math.floor(width - 1) || 1;
    // let gridY = Math.floor(height - 1) || 1;
    // let gridX1 = gridX + 1;
    // let gridY1 = gridY + 1;
    //
    // let segment_width = width / gridX;
    // let segment_height = height / gridY;
    //
    // let vertices = [];
    //
    // for (let iy = 0; iy < gridY1; iy++) {
    //   let y = iy * segment_height - height_half;
    //   for (let ix = 0; ix < gridX1; ix++) {
    //     let x = ix * segment_width - width_half;
    //     vertices.push(x, -y, 0);
    //   }
    // }
    geometry.applyMatrix(rotation);

    array = geometry.attributes.position.array;
    for (let i = 0; i < width * width; i++) {
      array[i * 3 + 1] = pixels[i * 4] / 256;
    }

    // let indices = [];
    // for (let iy = 0; iy < gridY; iy ++ ) {
    //
    //   for (let ix = 0; ix < gridX; ix ++ ) {
    //
    //     let a = ix + gridX1 * iy;
    //     let b = ix + gridX1 * ( iy + 1 );
    //     let c = ( ix + 1 ) + gridX1 * ( iy + 1 );
    //     let d = ( ix + 1 ) + gridX1 * iy;
    //
    //     // faces
    //
    //     indices.push( a, b, d );
    //     indices.push( b, c, d );
    //
    //   }
    //
    // }
    // geometry.setIndex( indices );
    // geometry.addAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.computeBoundingSphere();
    geometry.computeVertexNormals();

    this._array = geometry.attributes.position.array;
    return geometry;
  }

  getMesh(geometry: PlaneBufferGeometry, material: MeshLambertMaterial): Mesh {
    return new THREE.Mesh(geometry, material);
  }

  getMatirial(textureSrc?: string): MeshLambertMaterial {
    const material = new THREE.MeshLambertMaterial({});
    if (textureSrc) {
      const texture = new THREE.TextureLoader().load(textureSrc);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1081 / 15, 1081 / 15);
      material.setValues({ map: texture });
    }
    return material;
  }

  public getTerrainMesh(src: string, textureSrc?: string): Observable<any> {
    return new Observable((observer: any) => {
      const loader = new THREE.ImageLoader();
      loader.load(src, (img) => {
        const pixels = this.getPixelData(img);
        if (pixels === null) return;
        const geometry = this.getGeometry(pixels, this.width, this.height);
        const material = this.getMatirial(textureSrc);
        // const mesh = this.getMesh(geometry, material);
        this._mesh =  this.getMesh(geometry, material);
        observer.next(this._mesh);
      });
    });
  }


  getHeightAt(x: number, z: number) {
    if (x < 0 || x >= this.width || z < 0 || z >= this.height) {
      return 0;
    } else {
      // Get integer floor of x, z
      let ix = Math.floor(x);
      let iz = Math.floor(z);
      // Get real (fractional) component of x, z
      // This is the amount of each into the cell
      let rx = x - ix;
      let rz = z - iz;
      // Edges of cell
      let a = this._array[(iz * this.width + ix) * 3 + 1];
      let b = this._array[(iz * this.width + (ix + 1)) * 3 + 1];
      let c = this._array[((iz + 1) * this.width + (ix + 1)) * 3 + 1];
      let d = this._array[((iz + 1) * this.width + ix) * 3 + 1];

      // console.log('a=',a,'b=',b,'c=',c,'d=',d)
      // Interpolate top edge (left and right)
      let e = (a * (1 - rx) + b * rx);
      // Interpolate bottom edge (left and right)
      let f = (c * rx + d * (1 - rx));
      // Interpolate between top and bottom
      return (e * (1 - rz) + f * rz);
    }
  }

}
