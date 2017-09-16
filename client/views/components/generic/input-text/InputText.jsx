import './inputText.scss';
import React, { Component } from 'react';
import { string, bool } from 'prop-types';

class InputText extends Component {
  static defaultProps = {
    className: '',
    type: '',
    name: '',
    readOnly: false,
    defaultValue: '',
    optiona: false,
    pattern: ''
  }

  static propTypes = {
    className: string,
    type: string,
    name: string,
    readOnly: bool,
    defaultValue: string,
    optional: bool,
    pattern: string,
  }

  render() {
    const { className, type, name, readOnly, defaultValue, optional, pattern } = this.props;
    return (
      <div className={`input-text ${className}`}>
        {name ? <span>{name}</span> : null }
        {optional ? <span className='optional'><i>(optional)</i></span> : null }
        <input
          type={type}
          disabled={readOnly}
          defaultValue={defaultValue}
          pattern={pattern}
        />
      </div>
    );
  }
}

export default InputText;