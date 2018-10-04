import { Player } from 'app/game/Player';

export namespace PlayerAction {

  export enum Type {
    SET_PLAYER = 'SET_PLAYER',
  }


  export const setPlayer = (player: Player) =>
    (dispatch: any) => dispatch({
      type: PlayerAction.Type.SET_PLAYER,
      payload: player
    });

}

export type PlayerAction = Omit<typeof PlayerAction, 'Type'>;
