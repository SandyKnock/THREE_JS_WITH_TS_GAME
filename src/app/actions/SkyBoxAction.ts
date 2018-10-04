import { SkyBox } from 'app/game/SkyBox';

export namespace SkyBoxAction {

  export enum Type {
    SET_SKY_BOX = 'SET_SKY_BOX',
  }


  export const setSkyBox = (skyBox: SkyBox) =>
    (dispatch: any) => dispatch({
      type: SkyBoxAction.Type.SET_SKY_BOX,
      payload: skyBox
    });

}

export type SkyBoxAction = Omit<typeof SkyBoxAction, 'Type'>;
