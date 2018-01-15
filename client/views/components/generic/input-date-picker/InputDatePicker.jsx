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
    defaultDateFormat: 'YYYY-MM-DD HH:mm',
    defaultTimeFormat: 'HH:mm'
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

    const { validationList, validation, identifier, defaultDateFormat } = this.props;
    const value = moment(date).format(defaultDateFormat);
    this.setState({ startDate: date });
    if(validation) validation(value, identifier, validationList);
  }

  render() {

    const { className, children, style, validationStatus, name, defaultDateFormat, defaultTimeFormat, mandatory } = this.props;
    const { startDate } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`input input-date-picker ${className}`}>
        { name ? <div className='input-header'>
          { name ? <Label className="input-date-picker-label" text={name} /> : null }
          { mandatory ? <Label className='input-label-required' textStyle={{color: '#cc0000'}} text="*  required" /> : null}
        </div> : null }
        <DatePicker
          className={`${validationStatus} input-date-picker-input`}
          calendarClassName=""
          dateFormat={defaultDateFormat}
          timeFormat={defaultTimeFormat}
          dayClassName={date => date.date() < Math.random() * 31 ? 'random' : undefined}
          selected={startDate ? moment(startDate, defaultDateFormat): null}
          onChange={this.handleChange}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          showTimeSelect={this.props.showTimeSelect}
          timeIntervals={15}
        />
      </div>
    );
  }
}

export default InputDatePicker;
