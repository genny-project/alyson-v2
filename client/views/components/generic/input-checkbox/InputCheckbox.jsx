import './inputCheckbox.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import {  } from '../';

class InputCheckbox extends Component {

  static defaultProps = {
    className: '',
    checked: '',
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
    checked: string,
  }

  state = {
  }

  render() {
 	  const { className, children, style, checked } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`input-checkbox ${className}`}>
        <input type="checkbox"/>
      </div>
    );
  }
}

export default InputCheckbox;
