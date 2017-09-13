import './inputText.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';

class InputText extends Component {
  static defaultProps = {
    className: '',
    type: '',
  }

  static propTypes = {
    className: string,
    type: string,
  }

  render() {
    const { className, type, } = this.props;
    return (
      <div className={`input-text ${className}`}>
        <input type={type} />
      </div>
    );
  }
}

export default InputText;