import './input.scss';
import React, { Component } from 'react';
import { string, func } from 'prop-types';
import {
    InputDate,
    InputButton,
    InputSlider,
    InputDatePicker,
    InputDropdown,
    InputTime,
    InputText,
    InputTextarea,
    InputCheckbox,
    InputAddress,
    InputUploadPhoto
} from 'views/components';

class Input extends Component {

  static defaultProps = {
    className: '',
    type: ''
  }

  static propTypes = {
    className: string,
    type: string,
    onValidation: func,
    onValidationFailure: func,
  }

  state = {
    validationStatus: null,
  }

  validateInput = (value, identifier, validationList) => {

    if(value == this.props.value) return;

    if ( validationList.length > 0) {

      const valResult = validationList.every( validation => new RegExp(validation.regex).test( value ));
      this.validateValue(valResult, value);

    }
    else {

      const valResult = new RegExp(/.*/).test( value );
      this.validateValue(valResult, value);

    }
  }

  validateValue = ( valResult, value ) => {

    if ( valResult ){

        this.validationStyle('success');
        if(this.props.onValidation) this.props.onValidation(value, this.props.data, this.props.mandatory);
    }
    else {

      this.validationStyle('error');
      console.log(this.props);
      if(this.props.onValidationFailure) this.props.onValidationFailure(this.props.data, this.props.mandatory);
    }
  }

  validationStyle = (resultString) => {
    this.setState({
      validationStatus: resultString,
    });
  }

  render() {

    const { type, identifier } = this.props;
    const { validationStatus } = this.state;

    let items = this.props.options;

    ////TODO: remove this.
    // testing facebook
    if(identifier == 'QUE_FB_BASIC') {
        return (
            <InputButton {...this.props} className="facebook" name="" type="facebook" buttonCode={'SOC_FB_BASIC_GENNY'} />
        );
    }

    else {

        switch(type) {
            case 'TextArea':
                return ( <InputTextarea
                    {...this.props}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                /> );
            case 'Boolean':
                return ( <InputCheckbox
                    {...this.props}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                /> );
            case 'LocalDate':
                return ( <InputDatePicker
                    {...this.props}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                /> );
            case 'dropdown':
                return ( <InputDropdown
                    items={items}
                    {...this.props}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                /> );
            case 'slider':
                return ( <InputSlider
                    {...this.props}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                /> );
            case 'upload-photo':
                return ( <InputUploadPhoto {...this.props} /> );
            case 'address':
                return ( <InputAddress {...this.props} /> );
            case 'Button':
                return <InputButton {...this.props} />
            default:
                return ( <InputText
                    {...this.props}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                /> );
        }
    }

  }
}

export default Input;
