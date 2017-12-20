import './dropdown.scss';
import React, { Component } from 'react';
import { string, any, bool, element } from 'prop-types';
import { LayoutLoader } from 'utils/genny/layout-loader';

class Dropdown extends Component {
  static defaultProps = {
    className: '',
    opened: null,
    showTag: true,
    inline: false,
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
    open: bool,
    header: any,
    showTag: bool,
    inline: bool,
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


  handleClick = (e) => {
    this.setState({ isOpen: !this.state.isOpen});
  }

  renderHeader = () => {
    const { header } = this.props;

    if (header ){
      if (header.$$typeof ) {
        return header;
      } else if (Array.isArray(header)) {
        let layout = {layout: header};
        return <LayoutLoader layout={layout} />;
      } else {
        return null;  
      } 
    } else {
      return null;
    }
  }

  render() {
    const { className, children, style, contentStyle, tagStyle, header, open, noDropdownStyle, showTag, inline,  } = this.props;
    let { isOpen, } = this.state;
    if(open != undefined) isOpen = open; // open props overrides

    return (
      <div className={`dropdown ${className} ${ inline ? 'inline' : '' }`} onClick={this.handleClick} onBlur={this.handleBlur}  tabIndex='-1' style={style} >
        <div className='dropdown-header'>
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
