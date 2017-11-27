import './input.scss';
import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { InputDate, InputSocial, InputSlider, InputDatePicker, InputDropdown, InputTime, InputText, InputTextarea, InputCheckbox, InputAddress, InputUploadPhoto } from '../';

//TODO: to remove
import { GennySocialButton } from './../../';

class Input extends Component {
  static defaultProps = {
    className: '',
    type: ''
  }

  static propTypes = {
    className: string,
    type: string,
    onValidation: func,
  }

  state = {
    validationStatus: null,
  }

  validateInput = (value, identifier, validationList) => {

    if ( validationList.length > 0 ) {
      const valResult = validationList.every( validation => new RegExp(validation.regex).test( value ));
      console.log(valResult)
      this.validateValue(valResult, value);
    } else {
      //window.alert("No regex supplied");
      //this.sendAnswer(event.target.value);
      const valResult = new RegExp(/.*/).test( value );
      console.log(valResult);
      this.validateValue(valResult, value);
    }
  }

  validateValue = ( valResult, value ) => {

    if ( valResult ){
      this.validationStyle('success');
        if(this.props.onValidation) this.props.onValidation(value, this.props.identifier);
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

    const { type, identifier } = this.props;
    const {validationStatus } = this.state;
    let items = ['Bananas', 'Oranges', 'Apples', 'Other']

    //TODO: remove this.
    // testing facebook
    if(identifier == "QUE_FB_BASIC") {

        return (
            // <GennySocialButton type="facebook" buttonCode={"SOC_FB_BASIC_GENNY"}/>
            <InputSocial {...this.props} type="facebook" buttonCode={"SOC_FB_BASIC_GENNY"}  />
        );
    }
    else {

        switch(type) {
            case "textarea":
                return ( <InputTextarea
                    {...this.props}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                /> );
            case "checkbox":
                return ( <InputCheckbox
                    {...this.props}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                /> );
            // case "java.time.Date":
            //     return ( <InputDate items={items}
            //         {...this.props}/> );
            case "datepicker":
                return ( <InputDatePicker
                    {...this.props}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                /> );
            case "dropdown":
                return ( <InputDropdown
                    items={items}
                    {...this.props}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                /> );
            // case "time":
            //     return ( <InputTime {...this.props}/> );
            case "slider":
                return ( <InputSlider
                    {...this.props}
                    validation={this.validateInput}
                    validationStatus={validationStatus}    
                /> );
            case "upload-photo":
                return ( <InputUploadPhoto {...this.props} /> );
            // case "password":
            //     return ( <InputText {...this.props}/> );
            case "address":
                return ( <InputAddress {...this.props} /> );
            case "java.lang.String":
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
