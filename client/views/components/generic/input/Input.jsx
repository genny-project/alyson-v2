import './input.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { InputDate, InputSlider, InputDropdown, InputDropdown2, InputText, InputTextarea, InputCheckbox, InputAddress } from '../';

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
        case "date":
            return ( <InputDate items={items} {...this.props}/> );
        case "dropdown":
            return ( <InputDropdown {...this.props}/> );
        case "dropdown2":
            return ( <InputDropdown2 items={items} {...this.props}/> );
        case "slider":
            return ( <InputSlider {...this.props}/> );
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
