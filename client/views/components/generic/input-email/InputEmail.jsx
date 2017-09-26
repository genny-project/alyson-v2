import './inputEmail.scss';
import React, { Component } from 'react';
import { string, array, bool } from 'prop-types';
import MaskedInput from 'react-text-mask';
import emailMask from 'text-mask-addons/dist/emailMask'

class InputEmail extends Component {
  static defaultProps = {
    className: '',
    type: '',
    name: '',
    placeholder: '',
    guide: false,
    pipe: '',
  }

  static propTypes = {
    className: string,
    type: string,
    name: string,
    placeholder: string,
    guide: bool,
    pipe: string
  }

  render() {
    const { className, type, name, placeholder, guide, pipe } = this.props;
    const mask = emailMask;
    return (
      <div className={`input-masked ${className}`}>
        <span>{name}</span>
        <MaskedInput mask={mask} placeholder={placeholder} guide={guide} pipe={pipe} />
      </div>
    );
  }
}

export default InputEmail;