import './dropdown.scss';
import React, { Component } from 'react';
import { string, object, any, bool, element } from 'prop-types';
import {  } from '../';

class Dropdown extends Component {

  static defaultProps = {
    className: '',
    opened: null,
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
    open: bool,
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
    const { className, children, style, contentStyle, tagStyle, header, open, noDropdownStyle } = this.props;
    let { isOpen, } = this.state;

    if(open != undefined) isOpen = open; // open props overrides
        
    return (
      <div className={`dropdown ${className}`} onBlur={this.handleBlur} onFocus={this.handleFocus} tabIndex='-1' style={style} >
        <div className='dropdown-header'>
          {header}
        </div>
        { isOpen ?
          <div className={`dropdown-content ${noDropdownStyle ? 'no-style' : null}`} style={contentStyle} >
            <div className='dropdown-tag' style={tagStyle}></div>
            {children}
          </div>
        : null }
      </div>
    );
  }
}

export default Dropdown;
