import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'react-router-redux';
import { History } from 'history';
import thunk from 'redux-thunk';
import { rootReducer } from 'app/reducers/RootReducer';

export function configureStore(history: History) {
  const middleware = routerMiddleware(history);

  const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk, middleware)));
  if (module.hot) {
    module.hot.accept('app/reducers/RootReducer', () => {
      const nextReducer = require('app/reducers/RootReducer');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
