import './input.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { InputText, InputRadio } from '../';

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
    console.log(type);

    switch(type) {
        case "radio":
            return ( <InputRadio {...this.props}/> );
        case "text":
            return ( <InputText {...this.props}/> );
        default:
            return ( <InputText {...this.props}/> );
    }
  }
}

export default Input;