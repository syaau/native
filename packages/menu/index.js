import React from 'react';
import { render } from 'rn-app';
import Navigator, { ViewPort } from '@bhoos/navigator-native';

import Home, { screens as menuScreens } from './demo/screens/Home';

const routes = {
  home: Home,
  ...menuScreens,
};

render((
  <Navigator routes={routes} defaultRoute="home" duration={400}>
    <ViewPort />
  </Navigator>
));
