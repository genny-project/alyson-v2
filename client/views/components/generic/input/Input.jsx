import './input.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { InputDate, InputSlider, InputDatePicker, InputDropdown, InputTime, InputText, InputTextarea, InputCheckbox, InputAddress, InputUploadPhoto } from '../';

class Input extends Component {
  static defaultProps = {
    className: '',
    type: ''
  }

  static propTypes = {
    className: string,
    type: string,
  }

  render() {

    const { type } = this.props;
    let items = ['Bananas', 'Oranges', 'Apples', 'Other']

    switch(type) {
        case "java.lang.String":
            return ( <InputText {...this.props}/> );
        case "textarea":
            return ( <InputTextarea {...this.props}/> );
        case "checkbox":
            return ( <InputCheckbox {...this.props}/> );
        case "java.time.Date":
            return ( <InputDate items={items} {...this.props}/> );
        case "datepicker":
            return ( <InputDatePicker {...this.props}/> );
        case "dropdown":
            return ( <InputDropdown items={items} {...this.props}/> );
        // case "time":
        //     return ( <InputTime {...this.props}/> );
        case "slider":
            return ( <InputSlider {...this.props}/> );
        case "upload-photo":
            return ( <InputUploadPhoto {...this.props}  /> );
        case "password":
            return ( <InputText {...this.props}/> );
        case "address":
            return ( <InputAddress {...this.props} /> );
        default:
            return ( <InputText {...this.props}/> );
    }
  }
}

export default Input;
