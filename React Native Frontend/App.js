import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './app/index';

class Project extends Component {

  render() {
    return <App />;
  }
}

export default Project;

AppRegistry.registerComponent('FirstLookReactNavigation', () => App);
