import * as React from 'react';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';

import * as insertCSS from 'insert-css';
const style = require('./style.css');
insertCSS(style);
require('react-datepicker/dist/react-datepicker.css');


export interface HighlightCalendarProps {
  highlightDates: string[];
  dateCallBack: (date: moment.Moment) => void;
}


interface HighlightCalendarState {
  startDate: moment.Moment,
}

class HighlightCalendar extends React.Component<HighlightCalendarProps, HighlightCalendarState> {
  constructor(props?: any, context?: any) {
    super(props, context);

    this.state = {
      startDate: moment()
    }
  }

  private calendarChange = (date: moment.Moment) => {
    this.props.dateCallBack(date);
    this.setState({startDate: date} as HighlightCalendarState);
  };

  componentDidMount() {
  }

  render() {
    return (
      <DatePicker
        className="select-time-input"
        dateFormat="YYYY-MM-DD"
        selected={this.state.startDate}
        onChange={this.calendarChange}
        highlightDates={this.props.highlightDates}
        showYearDropdown
      >
        {this.props.children}
      </DatePicker>
    );
  }
}

export default HighlightCalendar;
