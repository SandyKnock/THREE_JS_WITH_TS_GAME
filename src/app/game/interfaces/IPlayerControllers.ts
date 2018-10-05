export interface IControllers {
  moveForward: boolean;
  moveBackward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  canJump?: boolean;
}

export interface IPlayerControllers {
  controls: IControllers
}
