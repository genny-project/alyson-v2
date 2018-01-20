import './dropdown.scss';
import React, { Component } from 'react';
import { string, any, bool, object } from 'prop-types';
import components from 'utils/genny/layout-loader/components.js';
import { JSONLoader } from '@genny-project/layson';

class Dropdown extends Component {
  static defaultProps = {
    className: '',
    opened: null,
    showTag: true,
    inline: false,
  }

  static propTypes = {
    className: string,
    style: object,
    children: any,
    open: bool,
    header: any,
    showTag: bool,
    inline: bool,
    contentStyle: object,
    tagStyle: object,
    noDropdownStyle: string,
  }

  state = {
    isOpen: false
  }

  handleBlur = () => {

    this.setState({
      isOpen: false,
      parentIsOpen: false,
    });
  }

  handleClick = () => {
    this.setState({ isOpen: !this.state.isOpen});
  }

  renderHeader = () => {

    const { header } = this.props;

    if (header ){
      if (header.$$typeof ) {
        return header;
      } else if (Array.isArray(header)) {
        let layout = {layout: header};
        return <JSONLoader layout={layout} componentCollection={components} />;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  render() {
    const { className, children, style, contentStyle, tagStyle, open, noDropdownStyle, showTag, inline,  } = this.props;
    let { isOpen, } = this.state;
    if(open != undefined) isOpen = open; // open props overrides

    return (
      <div className={`dropdown ${className} ${ inline ? 'inline' : '' }`} onBlur={ inline ? null : this.handleBlur}  tabIndex='-1' style={style} >
        <div className='dropdown-header' onClick={this.handleClick} style={isOpen ? { 'transition': 'all 0.1s', 'transform': 'rotate(180deg)' } : { 'transition': 'all 0.1s', 'transform': 'rotate(0deg)' }}>
          {this.renderHeader()}
        </div>
        { isOpen ?
          <div className={`dropdown-content ${noDropdownStyle ? 'no-style' : ''}`} style={contentStyle} >
            { showTag && !inline ? <div className='dropdown-tag' style={tagStyle}></div> : null }
            {children}
          </div>
        : null }
      </div>
    );
  }
}

export default Dropdown;
