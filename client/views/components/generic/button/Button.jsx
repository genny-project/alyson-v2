import './button.scss';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { string, any, func } from 'prop-types';

class Button extends Component {
  
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

  getClickFunction = () => {
    const { onClick, handleClick } = this.props;
    
    if (handleClick) {
      return handleClick;
    } else {
      return onClick;
    }
  }

  render() {

    /* js stylesheet */

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
      backgroundColor: '#999',
      cursor: 'pointer',
      outline: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };

    const buttonConfirm = {
      backgroundColor: '#5cb85c'
    };

    const buttonCancel = {
      backgroundColor: '#cc0000'
    };


    const buttonSmall = {
      height: 30,
      fontSize: '1.5em'
    };

    const buttonSmallI = {
      fontSize: '1.5em'
    };

    const buttomElementI = {
      paddingRight: 5,
      color: '#fff'
    };

    /* js stylesheet ends here */
    
    const { children, type, className, href, onClick, style, color, buttonStyle } = this.props;
    const componentStyle = { ...style, };
    const clickFunc = this.getClickFunction();

    const btn = (
      <div className={`button ${className} ${type}`} style={componentStyle}>
        <button onClick={clickFunc} style={{ ...buttonStyle }}>{children}</button>
      </div>
    );

    return href
      ? <Link to={href}>{btn}</Link>
      : btn;
  }
}

export default Button;
