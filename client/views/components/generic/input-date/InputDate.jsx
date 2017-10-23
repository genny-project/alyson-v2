import './inputDate.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import {  } from '../';

class InputDate extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
  }

  state = {
  }

  render() {
 	  const { className, children, style } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`input-date ${className}`}>
        {children}
      </div>
    );
  }
}

export default InputDate;
