import React, { Component } from 'react';
import {
  Navigator,
} from 'react-native';
import Explore from './Explore';

console.disableYellowBox = true;

const RouteMapper = (route, navigator) => {
  if (route.name === 'explore') {
    return <Explore navigator={navigator} />;
  }
};

export default class App extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{ name: 'explore' }}
        configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottom}
        renderScene={RouteMapper}
      />
    );
  }
}
