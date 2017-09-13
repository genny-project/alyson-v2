import './inputRadio.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';

class InputRadio extends Component {
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
      <div className={`input-radio ${className}`}>
        <input type={type} name="radio" value="radio" />
      </div>
    );
  }
}

export default InputRadio;