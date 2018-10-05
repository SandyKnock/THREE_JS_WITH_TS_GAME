import { IControllers, IPlayerControllers } from 'app/game/interfaces/IPlayerControllers';

//@ts-ignore
import annyang from 'annyang';

export default class VoiceAnntangController implements IPlayerControllers {
  private _controls: IControllers;

  constructor(controls: IControllers) {
    this._controls = controls;
  }

  get controls(): IControllers {
    return this._controls;
  }

  set controls(value: IControllers) {
    this._controls = value;
  }

  voiceAnntangController() {
    if (annyang) {
      let commands = {
        // 'Jump': () => {
        //   if (this.controls.canJump === true) this.playerVelocity.y += 300;
        //   this.controls.canJump = false;
        // },
        'left': () => {
          this.controls.moveLeft = true;
          this.controls.moveForward = false;
          this.controls.moveBackward = false;
          this.controls.moveRight = false;

        },
        'right': () => {
          this.controls.moveRight = true;
          this.controls.moveForward = false;
          this.controls.moveLeft = false;
          this.controls.moveBackward = false;
        },
        'top': () => {
          this.controls.moveForward = true;
          this.controls.moveLeft = false;
          this.controls.moveBackward = false;
          this.controls.moveRight = false;
        },
        'bot': () => {
          this.controls.moveBackward = true;
          this.controls.moveForward = false;
          this.controls.moveLeft = false;
          this.controls.moveRight = false;
        },
        'q': () => {
          this.controls.moveForward = false;
          this.controls.moveLeft = false;
          this.controls.moveBackward = false;
          this.controls.moveRight = false;
        }
      };

      // Add our commands to annyang
      annyang.addCommands(commands);

      // Start listening.
      annyang.start();
    } else {
      alert('error');
    }
  }
}
