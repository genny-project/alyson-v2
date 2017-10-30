import './inputDatePicker.scss';
import 'react-datepicker/dist/react-datepicker.css';

import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import DatePicker from 'react-datepicker';
import {  } from '../';

class InputDatePicker extends Component {

  static defaultProps = {
    className: {},
  }

  static propTypes = {
    className: object,
    style: string,
    children: any,
  }

  state = {
    startDate: '',
    endDate: '',
  }

  handleChangeStart = (date) => {
    this.setState({
      startDate: date
    });
  }

  handleChangeEnd = (date) => {
    this.setState({
      endDate: date
    });
  }

  render() {
 	  const { className, children, style } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`input-date-picker ${className}`}>
        <DatePicker
          className="start-date"
          selected={this.state.startDate}
          selectsStart
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          onChange={this.handleChangeStart}
        />
        <DatePicker
            className="end-date"
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEnd}
        />
      </div>
    );
  }
}

export default InputDatePicker;
