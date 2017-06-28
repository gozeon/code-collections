
import React from 'react';
import { AsyncStorage, PickerIOS, Text, View, } from 'react-native';

const STORAGE_KEY = '@AsyncStorageExample:key';
const COLORS = ["red", "orange", "yellow", "green", "blue"];

export class BasicStorage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedValue: COLORS[0],
      messages: [],
    }
  }

  componentDidMount() {
    this._loadInitialState().done();
  }

  render() {
    var color = this.state.selectedValue;
    return (
      <View>
        <PickerIOS selectedValue={color} onValueChange={this._onValueChange}>
          {COLORS.map((color) => <PickerIOS.Item key={color} value={color} label={color} />)}
        </PickerIOS>
        <Text>
          {'Selected: '}
          <Text style={{color}}>{this.state.selectedValue}</Text>
        </Text>
        <Text onPress={this._removeStorage}>Press here to remove from storage.</Text>
        <Text>{'  '}</Text>
        <Text>Messages:</Text>
        {this.state.messages.map((m) => <Text key={m}>{m}</Text>)}
      </View>
    );
  }

  _loadInitialState = async () => {
    try {
      var value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null) {
        this.setState({
          selectedValue: value
        });

        this._appendMessage('Recovered selection from disk: ' + value);
      } else {
        this._appendMessage('Initialzed with no selection on disk.');
      }
    } catch (error) {
      this._appendMessage('AsyncStorage error: ' + error.message);
    }
  }

  _appendMessage = (message) => {
    this.setState({ messages: this.state.messages.concat(message) });
  }

  _removeStorage = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      this._appendMessage('Selection removed from disk.');
    } catch (error) {
      this._appendMessage('AsyncStorage error: ' + error.message);
    }
  }

  _onValueChange = async (selectedValue) => {
    this.setState({ selectedValue });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, selectedValue);
      this._appendMessage('Saved selection to disk: ' + selectedValue);
    } catch (error) {
      this._appendMessage('AsyncStorage error: ' + error.message);
    }
  }
}

exports.title = 'AsyncStorage';
exports.description = 'Asynchronous local disk storage.';
exports.examples = [
  {
    title: 'Basics - getItem, setItem, removeItem',
    render(): React.Element<any> { return <BasicStorage />; }
  },
]