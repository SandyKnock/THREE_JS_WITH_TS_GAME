import { handleActions } from 'redux-actions';
import { TerrainAction } from 'app/actions/TerrainAction';

const initialState = {
  terrain: {}
};

export const terrainReducer = handleActions<any>({
    [TerrainAction.Type.SET_TERRAIN]: (state, action) => {
      return { ...state, terrain: action.payload };
    },

  },
  initialState
);
