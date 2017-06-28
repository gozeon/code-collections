import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import STYLE from '../Style/Style';

type State = { animating: boolean; };
type Timer = number;

class ActivityIndicatorExample extends React.Component {
  // Optional Flowtype state and timer type
  state: State;
  _timer: Timer;
  constructor(props) {
    super(props);

    this.state = {
      animating: true,
    }
  }
  componentDidMount() {
    this.setToggleTimeout();
  }

  componentWillMount() {
    clearTimeout(this._timer);
  }
  componentWillUnmount() {
    clearTimeout(this._timer)
  }
  setToggleTimeout() {
    this._timer = setTimeout(() => {
      this.setState({ animating: !this.state.animating });
      this.setToggleTimeout();
      console.log("yes")
    }, 2000);
  }
  render() {
    return(
      <ActivityIndicator animating={this.state.animating}
                         style={STYLE.loading} size='large' />
    )
  }
}

export { ActivityIndicatorExample as default}