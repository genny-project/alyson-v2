import './inputDatePicker.scss';
import 'react-datepicker/dist/react-datepicker.css';

import React, { Component } from 'react';
import { string, object, any, func } from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Label } from 'views/components';

class InputDatePicker extends Component {

  static defaultProps = {
    className: '',
    identifier: null,
    validationStatus: null,
    defaultDateFormat: 'DD MMMM YYYY'
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
    validation: func,
    identifier: any,
    validationStatus: string
  }

  state = {
    startDate: this.props.value ? moment(this.props.value, this.props.defaultDateFormat).format(this.props.defaultDateFormat) : moment().format(this.props.defaultDateFormat),
  }

  handleChange = (date) => {

    const { validationList, validation, identifier } = this.props;
    const value = moment(date).format(this.props.defaultDateFormat);
    this.setState({ startDate: date });
    if(validation) validation(value, identifier, validationList);
  }

  render() {

    const { className, children, style, validationStatus, name } = this.props;
    const { startDate } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`input input-date-picker ${className}`}>
        { name ? <Label className="input-date-picker-label" text={name} /> : null }
        <DatePicker
          className={validationStatus}
          calendarClassName=""
          dateFormat={this.props.defaultDateFormat}
          dayClassName={date => date.date() < Math.random() * 31 ? 'random' : undefined}
          selected={moment(startDate)}
          onChange={this.handleChange}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
      </div>
    );
  }
}

export default InputDatePicker;
