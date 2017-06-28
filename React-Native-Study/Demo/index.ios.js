/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  NavigatorIOS,
  TabBarIOS,
} from 'react-native';

import Example from './app/Component/Example';
import Api from './app/Component/Api';
import ICONS from './app/Assets/Icons';

export default class Demo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedTab: "example"
    }
  }
  render() {
    return (
      <TabBarIOS barTintColor="darkslateblue" tintColor="white">
        <TabBarIOS.Item
          icon={{ uri: ICONS.home, scale: 4.6 }}
          selectedIcon={{ uri: ICONS.homeSeleted, scale: 4.6 }}
          title="Components"
          selected={this.state.selectedTab === 'example'}
          onPress={() => {
            this.setState({
              selectedTab: 'example'
            });
          }}>
          <Example />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={{ uri: ICONS.star, scale: 4.6 }}
          selectedIcon={{ uri: ICONS.starSelect, scale: 4.6 }}
          title="APIS"
          selected={this.state.selectedTab === 'api'}
          onPress={() => {
            this.setState({
              selectedTab: 'api'
            })
          }}>
          <Api />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

AppRegistry.registerComponent('Demo', () => Demo);
