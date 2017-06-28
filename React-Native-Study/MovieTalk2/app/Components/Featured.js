/**
 * Created by goze on 28/02/2017.
 */

import React from 'react';
import styles from '../Styles/Main';
import MovieList from './MovieList';
import {
  Text,
  View,
  NavigatorIOS,
} from 'react-native';

class Featured extends React.Component {
  render() {
    return (
      <NavigatorIOS style={styles.container}
                    initialRoute={{ title: "推荐电影", component: MovieList }}
                    shadowHidden={true}
                    barTintColor="darkslateblue"
                    titleTextColor="rgba(255, 255, 255, 0.8)"
                    tintColor="rgba(255, 255, 255, 0.8)"
                    translucent={true} />
    )
  }
}

export { Featured as default }