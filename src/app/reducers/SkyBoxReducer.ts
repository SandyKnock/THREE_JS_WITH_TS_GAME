import { handleActions } from 'redux-actions';
import { SkyBoxAction } from 'app/actions/SkyBoxAction';

const initialState = {
  skyBox: {}
};

export const skyBoxReducer = handleActions<any>({
    [SkyBoxAction.Type.SET_SKY_BOX]: (state, action) => {
      return { ...state, skyBox: action.payload };
    },

  },
  initialState
);
