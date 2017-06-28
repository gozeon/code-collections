import * as React from 'react';
import * as moment from 'moment';
import * as insertCSS from 'insert-css';
const style = require('./style.css');
insertCSS(style);

import PanelTabs from '../PanelTabs';

const headerStyle = {
  background: `url(${require('./bg.jpg')}) 0 0 no-repeat`,
  backgroundSize: 'cover'
}

export interface ControlPanelProps {
  isShow: boolean;
  map: any
}

class ControlPanel extends React.Component<ControlPanelProps, {}> {
  constructor(props?: any, context?: any) {
    super(props, context);
  }

  render() {
    return (
      <div className={`control-panel animated ${this.props.isShow ? "fadeInLeft" : "fadeOutLeft"}`}>
        <header style={headerStyle}><a>Data Manager</a></header>
        <PanelTabs map={this.props.map} />
        <footer>
          You look so that I have nothing to say
        </footer>
      </div>
    );
  }
}

export default ControlPanel;
