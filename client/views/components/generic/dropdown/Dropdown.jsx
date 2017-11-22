import './dropdown.scss';
import React, { Component } from 'react';
import { string, object, any, bool, element } from 'prop-types';
import {  } from '../';

class Dropdown extends Component {

  static defaultProps = {
    className: '',
    opened: null,
    closed: null,
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
    open: bool,
    closed: bool,
    header: element,
  }

  state = {
    isOpen: false
  }

  handleBlur = () => {

    this.setState({
      isOpen: false
    });
  }

  handleFocus = () => {
    this.setState({
      isOpen: true
    });
  }

  render() {
    const { className, children, style, header, open, noDropdownStyle } = this.props;
    const { isOpen, } = this.state;
    const componentStyle = { ...style, };


    return (
      <div className={`dropdown ${className}`} onBlur={this.handleBlur} onFocus={this.handleFocus} tabIndex='-1' >
        <div className='dropdown-header'>
          {header}
        </div>
        { isOpen || open && !closed ?
          <div className={`dropdown-content ${noDropdownStyle ? 'no-style' : null}`} >
            <div className='dropdown-tag'></div>
            {children}
          </div>
        : null }
      </div>
    );
  }
}

export default Dropdown;
