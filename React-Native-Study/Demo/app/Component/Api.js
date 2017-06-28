/**
 * Created by goze on 01/03/2017.
 */
import React from 'react';
import { View, Text, } from 'react-native';
import STYLE from '../Style/Style';

class Api extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return(
      <View style={STYLE.container}><Text>API</Text></View>
    )
  }
}

export { Api as default}