import { IControllers, IPlayerControllers } from 'app/game/interfaces/IPlayerControllers';

export default class VoiceRecognitionController implements IPlayerControllers {
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

  voiceRecognitionController() {
    //@ts-ignore
    let recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'ru-Ru';
    recognition.onresult = (event: any) => {
      let result = event.results[event.resultIndex];
      if (result.isFinal) {
        console.log(result[0].transcript);
        switch (result[0].transcript.replace(/\s/g, '')) {
          // case 'вверх':
          //   if (this.controls.canJump === true) this.playerVelocity.y += 300;
          //   this.controls.canJump = false;
          //   break;
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
            this.controls.moveForward = false;
            this.controls.moveRight = false;
            break;
          case 'стоп':
            this.controls.moveForward = false;
            this.controls.moveLeft = false;
            this.controls.moveBackward = false;
            this.controls.moveRight = false;
            break;
        }
      } else {
        console.log(result[0].transcript);
      }
      // recognition.start();
    };
    recognition.start();
  }
}
