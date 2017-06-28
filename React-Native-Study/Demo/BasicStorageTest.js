/**
 * Created by goze on 28/02/2017.
 */

import React from 'react';
import { AsyncStorage, View, Text, } from 'react-native';

export class BasicStorageTest extends React.Component {
  _setItem = async () => {
    console.log('save');
    const now = new Date();
    try {
      await AsyncStorage.setItem('NowTime', now);
    } catch (error) {
      console.log("setItem: " + error.message);
    }
  }

  _getItem = async () => {
    console.log('get');
    try {
      const valueTest = await AsyncStorage.getItem('NowTime');
      if(valueTest !== null) {
        console.log(valueTest);
      } else {
        console.log('storage is null')
      }
    } catch (error) {
      console.log("getItem: " + error.message);
    }
  }

  _clear = async () => {
    await AsyncStorage.clear(() => {
      console.log('cleared!')
    })
  }

  render() {
    return (
      <View style={{margin: 40,}}>
        <View>
          <Text onPress={this._setItem}>保存</Text>
        </View>
        <View>
          <Text onPress={this._getItem}>取出</Text>
        </View>
        <View>
          <Text onPress={this._clear}>清除</Text>
        </View>
      </View>
    );
  }
}

