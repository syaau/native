import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { withNavigator } from '@bhoos/navigator-native';

class Bar extends Component {
  render() {
    return (
      <View><Text>Bar</Text></View>
    );
  }
}

export default withNavigator(Bar);
