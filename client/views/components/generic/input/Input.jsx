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
    InputUploadPhoto,
    InputUpload
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
    
    switch(type) {

        // socials
        case 'Facebook':
                return <InputButton {...this.props} onClick={this.props.onClickEvent} className="facebook" name="" type="facebook" />
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
        case 'Upload':
            return ( <InputUpload
                {...this.props}
                validation={this.validateInput}
                validationStatus={validationStatus} /> );
        case 'address':
            return ( <InputAddress {...this.props} /> );
        case 'Event Button':
            return <InputButton {...this.props} onClick={this.props.onClickEvent} />
        case 'Answer Button':
        case 'Button':
            return <InputButton {...this.props} />
        case 'Time':
            return ( <InputTime
                {...this.props}
                validation={this.validateInput}
                validationStatus={validationStatus}
            /> );
        default:
            return ( <InputText
                {...this.props}
                validation={this.validateInput}
                validationStatus={validationStatus}
            /> );
    }
  }
}

export default Input;
