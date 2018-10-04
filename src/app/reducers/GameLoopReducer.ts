import { handleActions } from 'redux-actions';
import { GameLoopAction } from 'app/actions/GameLoopAction';

const initialState = {
  gameLoop: {}
};

export const gameLoopReducer = handleActions<any>({
    [GameLoopAction.Type.SET_GAME_LOOP]: (state, action) => {
      return { ...state, gameLoop: action.payload };
    },

  },
  initialState
);
