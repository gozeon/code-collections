import React from 'react';
import {View, Text, DatePickerIOS, TextInput,} from 'react-native';
import STYLE from '../Style/Style';

class WithLabel extends React.Component {
  render() {
    return (
      <View style={STYLE.labelContainer}>
        <View style={STYLE.labelView}>
          <Text style={STYLE.labelText}>
            {this.props.label}
          </Text>
        </View>
        {this.props.children}
      </View>
    )
  }
}

class Heading extends React.Component {
  render() {
    return (
      <View style={STYLE.headingContainer}>
        <Text style={STYLE.headingText}>{this.props.label}</Text>
      </View>
    )
  }
}

class DatePickerIOSExample extends React.Component {
  static defaultProps = {
    date: new Date(),
    timeZoneOffsetInMinutes: (-1) * (new Date()).getTimezoneOffset() / 60,
  };

  state = {
    date: this.props.date,
    timeZoneOffsetInMinutes: this.props.timeZoneOffsetInMinutes,
  };

  onDateChange = (date) => {
    this.setState({date: date});
  };

  onTimezoneChange = (event) => {
    var offset = parseInt(event.nativeEvent.text, 10);

    if (isNaN(offset)) {
      return;
    }

    this.setState({timeZoneOffsetInMinutes: offset})
  }

  render() {
    return (
      <View style={{padding: 70,}}>
        <WithLabel label="Value:">
          <Text>{
          this.state.date.toLocaleDateString() + '  ' + this.state.date.toLocaleTimeString()
          }</Text>
        </WithLabel>
        <WithLabel label="Timezone:">
          <TextInput onChange={this.onTimezoneChange}
                     style={STYLE.textInput}
                     value={this.state.timeZoneOffsetInMinutes.toString()} />
          <Text> hour from UTC</Text>
        </WithLabel>
        <Heading label="Data + time Picker" />
        <DatePickerIOS date={this.state.date} mode="datetime"
                       timeZoneOffsetInMinutes={this.state.timeZoneOffsetInMinutes * 60}
                       onDateChange={this.onDateChange} />
        <Heading label="Data Picker" />
        <DatePickerIOS date={this.state.date} mode="date"
                       timeZoneOffsetInMinutes={this.state.timeZoneOffsetInMinutes * 60}
                       onDateChange={this.onDateChange} />
        <Heading label="TIme Picker, 10-minute interval" />
        <DatePickerIOS date={this.state.date} mode="time"
                       timeZoneOffsetInMinutes={this.state.timeZoneOffsetInMinutes * 60}
                       onDateChange={this.onDateChange} minuteInterval={10} />
      </View>
    )
  }
}

export {DatePickerIOSExample as default}