import './dropdown.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import {  } from '../';

class Dropdown extends Component {

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
 	  const { className, children, style, visible } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };

    return ( visible ? <div className={`dropdown ${className}`}>{children}</div> : null );
  }
}

export default Dropdown;
