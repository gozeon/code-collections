import * as React from 'react';
import {FaCogs, FaChevronLeft} from 'react-icons/lib/fa';

import * as insertCSS from 'insert-css';
const style = require('./style.css');
insertCSS(style);

export interface ControlIconProps {
  clickCallBack: (isShow: boolean) => void;
}

interface ControlIconState {
  isShow: boolean
}

class ControlIcon extends React.Component<ControlIconProps, ControlIconState> {
  constructor(props?: any, context?: any) {
    super(props, context);

    this.state = {
      isShow: true
    }
  }

  private iconClick_ = () => {
    this.setState(Object.assign(this.state, {isShow: !this.state.isShow}));
    this.props.clickCallBack(this.state.isShow);
  };


  render() {
    return (
      <span className={`control-icon ${!this.state.isShow ? 'cog' : 'chevron-left'}` }
            onClick={this.iconClick_}
            ref="oSpan"
            style={{zIndex: 2}}
      >
        {!this.state.isShow ? <FaCogs size={20} color="#fff"/> : <FaChevronLeft size={16} color="#fff"/>}
      </span>
    );
  }
}
export default ControlIcon;
