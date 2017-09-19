import './input.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { InputText, InputMasked } from '../';


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
        case "masked":
            return ( <InputMasked {...this.props}/> )
        case "text":
            return ( <InputText {...this.props}/> );
        default:
            return ( <InputText {...this.props}/> );
    }
  }
}

export default Input;
