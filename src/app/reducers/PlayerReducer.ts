import { handleActions } from 'redux-actions';
import { PlayerAction } from 'app/actions/PlayerAction';

const initialState = {
  player: {}
};

export const playerReducer = handleActions<any>({
    [PlayerAction.Type.SET_PLAYER]: (state, action) => {
      return { ...state, player: action.payload };
    },

  },
  initialState
);
