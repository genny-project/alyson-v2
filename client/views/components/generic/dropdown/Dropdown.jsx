import './dropdown.scss';
import React, { Component } from 'react';
import { string, any, bool, object, func } from 'prop-types';
import components from 'utils/genny/layout-loader/components.js';
import { JSONLoader } from '@genny-project/layson';
import { Fade, Slide, Scale } from 'views/utils/animations';

class Dropdown extends Component {
  static defaultProps = {
    className: '',
    opened: null,
    showTag: true,
    inline: false,
    isSlide: true,
    animateHeader: true,
    animateFooter: true,
    closeOnChildClick: true,
  }

  static propTypes = {
    className: string,
    style: object,
    children: any,
    open: bool,
    header: any,
    footer: any,
    showTag: bool,
    inline: bool,
    contentStyle: object,
    tagStyle: object,
    noDropdownStyle: string,
    isSlide: bool,
    animateHeader: bool,
    animateFooter: bool,
    onBlur: func,
    closeOnChildClick: bool,
  }

  state = {
    isOpen: false
  }

  handleBlur = (event) => {

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
    else {
      this.props.closeOnChildClick
        ? this.setState({
          isOpen: false,
          parentIsOpen: false,
        })
        : null;
    }
  }

  handleClick = () => {
    this.setState({ isOpen: !this.state.isOpen});
  }

  renderHeader = (isOpen) => {

    const { header, animateHeader } = this.props;

    let headerContent;

    if (header) {
      if (header.$$typeof ) {
        headerContent = header;
      } else if (Array.isArray(header)) {
        let layout = {layout: header};
        headerContent = <JSONLoader layout={layout} componentCollection={components} />;
      } else {
        headerContent =  null;
      }

      return (
        <div className='dropdown-header' onClick={this.handleClick} style={isOpen && animateHeader ? { 'transition': 'all 0.1s', 'transform': 'rotate(180deg)' } : { 'transition': 'all 0.1s', 'transform': 'rotate(0deg)' }}>
          {headerContent}
        </div>
      );
    }
  }

  renderFooter = (isOpen) => {

    const { footer, animateFooter } = this.props;

    let footerContent;

    if (footer) {
      if (footer.$$typeof ) {
        footerContent = footer;
      } else if (Array.isArray(footer)) {
        let layout = {layout: footer};
        footerContent = <JSONLoader layout={layout} componentCollection={components} />;
      } else {
        footerContent =  null;
      }

      return (
        <div className='dropdown-footer' onClick={this.handleClick} style={isOpen && animateFooter ? { 'transition': 'all 0.1s', 'transform': 'rotate(180deg)' } : { 'transition': 'all 0.1s', 'transform': 'rotate(0deg)' }}>
          {footerContent}
        </div>
      );
    }
  }

  render() {
    const { className, children, style, contentStyle, tagStyle, open, noDropdownStyle, showTag, inline, isSlide } = this.props;
    let { isOpen, } = this.state;
    if(open != undefined || open != null) isOpen = open; // open props overrides

    return (
      <div className={`dropdown ${className} ${ inline ? 'inline' : '' }`} onBlur={ inline ? null : this.handleBlur} tabIndex='-1' style={{...style}} >
        {!isSlide ? this.renderHeader(isOpen) : null }
        { isOpen ?
          <div className={`dropdown-content ${noDropdownStyle ? 'no-style' : ''}`} style={contentStyle} >
            {isSlide && inline ? <div className='line-break' />: null }
            { showTag && !inline ? <div className='dropdown-tag' style={tagStyle}></div> : null }
            {children}
          </div>
        : null }
        {/* <Slide inProp={isOpen}>
          <div className={`dropdown-content ${noDropdownStyle ? 'no-style' : ''}`} style={contentStyle} >
            {isSlide && inline ? <div className='line-break' />: null }
            { showTag && !inline ? <div className='dropdown-tag' style={tagStyle}></div> : null }
            {children}
          </div>
        </Slide> */}
        {isSlide ? this.renderHeader(isOpen) : null}
        {this.renderFooter(isOpen)}
      </div>
    );
  }
}

export default Dropdown;
