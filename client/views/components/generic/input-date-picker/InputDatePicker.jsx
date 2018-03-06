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
    dateDisplayFormat: 'yyyy-MM-dd',
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

    if ( value != null && value != '' ) {

      const date = new Date( value );
      this.setState({
        currentValue: date,
        lastSentValue: date
      });
    }
    else {
      this.setState({
        currentValue: null,
        lastSentValue: null
      });
    }
  }

  componentWillReceiveProps( nextProps) {
      
    if (nextProps.value != this.props.value && nextProps.value != null && nextProps.value != '' ) {
    this.setState({
        currentValue: new Date( nextProps.value ),
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

  handleChangeMobile = field => (event) => {
    const { value } = event.target;
    const { currentValue } = this.state;
    let date;

    if ( field === 'time' ) {
      const hours = value.split( ':' )[0];
      const minutes = value.split( ':' )[1];

      date = currentValue ? new Date( currentValue ) : new Date();
      date.setHours( hours, minutes );
    } else {
      date = new Date( value );
    }

    this.setState({ currentValue: new Date( date ) }, () => {
      const formatted = this.convertToDataFormat( this.state.currentValue );

      this.changeValueProp( formatted );
    });
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
                className='input-field'
                onChange={this.handleChangeMobile( 'date' )}
                value={currentValue ? moment( currentValue ).format( 'YYYY-MM-DD' ) : null}
              />
              { type == 'java.time.LocalDate' ? null :
                <input
                  type='time'
                  className='input-field'
                  onChange={this.handleChangeMobile( 'time' )}
                  // onBlur={this.handleChangeMobile}
                  // onKeyDown={this.handleChangeMobile}
                  value={currentValue ? moment( currentValue ).format( 'HH:mm' ) : null}
                />
              }
            </div>

          : (<DatePicker
            className={`${validationStatus} input-field`}

            dateFormat={(type == 'java.time.LocalDateTime') ? dateTimeDisplayFormat : dateDisplayFormat }
            timeFormat={timeDisplayFormat}
            selected={currentValue != null ? moment( currentValue ) : null}
            
            onChange={this.changeValueProp}

            peekNextMonth
            showMonthDropdown
            showYearDropdown
            minDate={moment().subtract(100, 'years')}
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
