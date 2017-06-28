import * as React from 'react';
import * as moment from 'moment';
import * as insertCSS from 'insert-css';
const style = require('./style.css');
insertCSS(style);

const mapboxgl = require('../../lib/mapbox-gl-dev');
mapboxgl.accessToken = 'pk.eyJ1IjoiZ296ZSIsImEiOiJjaXg4ZTNycncwMDBhMm9xZmF' +
  '1dXBqOW8zIn0.aqHVTtTUFWHMKAGMWvqd9Q';

import ControlIcon from '../ControlIcon';
import ControlPanel from '../ControlPanel';

interface ShowIndexState {
  showPanel: boolean;
  map: any
}

class ShowIndex extends React.Component<{}, ShowIndexState> {
  constructor(props?: any, context?: any) {
    super(props, context);

    this.state = {
      showPanel: true,
      map: undefined
    }
  }

  componentDidMount() {
    // init map
    const map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/dark-v9', //stylesheet location
      zoom: 0,
      center: [91.67817089511277, 9.910246150845026]
    });
    this.setState(Object.assign(this.state, {map: map}));
  }

  private controlIconCB_ = (isShow: boolean) => {
    this.setState(Object.assign(this.state, {showPanel: isShow}))
  };

  private doSearch = (date: moment.Moment) => {
    this.setState(Object.assign(this.state, {selectDate: date}))
  }

  render() {
    return (
      <div className="container">
        <ControlIcon clickCallBack={this.controlIconCB_} />
        <ControlPanel
          isShow={this.state.showPanel}
          map={this.state.map}
        />
        <div id="map" />
      </div>
    )
  }
}

export default ShowIndex;
