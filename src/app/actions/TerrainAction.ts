import { Terrain } from 'app/game/Terrain';

export namespace TerrainAction {

  export enum Type {
    SET_TERRAIN = 'SET_TERRAIN',
  }


  export const setTerrain = (terrain: Terrain) =>
    (dispatch: any) => dispatch({
      type: TerrainAction.Type.SET_TERRAIN,
      payload: terrain
    });

}

export type TerrainAction = Omit<typeof TerrainAction, 'Type'>;
