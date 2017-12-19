import './button.scss';
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
  
  // replaced css logic into javascript 
  handleHover = (aa) => {
    this.setState({
      isHovering: true
    });
    console.log('hovering');
    console.log(this.state);
  }

  handleHoverOut = (aa) => {
    this.setState({
      isHovering: false,
    });
    console.log('Hovering out');
    console.log(this.state);
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

    const buttonConfirm = {
      backgroundColor: '#5cb85c'
    };

    const buttonCancel = {
      backgroundColor: '#cc0000'
    };

    const buttonSmall = {
      height: 30
    };

    const buttonSmallI = {
      fontSize: '1.5em'
    };

    const buttomElementI = {
      paddingRight: 5,
      color: '#fff'
    };

    let buttonType = {};

    /* js stylesheet ends here */
    
    const { children, type, className, href, onClick, style, color, buttonStyle } = this.props;
    const componentStyle = { ...style, };

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

    console.log(this.props.type, 'button type $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ ');
    const clickFunc = this.getClickFunction();
    const btn = <div className={`button ${className} ${type}`} style={{ ...buttonClass, ...componentStyle }}>
        <button onClick={clickFunc} style={{ ...buttonElement,...buttonType, ...buttonClass, ...buttonSmall }} onMouseOver={() => {
            this.handleHover(this);
          }} onMouseOut={() => {
            this.handleHoverOut(this);
          }}>
          {children}
        </button>
      </div>;

    return href
      ? <Link to={href}>{btn}</Link>
      : btn;
  }
}

export default Button;
