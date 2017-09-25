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
    placeholder: ''
  }

  static propTypes = {
    className: string,
    name: string,
    readOnly: bool,
    defaultValue: string,
    optional: bool,
    placeholder: string,
  }

  render() {
    const { className, name, readOnly, defaultValue, optional, placeholder } = this.props;
    return (
      <div className={`input-text ${className}`}>
        {name ? <span>{name}</span> : null }
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