import './inputTime.scss';
import React, { Component } from 'react';
import { string, object, bool, number } from 'prop-types';
import { InputDropdown, Label } from '../';
import moment from 'moment';

class InputTime extends Component {

  static defaultProps = {
    className: '',
    isTwentyFourHour: false,
    minuteIncrement: 5
  }

  static propTypes = {
    className: string,
    style: object,
    isTwentyFourHour: bool,
    minuteIncrement: number
  }

  state = {
    hour: null,
    minute: null,
    format: null,
    validationStatus: null,
  }

  getItemsForFormat = () => {
    const format = this.props.isTwentyFourHour ? false : ['AM', 'PM'];
    return format;
  }
  
  getItemsForHours = () => {
    
    let hours = [...Array(this.props.isTwentyFourHour ? 24 : 12).keys()].map(x => this.props.isTwentyFourHour ? x : x + 1).map(String);
    return hours;
  }

  getItemsForMinutes = () => {
    const increment = this.props.minuteIncrement;
    let minutes = [...Array(60/increment).keys()].map(x => x * increment).map(String).map(x => x.length < 2 ? "0" + x : x);
    return minutes;
  }

  onDropdownChange = (newValue, identifier) => {
    console.log(newValue, identifier);
    switch (identifier) {
      case 'hour' :
        this.setState({ hour: newValue }, () => {
          this.dropdownPrevalidation();
        });
      break;
      case 'minute':
      this.setState({ minute: newValue }, () => {
        this.dropdownPrevalidation();
      });
      break;
      case 'format':
      this.setState({ format: newValue }, () => {
        this.dropdownPrevalidation();
      });
      break;
      default:
        console.log("unknown identifier");
    }
  }

  dropdownPrevalidation = () => {
    const { validationList } = this.props;
    ///console.log(validationList);

    const { hour, minute, format } = this.state;
  
    if ( hour && minute && format ) {
      //TODO load date format from ask
      const newDate = hour + ":" + minute + " " + format;

      if ( validationList.length > 0 ) {
        const valResult = validationList.every( validation => new RegExp(validation.regex).test( newDate ));
        console.log(valResult)
        this.validateValue(valResult, newDate);
      } else {
        //window.alert("No regex supplied");
        //this.sendAnswer(event.target.value);
        const valResult = new RegExp(/.*/).test( newDate );
        console.log(valResult);
        this.validateValue(valResult, newDate);
      }
    }
  }

  validateValue = ( valResult, value ) => {
    if ( valResult ){
      this.validationStyle('success');
      if(this.props.onValidation) {
        this.props.onValidation(value, this.props.identifier);
      }

    } else {
      this.validationStyle('error');
    }
  }

  validationStyle = (resultString) => {
    this.setState({
      validationStatus: resultString,
    });
  }

  render() {
 	  const { className, style, items, name, isTwentyFourHour, minuteIncrement } = this.props;
    const { hours, minutes, format, validationStatus } = this.state;
    const componentStyle = { ...style, };
    const itemFormat = this.getItemsForFormat();
    const itemHours = this.getItemsForHours();
    const itemMinutes = this.getItemsForMinutes();
    
    return (
      <div className={`input-time ${className} ${validationStatus}`}>
        {name ? <Label className="input-time-label" text={name} /> : null }
        <InputDropdown {...this.props} items={itemHours}  className="input-time-dropdown hour" name={null} onValidation={this.onDropdownChange} identifier={'hour'} noValidation hint={'hour'}/>
        <InputDropdown {...this.props} items={itemMinutes} className="input-time-dropdown minute" name={null} onValidation={this.onDropdownChange} identifier={'minute'} noValidation hint={'minute'}/>
        { !isTwentyFourHour ? 
          <InputDropdown {...this.props} items={itemFormat} className="input-time-dropdown format" name={null} onValidation={this.onDropdownChange} identifier={'format'} noValidation hint={'format'}/>
        : null}
      </div>
    );
  }
}

export default InputTime;
