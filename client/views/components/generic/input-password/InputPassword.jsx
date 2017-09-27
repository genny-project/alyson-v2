import './inputPassword.scss';
import React, { Component } from 'react';
import { string, bool } from 'prop-types';

class InputPassword extends Component {
  static defaultProps = {
    className: '',
    name: '',
    readOnly: false,
    defaultValue: '',
    optional: false,
    placeholder: '',
    label: '',
  }

  static propTypes = {
    className: string,
    name: string,
    readOnly: bool,
    defaultValue: string,
    optional: bool,
    placeholder: string,
    label: string,
  }

  render() {
    const { className, name, readOnly, defaultValue, optional, placeholder, label } = this.props;
    return (
      <div className={`input-text ${className}`}>
        {label ? <Label>{label}</Label> : null }
        {optional ? <span className='optional'><i>(optional)</i></span> : null }
        <input
          type="password"
          disabled={readOnly}
          defaultValue={defaultValue}
          placeholder={placeholder}
        />
      </div>
    );
  }
}

export default InputPassword;