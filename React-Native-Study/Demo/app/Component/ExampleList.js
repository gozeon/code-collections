import React from 'react';
import { View, Text, ListView, TouchableHighlight, } from 'react-native';
import STYLE from '../Style/Style';
import ActivityIndicatorExample from './ActivityIndicatorExample';
import ButtonExample from './ButtonExample';
import DatePickerIOSExample from './DatePickerIOSExample';
import KeyboardAvoidingViewExample from './KeyboardAvoidingViewExample';

class ExampleList extends React.Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })
    const examples = [
      {title: 'ActivityIndicator', component: ActivityIndicatorExample},
      {title: 'Button', component: ButtonExample},
      {title: 'DatePickerIOS', component: DatePickerIOSExample},
      {title: 'KeyboardAvoidingView', component: KeyboardAvoidingViewExample}
      ];
    this.state = {
      examples: ds.cloneWithRows(examples)
    }
  }

  _toExample(example) {
    this.props.navigator.push(example)
  }

  _renderRows(examples) {
    return (
    <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" onPress={
      () => {
        this._toExample(examples)
      }
    }>
      <View style={STYLE.listItem}>
        <Text>{examples.title}</Text>
      </View>
    </TouchableHighlight>
    )
  }
  render() {
    return(
      <View style={STYLE.container}>
        <ListView dataSource={this.state.examples} renderRow={this._renderRows.bind(this)} />
      </View>
    )
  }
}

export { ExampleList as default}