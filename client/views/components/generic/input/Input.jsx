import './input.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { InputDropdown, InputEmail, InputPassword, InputPhone, InputText, InputTextarea, InputMasked } from '../';

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
    switch(type) {
        case "text":
            return ( <InputText {...this.props}/> );
        {/* case "textarea":
            return ( <InputTextarea {...this.props}/> );
        case "email":
            return ( <InputEmail {...this.props}/> );
        case "password":
            return ( <InputPassword {...this.props}/> );
        case "phone":
            return ( <InputPhone {...this.props}/> );
        case "dropdown":
            return ( <InputDropdown {...this.props}/> ); */}
        default:
            return ( <InputText {...this.props}/> );
    }
  }
}

export default Input;
