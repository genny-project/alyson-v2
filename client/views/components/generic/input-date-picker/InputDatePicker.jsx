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

    dateDataFormat: 'YYYY-MM-DD',
    timeDataFormat: 'HH:mm',
    dateDisplayFormat: 'DD-MM-YYYY',
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
    
    dateDataFormat: string,
    timeDataFormat: string,
    dateDisplayFormat: string,
    timeDisplayFormat: string,

    handleOnChange: func,

  }

  state = {
    shouldValidate: true,
    displayValue: null,
  }

  //setInitial Value
  componentDidMount() {
    const { value } = this.props;

    console.log('1 --- mounting');

    let initialValue;    
    if (typeof value == string) {
      initialValue = this.convertToDisplayFormat(value);
    }
    else {
      initialValue = moment().toISOString();
      initialValue = this.convertToDisplayFormat(initialValue);
    }
    this.setState({
      displayValue: initialValue
    });
  }

  componentWillReceiveProps( nextProps) {
    if (nextProps.value != this.props.value) {
      let newValue = this.convertToDisplayFormat(nextProps.value);
      this.setState({
        displayValue: newValue
      });
    }
  }
    
  convertToDisplayFormat = (date) => {
    const { type, dateDisplayFormat } = this.props;
    let displayFormat;

    console.log('2 --- convert',displayFormat);

    switch (type) {
      case 'java.time.LocalDate' :
        displayFormat = moment(date).format(dateDisplayFormat);
      break;
      case 'java.time.LocalDateTime':
      default :
        displayFormat = moment(date).format('DD-MM-YYYY HH:mm');
    }
    return displayFormat;
  }

  getMobileValues = (type) => {
    
    const { dateDisplayFormat, timeDisplayFormat} = this.props;
    const { displayValue } = this.state;

    if (type == 'date') { 

      console.log('3 --- mobile date');
      //console.log(displayValue);     
      //console.log(dateDisplayFormat);     
      let date = moment(displayValue, dateDisplayFormat).format(dateDisplayFormat);
      //console.log(date);
      return date;
    }
    if (type == 'time') {
      console.log('4 --- mobile time');
      //console.log(displayValue);      
      let time = moment(displayValue, timeDisplayFormat ).format(timeDisplayFormat);
      //console.log(time);
      return time;
    }
  }

  convertToDataFormat = (date) => {
    const { type, dateDataFormat, timeDataFormat} = this.props;
    let dataFormat;
    const dataTimeFormat = dateDataFormat + ' ' + timeDataFormat;

    switch (type) {
      case 'java.time.LocalDate' :
        dataFormat = moment(date).format(dateDataFormat);
      break;
      case 'java.time.LocalDateTime' :
      default :
        dataFormat = moment(date, dataTimeFormat).toISOString();
    }

    return dataFormat;
  }

  handleChangeWeb = (value) => {
    const { handleOnChange } = this.props;

    if (handleOnChange) {
      this.changeValueProp(value);
    }
  }

  handleChangeMobile = (event) => {
    const {type} = this.props;
    
    let date;
    let time;

    console.log(event.type);

    if (type != 'java.time.LocalDate' ) {
    //if date+time
    
      if (event.target.type == 'date') {
        //if date input
        date = event.target.value;
        time = this.getMobileValues('time');
        let dateTime = date + ' ' + time;
        this.setState({
          shouldValidate: false
        }, () => { 
          this.changeValueProp(dateTime);
        });
      }
      
      else if (event.target.type == 'time') {
        //if time input
        date = this.getMobileValues('date');
        time = event.target.value;
        let dateTime = date + ' ' + time;

        if (event.type == 'blur' || event.keyCode == '13') {
          //if blur or enter key
          this.setState({
            shouldValidate: true
          }, () => { 
            this.changeValueProp(dateTime);
          });
        } else {
          //if onChange
          this.setState({
            shouldValidate: false
          }, () => { 
            this.changeValueProp(dateTime);
          });
          
        }
      } 
    } 
    else {

      //if date only
      //get value, and send + change
      date = event.target.value;
      this.changeValueProp(date );
    }
  }

  changeValueProp = (value) => {
    const { handleOnChange, validation } = this.props;
    const { shouldValidate } = this.state;
   
    let sentValue = this.convertToDataFormat(value);
    console.log('sending', sentValue);
    
    handleOnChange(sentValue);
    
    if (validation && shouldValidate ) {
      this.validateDate(sentValue);
    }
  }

  validateDate = (value) => {
    const { validation, identifier, validationList} = this.props;
    
    validation(value, identifier, validationList);
  }

  render() {
    const { className, style, validationStatus, name, dateDisplayFormat, type, timeDisplayFormat, mandatory, showTimeSelect } = this.props;
    const { displayValue } = this.state;
    const componentStyle = { ...style, };
    
    const isMobile = window.getScreenSize() === 'sm';

    const dateMobile = this.getMobileValues('date');
    const timeMobile = this.getMobileValues('time');
    const dateTimeFormat = (type == 'java.time.LocalDateTime') ? dateDisplayFormat + ' ' + timeDisplayFormat : dateDisplayFormat;

    console.log('5 --- rendering', displayValue);
    
    return (
      <div className={`input input-date-picker ${className} ${isMobile ? `${validationStatus} mobile` : ''} `} style={componentStyle}>
        { name ? <div className='input-header'>
          { name && <Label className="input-date-picker-label" text={name} /> }
          { mandatory ? <Label className='input-label-required' textStyle={ !validationStatus ? {color: '#cc0000'} : ''} text="*  required" /> : null}
        </div> : null }
        <span>{displayValue}</span>
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
            
            dateFormat={dateTimeFormat}
            timeFormat={timeDisplayFormat}

            selected={moment(displayValue, dateTimeFormat)}
            onChange={this.handleChangeWeb}

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
