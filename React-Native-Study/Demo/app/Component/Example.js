import React from 'react';
import { View, Text, ListView, NavigatorIOS, } from 'react-native';
import STYLE from '../Style/Style';
import ExampleList from './ExampleList';

class Example extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return(
      <NavigatorIOS style={STYLE.container}
                    initialRoute={{ title: "Example", component: ExampleList }}
                    titleTextColor='rgba(255, 255, 255, 1)'
                    barTintColor='darkslateblue'
                    tintColor="rgba(255, 255, 255, 0.8)"
                    translucent={true}
                    shadowHidden={true}
      />
    )
  }
}

export { Example as default}