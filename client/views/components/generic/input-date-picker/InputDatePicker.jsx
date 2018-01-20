import './inputDatePicker.scss';
import 'react-datepicker/dist/react-datepicker.css';

import React, { Component } from 'react';
import { string, object, any, func, bool, array } from 'prop-types';
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
    style: object,
    name: string,
    validation: func,
    identifier: any,
    validationStatus: string,
    showTimeSelect: bool,
    handleOnChange: func,
    value: string,
    defaultDateFormat: string,
    defaultTimeFormat: string,
    validationList: array,
    type: string,
    mandatory: bool
  }

  getStartDate() {
    const { value, defaultDateFormat} = this.s;
    return value ? moment(value, defaultDateFormat).format(defaultDateFormat) : moment().format(defaultDateFormat);
  }

  getMobileValues = (type) => {
    if (type == 'date') return moment(this.getStartDate()).format('YYYY-MM-DD');
    if (type == 'time') return moment(this.getStartDate()).format('HH:mm');
  }

  handleChange = (date, noValidate) => {
    const { validationList, validation, identifier, type, defaultDateFormat, handleOnChange } = this.props;
    const value = ( type === 'java.time.LocalDate' ) ? moment(date).format( defaultDateFormat ) : moment(date).toISOString();
    if (value) {
      if(handleOnChange) handleOnChange(date);
      if(validation && !noValidate) validation(value, identifier, validationList);
    }    
  }

  handleChangeMobile = (event) => {
    let date;
    let time;

    if (this.props.type != 'java.time.LocalDate' ) {
      if (event.target.type == 'date') {
        date = event.target.value;
        time = this.getMobileValues('time');
        let dateTime = date + ' ' + time;
        this.handleChange(dateTime);
      }
      
      if (event.target.type == 'time') {
        date = this.getMobileValues('date');
        time = event.target.value;
        let dateTime = date + ' ' + time;

        if (event.type == 'blur' || event.keyCode == '13') {
          this.handleChange(dateTime);
        } else {
          this.handleChange(dateTime, true);
        }
      } 
    } 
    else {
      date = event.target.value;
      this.handleChange(date);
    }
  }

  render() {
    const { className, style, validationStatus, name, defaultDateFormat, type, defaultTimeFormat, mandatory, showTimeSelect } = this.props;
    const componentStyle = { ...style, };
    const startDate = this.getStartDate();
    const isMobile = window.getScreenSize() === 'sm';

    console.log(startDate);

    return (
      <div className={`input input-date-picker ${className} ${isMobile ? `${validationStatus} mobile` : ''} `} style={componentStyle}>
        { name ? <div className='input-header'>
          { name && <Label className="input-date-picker-label" text={name} /> }
          { mandatory ? <Label className='input-label-required' textStyle={ !validationStatus ? {color: '#cc0000'} : ''} text="*  required" /> : null}
        </div> : null }
        {
          isMobile ?
            <div className='input-date-picker-mobile' style={{display: 'flex'}}>
              <input
                type='date'
                onChange={this.handleChangeMobile}
                value={this.getMobileValues('date')}
              />
              { type == 'java.time.LocalDate' ? null : 
                <input
                  type='time'
                  onChange={this.handleChangeMobile}
                  onBlur={this.handleChangeMobile}
                  onKeyDown={this.handleChangeMobile}
                  value={this.getMobileValues('time')}
                /> 
              }
            </div>
          
          : (<DatePicker
            className={`${validationStatus} input-date-picker-main`}
            calendarClassName=""
            dateFormat={defaultDateFormat}
            timeFormat={defaultTimeFormat}
            selected={startDate ? moment(startDate, defaultDateFormat): null}
            onChange={this.handleChange}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            minDate={moment().subtract(60, 'years')}
            maxDate={moment().add(5, 'years')}
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
