import './inputDatePicker.scss';
import 'react-datepicker/dist/react-datepicker.css';

import React, { Component } from 'react';
import { string, object, any, func, bool } from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Label } from 'views/components';

class InputDatePicker extends Component {

  static defaultProps = {
    className: '',
    identifier: null,
    validationStatus: null,
    defaultDateFormat: 'YYYY-MM-DD HH:mm',
    defaultTimeFormat: 'HH:mm',
    showTimeSelect: true
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
    validation: func,
    identifier: any,
    validationStatus: string,
    showTimeSelect: bool
  }

  state = {
    startDate: this.props.value ? moment(this.props.value, this.props.defaultDateFormat).format(this.props.defaultDateFormat) : moment().format(this.props.defaultDateFormat),
    isMobile: window.getScreenSize() == 'sm',
  }

  handleChange = (date) => {

    const { validationList, validation, identifier, type, defaultDateFormat } = this.props;
    let value = moment(date);
    if(type == 'java.time.LocalDate') {
      value = value.format(defaultDateFormat);
    } else {
      value = value.toISOString();
    }
    this.setState({ startDate: date });
    if(validation) validation(value, identifier, validationList);
  }

  render() {

    const { className, children, style, validationStatus, name, defaultDateFormat, defaultTimeFormat, mandatory, showTimeSelect } = this.props;
    const { startDate } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`input input-date-picker ${className}`}>
        { name ? <div className='input-header'>
          { name ? <Label className="input-date-picker-label" text={name} /> : null }
          { mandatory ? <Label className='input-label-required' textStyle={ !validationStatus ? {color: '#cc0000'} : ''} text="*  required" /> : null}
        </div> : null }
        {
          this.state.isMobile ? 
          
            <div style={{display: 'flex'}}> <input type='date'/> <input type='time'/> </div>
          
          : (<DatePicker
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
            minDate={moment().subtract(60, "years")}
            maxDate={moment().add(5, "years")}
            dropdownMode="select"
            showTimeSelect={showTimeSelect}
            timeIntervals={15}
          /> )
        }
      </div>
    );
  }
}

export default InputDatePicker;
