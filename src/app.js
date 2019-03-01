import React, { Component } from 'react';
import {
  Navigator,
} from 'react-native';
import Recipes from './Recipes';

const RouteMapper = (route, navigator) => {
  if (route.name === 'recipes') {
    return <Recipes navigator={navigator} />;
  }
};

export default class App extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{ name: 'recipes' }}
        configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottom}
        renderScene={RouteMapper}
      />
    );
  }
}
