import './dropdown.scss';
import React, { Component } from 'react';
import { string, any, bool, element, object } from 'prop-types';

class Dropdown extends Component {
  static defaultProps = {
    className: '',
    opened: null,
    showTag: true
  };

  static propTypes = {
    className: string,
    style: string,
    children: any,
    open: bool,
    header: element,
    showTag: bool,
    dropDownContentStyle: object
  };

  state = {
    isOpen: false
  };

  handleBlur = () => {
    this.setState({
      isOpen: false,
      parentIsOpen: false
    });
  };

  handleClick = e => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const {
      className,
      children,
      style,
      contentStyle,
      tagStyle,
      header,
      open,
      noDropdownStyle,
      showTag,
      dropType,
      dropDownContentStyle
    } = this.props;

    console.log('###################################################======>>> noDropdownstyle', dropDownContentStyle);
    let { isOpen } = this.state;

    if (open != undefined) isOpen = open; // open props overrides

    return <div className={`dropdown ${className}`} onClick={this.handleClick} onBlur={this.handleBlur} tabIndex="-1" style={dropDownContentStyle}>
        <div className="dropdown-header">{header}</div>
        {isOpen ? <div className={`dropdown-content ${noDropdownStyle ? 'no-style' : null}`} style={dropDownContentStyle}>
            {showTag ? <div className="dropdown-tag" style={tagStyle} /> : null}
            {children}
          </div> : null}
      </div>;
  }
}

export default Dropdown;
