/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, TabBarIOS, } from 'react-native';
import MovieList from './app/Components/MovieList';
import InTheaters from './app/Components/InTheaters';
import Featured from './app/Components/Featured';
import Search from './app/Components/Search';
import icons from './app/Assets/Icons';

export default class MovieTalk2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 'search'
    }
  }
  render() {
    return (
      <TabBarIOS barTintColor="darkslateblue" tintColor="white">
        <TabBarIOS.Item
          icon={{ uri: icons.start, scale: 4.6 }}
          selectedIcon={{ uri: icons.startActive, scale: 4.6 }}
          title="推荐电影"
          selected={this.state.selectedTab === 'featured'}
          onPress={() => {
            this.setState({
              selectedTab: 'featured'
            });
          }}>
          <Featured />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={{ uri: icons.board, scale: 4.6 }}
          selectedIcon={{ uri: icons.boardActive, scale: 4.6 }}
          title="推荐电影"
          selected={this.state.selectedTab === 'us_box'}
          onPress={() => {
            this.setState({
              selectedTab: 'us_box'
            })
          }}>
          <InTheaters />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={{ uri: icons.search, scale: 4.6 }}
          title="搜索"
          selected={this.state.selectedTab === 'search'}
          onPress={() => {
            this.setState({
              selectedTab: 'search'
            })
          }}>
          <Search />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

AppRegistry.registerComponent('MovieTalk2', () => MovieTalk2);
