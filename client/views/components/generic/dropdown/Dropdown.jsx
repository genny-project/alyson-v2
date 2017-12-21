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
        return <JSONLoader layout={layout} componentCollection={components} />;
      } else {
        return null;  
      } 
    } else {
      return null;
    }
  }

  render() {
             /* Stylesheet */
             const dropdown = { display: 'flex', alignItems: 'center', flexDirection: 'column', cursor: 'pointer', position: 'relative' };
             const dropdownHeader = { zIndex: 9 };
             const dropdownContent = { position: 'absolute', zIndex: 10, top: 40, left: 50, transform: 'translate(-50%)', padding: '10px 0 20px', margin: 0 };
             const inlineDropdownContent = { position: 'initial', transform: 'initial', padding: 10, width: '100%' };
             const dropdownTag = { height: 0, borderStyle: 'solid', borderWidth: '0px 9px 10px', borderColor: 'transparent transparent #DDD', position: 'absolute',top: '-10px',left: '50%', transform: 'translate(-50%)'  };
             /* Stylesheet Ends here */

             const { className, children, style, contentStyle, tagStyle, header, open, noDropdownStyle, showTag, inline } = this.props;
             let { isOpen } = this.state;
             if (open != undefined) isOpen = open; // open props overrides
             return <div className={`dropdown ${className} ${inline ? 'inline' : ''}`} onClick={this.handleClick} onBlur={this.handleBlur} tabIndex="-1" style={{...dropdown,...style}}>
                 <div className="dropdown-header" style={{...dropdownHeader}}>
                   {this.renderHeader()}
                 </div>
                 {isOpen ? <div className={`dropdown-content ${noDropdownStyle ? 'no-style' : ''}`} style={{...dropdownContent,...contentStyle}}>
                     {showTag && !inline ? <div className="dropdown-tag" style={tagStyle} /> : null}
                     {children}
                   </div> : null}
               </div>;
           }
}

export default Dropdown;
