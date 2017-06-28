import * as React from 'react';
import * as moment from 'moment';
import {FaCalendar} from 'react-icons/lib/fa';
import * as insertCSS from 'insert-css';
const style = require('./style.css');
insertCSS(style);

import {Circle} from 'better-react-spinkit'

import Api from '../../api/api';
import HighlightCalendar from '../HighlightCalendar';

export interface SearchTabPanelProps {
  map: any
}

interface SearchTabPanelState {
  highlightDates: string[],
  isDisabled: boolean,
  selectDate: moment.Moment
}

class SearchTabPanel extends React.Component<SearchTabPanelProps, SearchTabPanelState> {
  constructor(props?: any, context?: any) {
    super(props, context);

    this.state = {
      highlightDates: [],
      isDisabled: false,
      selectDate: moment()
    }
  }

  private getSelectDate = (date: moment.Moment) => {
    this.setState(Object.assign(this.state, {selectDate: date}))
  };

  private btnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const oBtn: HTMLButtonElement = e.target as HTMLButtonElement;
    oBtn.classList.add('btn-loading');
    this.setState(Object.assign(this.state, {isDisabled: true}));

    const exist: boolean = this.isDateInhighlightDates();
    if (exist) {
      const tilesUrl: string = 'https://api.gagogroup.cn/api/v3/ndvi/' +
        Number(this.state.selectDate.format('YYYY')) + '/' +
        Number(this.state.selectDate.format('MM')) + '/' +
        Number(this.state.selectDate.format('DD')) + '/' +
        '{z}/{x}/{y}?token=gdc_longrun';

      this.addMapLayer(this.props.map, tilesUrl, () => {
        oBtn.classList.remove('btn-loading');
        this.setState(Object.assign(this.state, {isDisabled: false}))
      });
    } else {
      if (this.props.map.getLayer('showResult')) {
        this.props.map.removeLayer('showResult');
        this.props.map.removeSource('result');
      }

      oBtn.classList.remove('btn-loading');
      this.setState(Object.assign(this.state, {isDisabled: false}));
      alert('请选择有效日期!')
      return;
    }

  };

  private addMapLayer = (map: any, tilesUrl: string, callback: () => void) => {
    if (map.getLayer('showResult')) {
      map.removeLayer('showResult');
      map.removeSource('result');
    }
    map.addSource('result', {
      type: 'lerc',
      tiles: [tilesUrl],
      tileSize: 256
    });
    map.addLayer({
      'id': 'showResult',
      'type': 'raster',
      'source': 'result'
    });
    callback()
  };

  private isDateInhighlightDates(): boolean {
    const tmp = this.state.highlightDates.map(item => {
      return moment(item).format('YYYY-MM-DD')
    });

    if (tmp.indexOf(this.state.selectDate.format('YYYY-MM-DD')) === -1) {
      return false
    } else {
      return true
    }
  }

  componentDidMount() {
    Api.getEffectiveDate(2017).then((result: any) => {
      if (result.hasOwnProperty('dates')) {
        const highlightDates: string[] = result['dates'].map(item => {
          return item = moment().format(item);
        });
        this.setState(Object.assign(this.state, {highlightDates: highlightDates}))
      }
    });
  }

  render() {
    return (
      <div>
        <div className="search-tab-panel">
          <span>Select time</span>
          <div className="select-time">
            <FaCalendar size={15} color={'#fff'}/>
            <HighlightCalendar highlightDates={this.state.highlightDates} dateCallBack={this.getSelectDate}>
              <div className="date-picker-footer">
                Green indicates that the date has data
              </div>
            </HighlightCalendar>
          </div>
        </div>
        <button className="btn" onClick={this.btnClick} disabled={this.state.isDisabled}>
          { this.state.isDisabled ? <Circle size={16}/> : "Search"}
        </button>
      </div>
    );
  }
}

export default SearchTabPanel;
