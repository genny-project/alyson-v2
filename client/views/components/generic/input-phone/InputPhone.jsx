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
    guide: false,
    label: '',
  }

  static propTypes = {
    className: string,
    name: string,
    placeholder: string,
    pipe: string,
    validation: string,
    guide: bool,
    label: string,
  }

  render() {
    const { className, name, placeholder, pipe, validation, guide, label } = this.props;
    return (
      <div className={`input-phone ${className}`}>
        {label ? <Label>{label}</Label> : null }
        <span>{validation}</span>
        <MaskedInput mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} placeholder={placeholder} pipe={pipe} guide={guide}/>
      </div>
    );
  }
}

export default InputPhone;