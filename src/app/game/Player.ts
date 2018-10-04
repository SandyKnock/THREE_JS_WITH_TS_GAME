import * as THREE from 'three';
import { Observable } from 'rxjs/Observable';
import { Object3D } from 'three';
//@ts-ignore
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader';

//@ts-ignore
import annyang from 'annyang';


(window as any).THREE = THREE;
//@ts-ignore
const ColladaLoader = require('three/examples/js/loaders/ColladaLoader.js');

interface IPlayer {
  model: Object3D
}


export class Player implements IPlayer {
  model: Object3D;
  private playerVelocity = new THREE.Vector3();
  private PLAYER_SPEED: number = 100.0;
  private PLAYER_SPEED_ROTATION: number = 800.0;
  private ACCELERATION_OF_GRAVITY = 9.82;

  private controls: any = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    canJump: false
  };

  constructor(model: Object3D) {
    this.model = model;
  }


  public static getModelPromise(materialURL: string, modelURL: string): Promise<Object> {
    return new Promise((resolve, reject) => {
      const mtlLoader = new MTLLoader();
      mtlLoader.load(materialURL, (materials: any) => {
        materials.preload();
        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(modelURL, (object) => {
          resolve(object);
        });
      });
    });
  }


  public static getModelObservable2(materialURL: string, modelURL: string): Observable<any> {
    return new Observable((observer: any) => {
      // const mtlLoader = new MTLLoader();
      // mtlLoader.setTexturePath('/models/');
      // mtlLoader.load(materialURL, (materials: any) => {
      //   materials.preload();
      const objLoader = new THREE.ColladaLoader();
      objLoader.load(modelURL, (collada: any) => {
        console.log('spider', collada);

        // console.log('materialsmaterialsmaterialsmaterialsmaterialsmaterials',materials);
        observer.next(collada);
      });
      // });
    });
  }


  public static getModelObservable(materialURL: string, modelURL: string): Observable<any> {
    return new Observable((observer: any) => {
      const mtlLoader = new MTLLoader();
      mtlLoader.setTexturePath('/models/');
      mtlLoader.load(materialURL, (materials: any) => {
        materials.preload();
        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(modelURL, (object: any) => {
          observer.next(object);
        });
      });
    });
  }

  listenForPlayerMovement() {
    // Listen for when a key is pressed
    // If it's a specified key, mark the direction as true since moving
    // if ('webkitSpeechRecognition' in window) {
    //@ts-ignore
    // let recognition = new window.webkitSpeechRecognition();
    // recognition.continuous = true;
    // recognition.interimResults = true;
    // recognition.lang = 'ru-Ru';
    // recognition.onresult = function(event: any) {
    //   let result = event.results[event.resultIndex];
    //   if (result.isFinal) {
    //     alert('Вы сказали: ' + result[0].transcript);
    //   } else {
    //     console.log('Промежуточный результат: ', result[0].transcript);
    //   }
    // };

// Начинаем слушать микрофон и распознавать голос
//     recognition.start();
//     // }


    //@ts-ignore
    let recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ru-Ru';

    recognition.onresult = (event: any) => {
      let result = event.results[event.resultIndex];
      if (result.isFinal) {
        console.log(result[0].transcript);
        switch (result[0].transcript.replace(/\s/g, '')) {
          case 'вверх':
            if (this.controls.canJump === true) this.playerVelocity.y += 300;
            this.controls.canJump = false;
            break;
          case 'налево':
            this.controls.moveLeft = true;
            this.controls.moveForward = false;
            this.controls.moveBackward = false;
            this.controls.moveRight = false;
            break;
          case 'направо':
            this.controls.moveRight = true;
            this.controls.moveForward = false;
            this.controls.moveLeft = false;
            this.controls.moveBackward = false;
            break;
          case 'вперёд':
            this.controls.moveForward = true;
            this.controls.moveLeft = false;
            this.controls.moveBackward = false;
            this.controls.moveRight = false;
            break;
          case 'вниз':
            this.controls.moveBackward = true;
            this.controls.moveLeft = false;
            this.controls.moveBackward = false;
            this.controls.moveRight = false;
            break;
          case 'стоп':
            this.controls.moveForward = false;
            this.controls.moveLeft = false;
            this.controls.moveBackward = false;
            this.controls.moveRight = false;
            break;
        }
      }else{
        console.log(result[0].transcript)
      }
    };
    recognition.start();


    // if (annyang) {
    //
    //   // Let's define a command.
    //   let commands = {
    //     'Jump': () => {
    //       if (this.controls.canJump === true) this.playerVelocity.y += 300;
    //       this.controls.canJump = false;
    //     },
    //     'left': () => {
    //       console.log('left');
    //       this.controls.moveLeft = true;
    //     },
    //     'right': () => {
    //       console.log('right');
    //       this.controls.moveRight = true;
    //     },
    //     'top': () => {
    //       console.log('top');
    //       this.controls.moveForward = true;
    //     },
    //     'bot': () => {
    //       console.log('bot');
    //       this.controls.moveBackward = true;
    //     },
    //     'q': () => {
    //       console.log('stop');
    //       this.controls.moveForward = false;
    //       this.controls.moveLeft = false;
    //       this.controls.moveBackward = false;
    //       this.controls.moveRight = false;
    //     }
    //   };
    //
    //   // Add our commands to annyang
    //   annyang.addCommands(commands);
    //
    //   // Start listening.
    //   annyang.start();
    // } else {
    //   alert('error');
    // }

    let onKeyDown = (event: any) => {

      switch (event.keyCode) {

        case 38: // up
        case 87: // w
          this.controls.moveForward = true;
          break;

        case 37: // left
        case 65: // a
          this.controls.moveLeft = true;
          break;

        case 40: // down
        case 83: // s
          this.controls.moveBackward = true;
          break;

        case 39: // right
        case 68: // d
          this.controls.moveRight = true;
          break;
        case 32:
          if (this.controls.canJump === true) this.playerVelocity.y += 300;
          this.controls.canJump = false;
          break;
      }

    };

    // Listen for when a key is released
    // If it's a specified key, mark the direction as false since no longer moving
    let onKeyUp = (event: any) => {
      switch (event.keyCode) {

        case 38: // up
        case 87: // w
          this.controls.moveForward = false;
          break;

        case 37: // left
        case 65: // a
          this.controls.moveLeft = false;
          break;

        case 40: // down
        case 83: // s
          this.controls.moveBackward = false;
          break;

        case 39: // right
        case 68: // d
          this.controls.moveRight = false;
          break;
      }
    };

    // Add event listeners for when movement keys are pressed and released
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
  }


  playerMoving = (delta: any, height: number, scale: number) => {
    const PLAYER_Y = 2.0;
    const COLLISION_HEIGHT = height * scale + PLAYER_Y;
    this.playerVelocity.x -= this.playerVelocity.x * 10.0 * delta;
    this.playerVelocity.z -= this.playerVelocity.z * 10.0 * delta;
    this.playerVelocity.y -= COLLISION_HEIGHT + this.ACCELERATION_OF_GRAVITY * delta;

    if (this.controls.moveForward) {
      this.playerVelocity.z += this.PLAYER_SPEED * delta;
    }
    if (this.controls.moveBackward) {
      this.playerVelocity.z -= this.PLAYER_SPEED * delta;
    }
    if (this.controls.moveLeft) {
      this.playerVelocity.x += this.PLAYER_SPEED_ROTATION * delta;
    }
    if (this.controls.moveRight) {
      this.playerVelocity.x -= this.PLAYER_SPEED_ROTATION * delta;
    }
    if (!(this.controls.moveForward || this.controls.moveBackward
      || this.controls.moveLeft || this.controls.moveRight)) {
      this.playerVelocity.x = 0;
      this.playerVelocity.z = 0;
    }

    this.model.rotateY((this.playerVelocity.x * delta * Math.PI) / 180);
    this.model.translateZ(this.playerVelocity.z * delta * 10);
    this.model.translateY(this.playerVelocity.y * delta);

    if (this.model.position.y < COLLISION_HEIGHT) {
      this.playerVelocity.y = COLLISION_HEIGHT;
      this.model.position.y = COLLISION_HEIGHT;
      this.controls.canJump = true;
    }
  };


}
