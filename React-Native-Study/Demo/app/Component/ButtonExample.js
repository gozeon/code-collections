import React from 'react';
import {View, Text, Button, Alert, TouchableOpacity,} from 'react-native';
import STYLE from '../Style/Style';

class ButtonExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  _BtnClick = () => {
    Alert.alert("Clicking");
  }

  render() {
    return (
      <View style={{ paddingTop: 200, }}>
        <TouchableOpacity style={{
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.5)',
          backgroundColor: 'darkslateblue',
          marginLeft: 20,
          marginRight: 20,
          borderRadius: 4,
          }}>
          <Button title="Click" color="white"
                  accessibilityLabel="zhe shi shenme " onPress={this._BtnClick}/>
        </TouchableOpacity>
      </View>
    )
  }
}

export {ButtonExample as default}