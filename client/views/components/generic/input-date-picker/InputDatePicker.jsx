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
    showTimeSelect: true,

    dateTimeDisplayFormat: 'YYYY-MM-DD HH:mm',
    dateDisplayFormat: 'YYYY-MM-DD',
    timeDisplayFormat: 'HH:mm',

  }

  static propTypes = {
    className: string,
    style: object,
    name: string,
    validation: func,
    identifier: any,
    validationStatus: string,
    validationList: array,
    value: string,
    mandatory: bool,
    showTimeSelect: bool,

    type: string,

    dateTimeDisplayFormat: string,
    dateDisplayFormat: string,
    timeDisplayFormat: string,

    handleOnChange: func,

  }

  state = {
    shouldValidate: true,
    isMobile: window.getScreenSize() == 'sm',
    currentValue: null,
    lateSentValue: null,
  }

  //setInitial Value
  componentWillMount() {
    const { value } = this.props;

    let initialValue;
    if (typeof value == string) {
      initialValue = moment().toISOString();
      initialValue = this.convertToDisplayFormat(value);
    }
    else {
      initialValue = moment().toISOString();
      initialValue = this.convertToDisplayFormat(initialValue);
    }
    this.setState({
      currentValue: initialValue,
      lastSentValue: initialValue
    });
  }

  componentWillReceiveProps( nextProps) {
    if (nextProps.value != this.props.value) {
      let newValue = this.convertToDisplayFormat(nextProps.value, 'dateTime');
      this.setState({
        currentValue: newValue
      });
    }
  }

  convertToDisplayFormat = (date, format) => {
    const { dateTimeDisplayFormat, timeDisplayFormat, dateDisplayFormat } = this.props;
    let displayFormat;

    switch (format) {
      case 'time' :
        displayFormat = moment(date).format(timeDisplayFormat);
      break;
      case 'date':
        displayFormat = moment(date).format(dateDisplayFormat);
      break;
      case 'dateTime':
      default :
        displayFormat = moment(date).format(dateTimeDisplayFormat);
    }
    return displayFormat;
  }

  convertToDataFormat = (date) => {
    const { type } = this.props;
    let dataFormat;
    switch (type) {
      case 'java.time.LocalDate' :
        dataFormat = moment(date).format('YYYY-MM-DD');
      break;
      case 'java.time.LocalDateTime' :
      default :
        dataFormat = moment(date).format();
    }
    return dataFormat;
  }

  handleChangeMobile = (event) => {
    const {type} = this.props;
    const {currentValue} = this.state;

    let date;
    let time;

    if (type != 'java.time.LocalDate' ) {

      if (event.target.type == 'date') {

        date = this.convertToDisplayFormat(event.target.value, 'date');
        time = this.convertToDisplayFormat(currentValue, 'time');
        let dateTime = date + ' ' + time;

        this.setState({
          shouldValidate: false
        }, () => {
          this.changeValueProp(dateTime);
        });
      }

      else if (event.target.type == 'time') {

        date = this.convertToDisplayFormat(currentValue, 'date');
        time = this.convertToDisplayFormat(event.target.value, 'time');
        let dateTime = date + ' ' + time;
        
        if (event.type == 'blur' || event.keyCode == '13') {

          this.setState({
            shouldValidate: true
          }, () => {
            this.changeValueProp(dateTime);
          });
        } else {

          this.setState({
            shouldValidate: false
          }, () => {
            this.changeValueProp(dateTime);
          });

        }
      }
    }
    else {
      date = this.convertToDisplayFormat(event.target.value, 'date');
      this.changeValueProp(date );
    }
  }

  handleBlur = (value) => {
    this.setState({
      lastSentTime: null
    }, () => {
      this.changeValueProp(value);
    });
  }

  changeValueProp = (value) => {
    const { handleOnChange, validation } = this.props;
    const { shouldValidate, lastSentValue, isMobile } = this.state;
    let sentValue = this.convertToDataFormat(value);

    handleOnChange(sentValue);

    if (validation && shouldValidate) {
      if (sentValue != lastSentValue || isMobile ) {
        this.validateDate(sentValue);
      }
    }

    this.setState({
      lastSentValue: sentValue
    });
  }

  validateDate = (value) => {
    const { validation, identifier, validationList} = this.props;
    validation(value, identifier, validationList);
  }

  render() {
    const { className, style, validationStatus, name, type, mandatory, showTimeSelect, dateTimeDisplayFormat, dateDisplayFormat, timeDisplayFormat,  } = this.props;
    const { currentValue, isMobile } = this.state;
    const componentStyle = { ...style, };

    const dateTime = this.convertToDisplayFormat(currentValue, 'dateTime');
    const dateWeb = this.convertToDisplayFormat(currentValue, 'date');
    const dateMobile = this.convertToDisplayFormat(currentValue, 'date');
    const timeMobile = this.convertToDisplayFormat(currentValue, 'time');
  
    return (
      <div className={`input input-date-picker ${className} ${isMobile ? `${validationStatus} mobile` : ''} `} style={componentStyle}>
        { name ? <div className='input-header'>
          { name && <Label className="input-date-picker-label" text={name} /> }
          { mandatory ? <Label className='input-label-required' textStyle={ !validationStatus ? {color: '#cc0000'} : null} text="*  required" /> : null}
        </div> : null }
        {
          isMobile ?
            <div className='input-date-picker-mobile' style={{display: 'flex'}}>
              <input
                type='date'
                onChange={this.handleChangeMobile}
                value={dateMobile}
              />
              { type == 'java.time.LocalDate' ? null :
                <input
                  type='time'
                  onChange={this.handleChangeMobile}
                  onBlur={this.handleChangeMobile}
                  onKeyDown={this.handleChangeMobile}
                  value={timeMobile}
                />
              }
            </div>

          : (<DatePicker
            className={`${validationStatus} input-date-picker-main`}
            calendarClassName=""

            dateFormat={(type == 'java.time.LocalDateTime') ? dateTimeDisplayFormat : dateDisplayFormat }
            timeFormat={timeDisplayFormat}
            selected={(type == 'java.time.LocalDateTime') ? moment(dateTime) : moment(dateWeb) }
            
            onChange={this.changeValueProp}

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
