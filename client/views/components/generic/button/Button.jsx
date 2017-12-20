import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { string, any, func } from 'prop-types';

class Button extends Component {
  
  state = {
    isHovering: false,
  }
  static defaultProps = {
    className: '',
    href: '',
    type: '',
    onClick: () => {},
  }

  static propTypes = {
    children: any.isRequired,
    className: string,
    href: string,
    type: string,
    onClick: func
  }
  
  handleHover = (aa) => {
    this.setState({
      isHovering: true
    });
  }

  handleHoverOut = (aa) => {
    this.setState({
      isHovering: false,
    });
  }

  getClickFunction = () => {
    const { onClick, handleClick } = this.props;    
    if (handleClick) {
      return handleClick;
    } else {
      return onClick;
    }
  }

  render() {

    const { isHovering } = this.state;
    const buttonClass = {
      height: 50,
      width: '100%',
      display: 'flex'
    };
    const buttonElement = {
      width: 'inherit',
      border: 'none',
      borderRadius: 5,
      color: '#fff',
      background: '#999',
      'fontSize': '1em',
      cursor: 'pointer',
      outline: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };

    const buttonSize = {
      height: 30
    };

    let buttonType = {};
    
    const { children, type, href, onClick, style, color, buttonStyle } = this.props;
    const componentStyle = { ...style, ...color,...buttonStyle };

    if(isHovering) {
      buttonElement.boxShadow= 'inset 0 0 100px 100px rgba(255, 255, 255, 0.3)';
    }
    
    switch(type){
      case 'button':
        buttonType = { backgroundColor: '#999' };
        break;
      case 'confirm': 
         buttonType = { backgroundColor: '#5cb85c' };
         break;
      case 'cancel':
          buttonType = { backgroundColor: '#cc0000' };
          break;
      default: 
        buttonType = { backgroundColor: '#999' };
    }

    const clickFunc = this.getClickFunction();
    const btn = <div style={{ ...buttonClass, ...componentStyle }}>
        <button
         className={`button ${className} ${type}`}
         onClick={clickFunc}
         style={{ ...buttonElement, ...buttonType, ...buttonClass, ...buttonSize }} 
         onMouseOver={this.handleHover(this)} 
         onMouseOut={this.handleHoverOut(this)}>
          {children}
        </button>
      </div>;

    return href
      ? <Link to={href}>{btn}</Link>
      : btn;
  }
}

export default Button;
