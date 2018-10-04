import * as React from 'react';
import { Route, Switch } from 'react-router';
import { RootContainer } from 'app/containers/App/RootContainer';
import { hot } from 'react-hot-loader';

export const App = hot(module)(() => (
  <Switch>
    <Route path="/" component={RootContainer} />
  </Switch>
));
