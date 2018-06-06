// @flow
import React from 'react';
import { render } from 'rn-app';
import Navigator, { ViewPort } from '@bhoos/navigator-native';

import Home from './screens/Home';
import IronMan from './screens/IronMan';
import Thor from './screens/Thor';
import Hulk from './screens/Hulk';
import Bar from './components/Bar';

const routes = {
  home: Home,
  iron: IronMan,
  thor: Thor,
  hulk: Hulk,
};

render((
  <Navigator routes={routes} defaultRoute="home">
    <ViewPort />
    <Bar />
  </Navigator>
));
