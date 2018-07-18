# @bhoos/menu
A game menu using navigator for Bhoos Games

## Installation
> `$ yarn add @bhoos/menu`

## Usage
```javascript

// Define your menu screens
const screen1 = require('assets/screen1.png');
const card1 = require('assets/card1.png');

const Screen1 = () => (
  <Image source={screen1} />
);
Screen1.route = 'one';
Screen1.card = card1;
Screen2.bg = screen1;

const screen2 = require('assets/screen2.png');
const card2 = require('assets/card2.png');

const Screen2 = () => (
  <Image source={screen2} />
);
Screen2.route = 'two';
Screen2.card = card2;
Screen2.bg = screen2;

// Your Home.js
import { createScreens, createCards } from '@bhoos/menu';

const screenRoutes = createScreens([Screen1, Screen2]);
const cards = createCards([Screen1, Screen2]);

// Most likely your home screen (must be a class and not stateless)
class Home extends Component {
  render() {
    return (
      <View>
        { cards }
      </View>
    );
  }
}

const routes = {
  'home': Home,
  ...screenRoutes,
};

// your index file
import { Navigator, ViewPort } from '@bhoos/navgiator-native';
render((
  <Navigator routes={routes} defaultRoute="home" duration={400}>
    <ViewPort />
  </Navigator>
))

