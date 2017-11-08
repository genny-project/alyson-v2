import './inputDate.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { Label, InputDropdown } from '../';

class InputDate extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: object,
  }

  state = {
    day: null,
    month: null,
    year: null,
    validationStatus: null,
  }

  onDropdownChange = (newValue, identifier) => {
    console.log(newValue, identifier);
    switch (identifier) {
      case 'day' :
        this.setState({ day: newValue }, () => {
          this.dropdownPrevalidation();
        });
      break;
      case 'month':
      this.setState({ month: newValue }, () => {
        this.dropdownPrevalidation();
      });
      break;
      case 'year':
      this.setState({ year: newValue }, () => {
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

    const { day, month, year } = this.state;
  
    if (day && month && year) {
      //TODO load date format from ask
      const newDate = day + "/" + month + "/" + year;

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
 	  const { className, style, items, name, } = this.props;
    const { day, month, year, validationStatus } = this.state;
    const componentStyle = { ...style, };
    

    return (
      <div className={`input-date ${className} ${validationStatus}`}>
        {name ? <Label className="input-date-label" text={name} /> : null }
        <InputDropdown {...this.props} items={[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]}  className="input-date-dropdown day" name={null} onValidation={this.onDropdownChange} identifier={'day'} noValidation hint={'day'}/>
        <InputDropdown {...this.props} items={['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']} className="input-date-dropdown month" name={null} onValidation={this.onDropdownChange} identifier={'month'} noValidation hint={'month'}/>
        <InputDropdown {...this.props} items={[1980,1990,2000,2010]} className="input-date-dropdown year" name={null} onValidation={this.onDropdownChange} identifier={'year'} noValidation hint={'year'}/>
      </div>
    );
  }
}

export default InputDate;
