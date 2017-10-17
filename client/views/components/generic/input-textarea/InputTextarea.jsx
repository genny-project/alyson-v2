import './inputTextarea.scss';
import React, { Component } from 'react';
import { string, bool } from 'prop-types';

class InputTextarea extends Component {
  static defaultProps = {
    className: '',
    name: '',
    label: '',
  }

  static propTypes = {
    className: string,
    name: string,
    label: string,
  }

  render() {
    const { className, name, label } = this.props;
    return (
      <div className={`input-textarea ${className}`}>
         {label ? <Label>{label}</Label> : null }
        <textarea />
      </div>
    );
  }
}

export default InputTextarea;