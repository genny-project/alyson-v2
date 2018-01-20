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
    isSlide: true,
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
    isSlide: bool,
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

  renderHeader = (isOpen) => {

    const { header, } = this.props;

    let headerContent;
    
    if (header.$$typeof ) {
      headerContent = header;
    } else if (Array.isArray(header)) {
      let layout = {layout: header};
      headerContent = <JSONLoader layout={layout} componentCollection={components} />;
    } else {
      headerContent =  null;
    }

    return (
      <div className='dropdown-header' onClick={this.handleClick} style={isOpen ? { 'transition': 'all 0.1s', 'transform': 'rotate(180deg)' } : { 'transition': 'all 0.1s', 'transform': 'rotate(0deg)' }}>
        {headerContent}
      </div>
    );
  }

  render() {
    const { className, children, style, contentStyle, tagStyle, open, noDropdownStyle, showTag, inline, isSlide } = this.props;
    let { isOpen, } = this.state;
    if(open != undefined) isOpen = open; // open props overrides

    return (
      <div className={`dropdown ${className} ${ inline ? 'inline' : '' }`} onBlur={ inline ? null : this.handleBlur}  tabIndex='-1' style={style} >
        {!isSlide ? this.renderHeader(isOpen) : null }   
        { isOpen ?
          <div className={`dropdown-content ${noDropdownStyle ? 'no-style' : ''}`} style={contentStyle} >
            {isSlide && inline ? <div className='line-break' />: null }   
            { showTag && !inline ? <div className='dropdown-tag' style={tagStyle}></div> : null }
            {children}
          </div>
        : null }
        {isSlide ? this.renderHeader(isOpen) : null}
      </div>
    );
  }
}

export default Dropdown;
