import './inputPhone.scss';
import React, { Component } from 'react';
import { string, array, bool } from 'prop-types';
import MaskedInput from 'react-text-mask';

class InputPhone extends Component {
  static defaultProps = {
    className: '',
    name: '',
    placeholder: '',
    pipe: '',
    validation: '',
    guide: false
  }

  static propTypes = {
    className: string,
    name: string,
    placeholder: string,
    pipe: string,
    validation: string,
    guide: bool,
  }

  render() {
    const { className, name, placeholder, pipe, validation, guide } = this.props;
    return (
      <div className={`input-phone ${className}`}>
        <span>{name}</span>
        <span>{validation}</span>
        <MaskedInput mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} placeholder={placeholder} pipe={pipe} guide={guide}/>
      </div>
    );
  }
}

export default InputPhone;