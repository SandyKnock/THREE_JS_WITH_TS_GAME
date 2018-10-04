import { GameCycle } from 'app/game/GameCycle';

export namespace GameLoopAction {

  export enum Type {
    SET_GAME_LOOP = 'SET_GAME_LOOP',
  }


  export const setGameLoop = (gameLoop: GameCycle) =>
    (dispatch: any) => dispatch({
      type: GameLoopAction.Type.SET_GAME_LOOP,
      payload: gameLoop
    });

}

export type GameLoopAction = Omit<typeof GameLoopAction, 'Type'>;
