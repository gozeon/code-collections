/**
 * Created by goze on 01/03/2017.
 */
import React from 'react';
import styles from '../Styles/Main';
import SearchForm from './SearchForm';
import {
  Text,
  View,
  NavigatorIOS,
} from 'react-native';

class Search extends React.Component {
  render() {
    return (
      <NavigatorIOS style={styles.container}
                    initialRoute={{ title: "搜索", component: SearchForm }}
                    shadowHidden={true}
                    barTintColor="darkslateblue"
                    titleTextColor="rgba(255, 255, 255, 0.8)"
                    tintColor="rgba(255, 255, 255, 0.8)"
                    translucent={true} />
    )
  }
}

export { Search as default }