import { combineReducers, Reducer } from 'redux';
import { routerReducer } from 'react-router-redux';
import { playerReducer } from 'app/reducers/PlayerReducer';
import { gameLoopReducer } from 'app/reducers/GameLoopReducer';
import { terrainReducer } from 'app/reducers/TerrainReducer';
import { skyBoxReducer } from 'app/reducers/SkyBoxReducer';

export const rootReducer: Reducer<any> = combineReducers<any>({
  router: routerReducer,
  playerReducer,
  gameLoopReducer,
  skyBoxReducer,
  terrainReducer
});
